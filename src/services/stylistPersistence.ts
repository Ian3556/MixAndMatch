import AsyncStorage from '@react-native-async-storage/async-storage';

import type { PreferenceModel } from '@/features/stylist/personalization/preferenceModel';
import { EMPTY_PREFERENCE_MODEL } from '@/features/stylist/personalization/preferenceModel';
import type { WardrobeHistory } from '@/features/stylist/personalization/wardrobeHistory';
import { EMPTY_WARDROBE_HISTORY } from '@/features/stylist/personalization/wardrobeHistory';
import type { StylingRecommendation, StylingRequest } from '@/features/stylist/types';

export type OutfitFeedbackState = {
  sentiment?: 'like' | 'dislike';
  woreAt?: string;
};

export type SavedStylingLook = {
  recommendation: StylingRecommendation;
  request: StylingRequest;
  savedAt: string;
};

export type StylistUserState = {
  preferenceModel: PreferenceModel;
  history: WardrobeHistory;
  savedLooks: SavedStylingLook[];
  feedbackByOutfit: Record<string, OutfitFeedbackState>;
};

type PersistedStylistState = StylistUserState & { version: 1 };

export const EMPTY_STYLIST_USER_STATE: StylistUserState = {
  preferenceModel: EMPTY_PREFERENCE_MODEL,
  history: EMPTY_WARDROBE_HISTORY,
  savedLooks: [],
  feedbackByOutfit: {},
};

const STORAGE_PREFIX = 'mix-and-match:stylist-v1:';

export async function loadStylistUserState(userId: string): Promise<StylistUserState> {
  const value = await AsyncStorage.getItem(storageKey(userId));
  if (!value) return cloneEmptyState();
  try {
    return parseState(JSON.parse(value));
  } catch {
    return cloneEmptyState();
  }
}

export async function saveStylistUserState(userId: string, state: StylistUserState): Promise<void> {
  const payload: PersistedStylistState = { version: 1, ...state };
  await AsyncStorage.setItem(storageKey(userId), JSON.stringify(payload));
}

function parseState(value: unknown): StylistUserState {
  if (!isRecord(value) || value.version !== 1) return cloneEmptyState();
  const preferenceModel = parsePreferenceModel(value.preferenceModel);
  const history = parseHistory(value.history);
  const savedLooks = Array.isArray(value.savedLooks)
    ? value.savedLooks.filter(isSavedLook).slice(0, 50)
    : [];
  const feedbackByOutfit = isRecord(value.feedbackByOutfit)
    ? Object.fromEntries(
        Object.entries(value.feedbackByOutfit)
          .filter((entry): entry is [string, OutfitFeedbackState] => isFeedbackState(entry[1]))
          .slice(0, 500),
      )
    : {};
  return { preferenceModel, history, savedLooks, feedbackByOutfit };
}

function parsePreferenceModel(value: unknown): PreferenceModel {
  if (!isRecord(value)) return { ...EMPTY_PREFERENCE_MODEL };
  const preferences = Array.isArray(value.preferences)
    ? value.preferences
        .filter(
          (preference): preference is PreferenceModel['preferences'][number] =>
            isRecord(preference) &&
            ['style', 'color', 'fit', 'item'].includes(String(preference.type)) &&
            typeof preference.value === 'string' &&
            typeof preference.weight === 'number' &&
            Number.isFinite(preference.weight),
        )
        .map((preference) => ({
          ...preference,
          weight: Math.min(1, Math.max(-1, preference.weight)),
        }))
        .slice(0, 500)
    : [];
  const neverRecommendItemIds = readStringArray(value.neverRecommendItemIds, 500);
  return { preferences, neverRecommendItemIds };
}

function parseHistory(value: unknown): WardrobeHistory {
  if (!isRecord(value)) return { ...EMPTY_WARDROBE_HISTORY };
  const items = Array.isArray(value.items)
    ? value.items
        .filter(
          (entry): entry is WardrobeHistory['items'][number] =>
            isRecord(entry) &&
            typeof entry.itemId === 'string' &&
            isCount(entry.recommendationCount) &&
            isCount(entry.wearCount),
        )
        .slice(0, 1000)
    : [];
  const outfits = Array.isArray(value.outfits)
    ? value.outfits
        .filter(
          (entry): entry is WardrobeHistory['outfits'][number] =>
            isRecord(entry) &&
            typeof entry.outfitId === 'string' &&
            typeof entry.signature === 'string' &&
            Array.isArray(entry.itemIds) &&
            entry.itemIds.every((itemId) => typeof itemId === 'string') &&
            isCount(entry.recommendationCount) &&
            isCount(entry.wearCount),
        )
        .slice(0, 250)
    : [];
  return { items, outfits };
}

function isSavedLook(value: unknown): value is SavedStylingLook {
  if (!isRecord(value) || typeof value.savedAt !== 'string' || !isRecord(value.recommendation)) {
    return false;
  }
  return (
    typeof value.recommendation.score === 'number' &&
    typeof value.recommendation.explanation === 'string' &&
    isRecord(value.recommendation.outfit) &&
    typeof value.recommendation.outfit.id === 'string' &&
    isRecord(value.request)
  );
}

function isFeedbackState(value: unknown): value is OutfitFeedbackState {
  if (!isRecord(value)) return false;
  const sentiment = value.sentiment;
  const woreAt = value.woreAt;
  return (
    (sentiment === undefined || sentiment === 'like' || sentiment === 'dislike') &&
    (woreAt === undefined || typeof woreAt === 'string')
  );
}

function isCount(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0;
}

function readStringArray(value: unknown, maximum: number): string[] {
  return Array.isArray(value)
    ? Array.from(
        new Set(value.filter((entry): entry is string => typeof entry === 'string')),
      ).slice(0, maximum)
    : [];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function cloneEmptyState(): StylistUserState {
  return {
    preferenceModel: { preferences: [], neverRecommendItemIds: [] },
    history: { items: [], outfits: [] },
    savedLooks: [],
    feedbackByOutfit: {},
  };
}

function storageKey(userId: string): string {
  return `${STORAGE_PREFIX}${userId}`;
}

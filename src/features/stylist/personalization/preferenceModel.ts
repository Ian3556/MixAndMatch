import type { ClothingItem, Outfit, StyleProfile } from '../types';
import { getOutfitItems } from '../types';

export type LearnedPreferenceType = 'style' | 'color' | 'fit' | 'item';

export type LearnedPreference = {
  type: LearnedPreferenceType;
  value: string;
  weight: number;
};

export type PreferenceModel = {
  preferences: LearnedPreference[];
  neverRecommendItemIds: string[];
};

export const EMPTY_PREFERENCE_MODEL: PreferenceModel = {
  preferences: [],
  neverRecommendItemIds: [],
};

export function updateLearnedPreferences(
  model: PreferenceModel,
  signals: readonly Omit<LearnedPreference, 'weight'>[],
  delta: number,
): PreferenceModel {
  const indexed = new Map(
    model.preferences.map((preference) => [preferenceKey(preference), preference]),
  );
  for (const signal of signals) {
    const key = preferenceKey(signal);
    const current = indexed.get(key)?.weight ?? 0;
    const weight = clamp(current + delta, -1, 1);
    indexed.set(key, { ...signal, weight });
  }
  return {
    ...model,
    preferences: [...indexed.values()]
      .filter((preference) => Math.abs(preference.weight) >= 0.01)
      .sort((left, right) => preferenceKey(left).localeCompare(preferenceKey(right)))
      .slice(0, 500),
  };
}

export function setNeverRecommendItem(model: PreferenceModel, itemId: string): PreferenceModel {
  return {
    ...model,
    neverRecommendItemIds: Array.from(new Set([...model.neverRecommendItemIds, itemId])),
  };
}

export function getOutfitPreferenceSignals(outfit: Outfit): Omit<LearnedPreference, 'weight'>[] {
  return uniqueSignals(getOutfitItems(outfit).flatMap(getItemSignals));
}

export function scoreUserPreference(
  outfit: Outfit,
  profile: StyleProfile,
  model: PreferenceModel,
): number {
  const items = getOutfitItems(outfit);
  const preferences = new Map(
    model.preferences.map((preference) => [preferenceKey(preference), preference.weight]),
  );
  const learnedSignals = uniqueSignals(items.flatMap(getItemSignals));
  const learned = learnedSignals.length
    ? learnedSignals.reduce(
        (total, signal) => total + (preferences.get(preferenceKey(signal)) ?? 0),
        0,
      ) / learnedSignals.length
    : 0;

  const profileSignals: number[] = [];
  for (const item of items) {
    if (item.primaryColor && profile.favoriteColors.includes(item.primaryColor))
      profileSignals.push(1);
    if (item.fit && profile.preferredFits.includes(item.fit)) profileSignals.push(1);
    if (item.styles?.some((style) => profile.preferredStyles.includes(style)))
      profileSignals.push(1);
    if (
      item.occasions?.some((occasion) => profile.preferredOccasions?.includes(occasion) === true)
    ) {
      profileSignals.push(1);
    }
  }
  const profileAverage = profileSignals.length > 0 ? average(profileSignals) : 0;
  return clamp(60 + learned * 30 + profileAverage * 10, 0, 100);
}

function getItemSignals(item: ClothingItem): Omit<LearnedPreference, 'weight'>[] {
  return [
    { type: 'item', value: item.id },
    ...(item.primaryColor ? [{ type: 'color' as const, value: item.primaryColor }] : []),
    ...(item.fit ? [{ type: 'fit' as const, value: item.fit }] : []),
    ...(item.styles ?? []).map((style) => ({ type: 'style' as const, value: style })),
  ];
}

function uniqueSignals(
  signals: readonly Omit<LearnedPreference, 'weight'>[],
): Omit<LearnedPreference, 'weight'>[] {
  return [...new Map(signals.map((signal) => [preferenceKey(signal), signal])).values()];
}

function preferenceKey(preference: Pick<LearnedPreference, 'type' | 'value'>): string {
  return `${preference.type}:${preference.value}`;
}

function average(values: readonly number[]): number {
  return values.reduce((total, value) => total + value, 0) / values.length;
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}

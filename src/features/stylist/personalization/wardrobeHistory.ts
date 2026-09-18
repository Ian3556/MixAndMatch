import type { Outfit, StylingRecommendation } from '../types';
import { getOutfitItems, getOutfitSignature } from '../types';

export type WardrobeItemHistory = {
  itemId: string;
  lastRecommendedAt?: string;
  lastWornAt?: string;
  recommendationCount: number;
  wearCount: number;
};

export type OutfitHistoryEntry = {
  outfitId: string;
  signature: string;
  itemIds: string[];
  lastRecommendedAt?: string;
  lastWornAt?: string;
  recommendationCount: number;
  wearCount: number;
};

export type WardrobeHistory = {
  items: WardrobeItemHistory[];
  outfits: OutfitHistoryEntry[];
};

export const EMPTY_WARDROBE_HISTORY: WardrobeHistory = { items: [], outfits: [] };

export function recordRecommendations(
  history: WardrobeHistory,
  recommendations: readonly StylingRecommendation[],
  timestamp: string,
): WardrobeHistory {
  let next = history;
  for (const recommendation of recommendations) {
    next = updateHistory(next, recommendation.outfit, 'recommended', timestamp);
  }
  return trimHistory(next);
}

export function recordWornOutfit(
  history: WardrobeHistory,
  outfit: Outfit,
  timestamp: string,
): WardrobeHistory {
  return trimHistory(updateHistory(history, outfit, 'worn', timestamp));
}

export function scoreWardrobeRotation(outfit: Outfit, history: WardrobeHistory, now: Date): number {
  const scores = getOutfitItems(outfit).map((item) => {
    const itemHistory = history.items.find((entry) => entry.itemId === item.id);
    if (!itemHistory) return 92;
    const recommendedDays = daysSince(itemHistory.lastRecommendedAt, now);
    const wornDays = daysSince(itemHistory.lastWornAt, now);
    let score = 88;
    if (recommendedDays < 1) score -= 48;
    else if (recommendedDays < 3) score -= 30;
    else if (recommendedDays < 7) score -= 14;
    if (wornDays < 1) score -= 22;
    else if (wornDays < 3) score -= 12;
    score -= Math.min(12, Math.max(0, itemHistory.recommendationCount - itemHistory.wearCount) * 2);
    return clamp(score, 0, 100);
  });
  return scores.length > 0 ? average(scores) : 50;
}

export function scoreOutfitNovelty(outfit: Outfit, history: WardrobeHistory, now: Date): number {
  const itemIds = new Set(getOutfitItems(outfit).map((item) => item.id));
  const signature = getOutfitSignature(outfit);
  let strongestPenalty = 0;
  for (const entry of history.outfits) {
    const days = daysSince(entry.lastRecommendedAt, now);
    if (days > 30) continue;
    if (entry.signature === signature)
      strongestPenalty = Math.max(strongestPenalty, days < 7 ? 78 : 55);
    else {
      const similarity = jaccard(itemIds, new Set(entry.itemIds));
      const recency = days < 3 ? 1 : days < 7 ? 0.7 : 0.4;
      strongestPenalty = Math.max(strongestPenalty, similarity * recency * 60);
    }
  }
  return clamp(92 - strongestPenalty, 0, 100);
}

function updateHistory(
  history: WardrobeHistory,
  outfit: Outfit,
  action: 'recommended' | 'worn',
  timestamp: string,
): WardrobeHistory {
  const itemMap = new Map(history.items.map((entry) => [entry.itemId, { ...entry }]));
  const outfitMap = new Map(history.outfits.map((entry) => [entry.signature, { ...entry }]));
  const items = getOutfitItems(outfit);
  for (const item of items) {
    const current = itemMap.get(item.id) ?? {
      itemId: item.id,
      recommendationCount: 0,
      wearCount: 0,
    };
    itemMap.set(item.id, {
      ...current,
      ...(action === 'recommended'
        ? {
            lastRecommendedAt: timestamp,
            recommendationCount: current.recommendationCount + 1,
          }
        : { lastWornAt: timestamp, wearCount: current.wearCount + 1 }),
    });
  }

  const signature = getOutfitSignature(outfit);
  const currentOutfit = outfitMap.get(signature) ?? {
    outfitId: outfit.id,
    signature,
    itemIds: items.map((item) => item.id),
    recommendationCount: 0,
    wearCount: 0,
  };
  outfitMap.set(signature, {
    ...currentOutfit,
    outfitId: outfit.id,
    itemIds: items.map((item) => item.id),
    ...(action === 'recommended'
      ? {
          lastRecommendedAt: timestamp,
          recommendationCount: currentOutfit.recommendationCount + 1,
        }
      : { lastWornAt: timestamp, wearCount: currentOutfit.wearCount + 1 }),
  });
  return { items: [...itemMap.values()], outfits: [...outfitMap.values()] };
}

function trimHistory(history: WardrobeHistory): WardrobeHistory {
  return {
    items: history.items.slice(-1000),
    outfits: [...history.outfits]
      .sort((left, right) =>
        (right.lastRecommendedAt ?? right.lastWornAt ?? '').localeCompare(
          left.lastRecommendedAt ?? left.lastWornAt ?? '',
        ),
      )
      .slice(0, 250),
  };
}

function daysSince(timestamp: string | undefined, now: Date): number {
  if (!timestamp) return Number.POSITIVE_INFINITY;
  const parsed = Date.parse(timestamp);
  if (!Number.isFinite(parsed)) return Number.POSITIVE_INFINITY;
  return Math.max(0, (now.getTime() - parsed) / 86_400_000);
}

function jaccard(left: ReadonlySet<string>, right: ReadonlySet<string>): number {
  const intersection = [...left].filter((value) => right.has(value)).length;
  const union = new Set([...left, ...right]).size;
  return union === 0 ? 0 : intersection / union;
}

function average(values: readonly number[]): number {
  return values.reduce((total, value) => total + value, 0) / values.length;
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}

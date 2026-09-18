import { describe, expect, it } from 'vitest';

import { normalizeClothingItem } from '../engine/normalizeClothingItem';
import { getNormalizedStylingRecommendations } from '../engine/recommendationEngine';
import {
  applyNeverRecommendFeedback,
  applyOutfitFeedback,
} from '../personalization/feedbackEngine';
import { EMPTY_PREFERENCE_MODEL } from '../personalization/preferenceModel';
import type { ClothingItem, StyleProfile } from '../types';
import type { WardrobeItem } from '@/types/wardrobe';

const profile: StyleProfile = {
  preferredStyles: [],
  favoriteColors: [],
  avoidedColors: [],
  preferredFits: [],
  preferredOccasions: [],
  dislikedCategories: [],
  dislikedItems: [],
};

describe('getNormalizedStylingRecommendations', () => {
  it('returns three distinct university looks for the V1 definition-of-done scenario', () => {
    const wardrobe = [
      item('linen-shirt', 'top', {
        primaryColor: 'cream',
        styles: ['minimal'],
        occasions: ['university'],
        warmth: 2,
      }),
      item('black-tee', 'top', {
        primaryColor: 'black',
        styles: ['minimal', 'casual'],
        occasions: ['university'],
        warmth: 2,
      }),
      item('navy-polo', 'top', {
        primaryColor: 'navy',
        styles: ['classic'],
        occasions: ['university'],
        warmth: 3,
      }),
      item('grey-trousers', 'bottom', {
        primaryColor: 'grey',
        fit: 'straight',
        styles: ['minimal'],
        occasions: ['university'],
        warmth: 3,
      }),
      item('black-trousers', 'bottom', {
        primaryColor: 'black',
        fit: 'wide',
        styles: ['minimal'],
        occasions: ['university'],
        warmth: 3,
      }),
      item('blue-jeans', 'bottom', {
        primaryColor: 'blue',
        fit: 'straight',
        styles: ['casual'],
        occasions: ['university'],
        warmth: 3,
      }),
      item('white-sneakers', 'shoes', {
        primaryColor: 'white',
        styles: ['minimal', 'casual'],
        occasions: ['university'],
      }),
      item('black-loafers', 'shoes', {
        primaryColor: 'black',
        styles: ['classic', 'smart-casual'],
        occasions: ['university'],
      }),
      item('watch', 'accessory', { primaryColor: 'grey', styles: ['minimal'] }),
      item('heavy-coat', 'outerwear', { primaryColor: 'black', warmth: 9 }),
    ];
    const result = getNormalizedStylingRecommendations({
      wardrobe,
      styleProfile: { ...profile, preferredStyles: ['minimal'], favoriteColors: ['black'] },
      request: { occasion: 'university', desiredStyle: ['minimal'], temperature: 30 },
      now: new Date('2026-09-17T00:00:00.000Z'),
    });

    expect(result.recommendations).toHaveLength(3);
    expect(new Set(result.recommendations.map((entry) => entry.outfit.id)).size).toBe(3);
    expect(
      result.recommendations.every((entry) => entry.outfit.outerwear?.id !== 'heavy-coat'),
    ).toBe(true);
    expect(result.recommendations.every((entry) => entry.explanation.length > 0)).toBe(true);
  });

  it('does not crash with missing optional metadata or a small wardrobe', () => {
    const result = getNormalizedStylingRecommendations({
      wardrobe: [item('top', 'top'), item('bottom', 'bottom')],
      styleProfile: profile,
      request: { occasion: 'university', desiredStyle: ['minimal'], temperature: 30 },
      now: new Date('2026-09-17T00:00:00.000Z'),
    });
    expect(result.recommendations).toHaveLength(1);
    expect(result.recommendations[0]?.explanation).toContain(
      'wardrobe metadata currently available',
    );
  });

  it('returns no result gracefully when no valid outfit structure exists', () => {
    const result = getNormalizedStylingRecommendations({
      wardrobe: [item('watch', 'accessory')],
      styleProfile: profile,
      request: {},
    });
    expect(result.recommendations).toEqual([]);
    expect(result.diagnostics.candidateCount).toBe(0);
  });

  it('honors never-recommend feedback in future results', () => {
    const wardrobe = [item('top-a', 'top'), item('top-b', 'top'), item('bottom', 'bottom')];
    const initial = getNormalizedStylingRecommendations({ wardrobe, styleProfile: profile });
    const first = initial.recommendations[0];
    if (!first) throw new Error('Expected a recommendation.');
    const model = applyNeverRecommendFeedback(EMPTY_PREFERENCE_MODEL, 'top-a');
    const next = getNormalizedStylingRecommendations({
      wardrobe,
      styleProfile: profile,
      preferenceModel: model,
    });
    expect(
      next.recommendations.every((recommendation) => recommendation.outfit.top?.id !== 'top-a'),
    ).toBe(true);
  });

  it('learns transparent, clamped preference weights from explicit feedback', () => {
    const result = getNormalizedStylingRecommendations({
      wardrobe: [item('top', 'top', { styles: ['minimal'] }), item('bottom', 'bottom')],
      styleProfile: profile,
    });
    const recommendation = result.recommendations[0];
    if (!recommendation) throw new Error('Expected a recommendation.');
    let model = EMPTY_PREFERENCE_MODEL;
    for (let count = 0; count < 20; count += 1) {
      model = applyOutfitFeedback(model, recommendation.outfit, 'like');
    }
    expect(model.preferences.length).toBeGreaterThan(0);
    expect(model.preferences.every((preference) => preference.weight <= 1)).toBe(true);
  });
});

describe('normalizeClothingItem', () => {
  it('normalizes legacy wardrobe fields and safely ignores malformed metadata', () => {
    const normalized = normalizeClothingItem(
      wardrobeItem({
        category: 'Tops',
        primaryColor: 'Navy Blue',
        secondaryColor: 'Ivory / Tan',
        metadata: { styles: ['Minimal', 42, null], warmth: 'unknown' },
      }),
    );
    expect(normalized.category).toBe('top');
    expect(normalized.primaryColor).toBe('navy');
    expect(normalized.secondaryColors).toEqual(['cream', 'beige']);
    expect(normalized.styles).toContain('minimal');
    expect(normalized.warmth).toBeUndefined();
  });
});

function item(
  id: string,
  category: ClothingItem['category'],
  extra: Partial<ClothingItem> = {},
): ClothingItem {
  return { id, name: id, category, ...extra };
}

function wardrobeItem(overrides: Partial<WardrobeItem>): WardrobeItem {
  return {
    id: 'item',
    userId: 'user',
    catalogProductId: null,
    name: 'Navy top',
    category: 'Tops',
    subcategory: null,
    primaryColor: null,
    secondaryColor: null,
    size: null,
    pattern: null,
    material: null,
    brand: null,
    season: null,
    occasion: null,
    notes: null,
    isFavorite: false,
    imageUrl: null,
    imageUrls: [],
    sourceUrl: null,
    sourceDomain: null,
    externalProductId: null,
    price: null,
    currency: null,
    importMethod: 'manual',
    sourceType: 'manual',
    metadata: {},
    deduplicationKey: 'manual:item',
    createdAt: '2026-09-17T00:00:00.000Z',
    updatedAt: '2026-09-17T00:00:00.000Z',
    ...overrides,
  };
}

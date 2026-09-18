import { describe, expect, it } from 'vitest';

import { selectDiverseRecommendations } from '../engine/diversityEngine';
import { scoreOutfit } from '../engine/scoringEngine';
import { STYLING_WEIGHTS } from '../data/stylingWeights';
import {
  EMPTY_PREFERENCE_MODEL,
  updateLearnedPreferences,
} from '../personalization/preferenceModel';
import {
  EMPTY_WARDROBE_HISTORY,
  recordRecommendations,
  scoreWardrobeRotation,
} from '../personalization/wardrobeHistory';
import type { ClothingItem, Outfit, StyleProfile, StylingRecommendation } from '../types';

const profile: StyleProfile = {
  preferredStyles: ['minimal'],
  favoriteColors: ['black'],
  avoidedColors: [],
  preferredFits: ['regular'],
  preferredOccasions: ['work'],
  dislikedCategories: [],
  dislikedItems: [],
};
const now = new Date('2026-09-17T00:00:00.000Z');

describe('scoreOutfit', () => {
  it('keeps the centrally configured weights normalized', () => {
    expect(Object.values(STYLING_WEIGHTS).reduce((total, weight) => total + weight, 0)).toBe(1);
  });

  it('scores compatible requested styles higher', () => {
    const compatible = outfit('compatible', [
      item('top-a', 'top', { styles: ['minimal'] }),
      item('bottom-a', 'bottom', { styles: ['classic'] }),
    ]);
    const incompatible = outfit('incompatible', [
      item('top-b', 'top', { styles: ['sporty'] }),
      item('bottom-b', 'bottom', { styles: ['formal'] }),
    ]);
    const context = {
      request: { desiredStyle: ['minimal'] },
      styleProfile: profile,
      preferenceModel: EMPTY_PREFERENCE_MODEL,
      history: EMPTY_WARDROBE_HISTORY,
      now,
    };
    expect(scoreOutfit(compatible, context).scoreBreakdown.style).toBeGreaterThan(
      scoreOutfit(incompatible, context).scoreBreakdown.style,
    );
  });

  it('scores matching occasions higher', () => {
    const matching = outfit('matching', [
      item('work-top', 'top', { occasions: ['work'], formality: 7 }),
      item('work-bottom', 'bottom', { occasions: ['business-casual'], formality: 7 }),
    ]);
    const casual = outfit('casual', [
      item('sport-top', 'top', { occasions: ['sport'], formality: 1 }),
      item('sport-bottom', 'bottom', { occasions: ['sport'], formality: 1 }),
    ]);
    const context = {
      request: { occasion: 'work' },
      styleProfile: profile,
      preferenceModel: EMPTY_PREFERENCE_MODEL,
      history: EMPTY_WARDROBE_HISTORY,
      now,
    };
    expect(scoreOutfit(matching, context).scoreBreakdown.occasion).toBeGreaterThan(
      scoreOutfit(casual, context).scoreBreakdown.occasion,
    );
  });

  it('applies explicit learned preferences', () => {
    const preferred = outfit('preferred', [item('favorite', 'top'), item('bottom-a', 'bottom')]);
    const neutral = outfit('neutral', [item('other', 'top'), item('bottom-b', 'bottom')]);
    const preferenceModel = updateLearnedPreferences(
      EMPTY_PREFERENCE_MODEL,
      [{ type: 'item', value: 'favorite' }],
      1,
    );
    const context = {
      request: {},
      styleProfile: profile,
      preferenceModel,
      history: EMPTY_WARDROBE_HISTORY,
      now,
    };
    expect(scoreOutfit(preferred, context).scoreBreakdown.preference).toBeGreaterThan(
      scoreOutfit(neutral, context).scoreBreakdown.preference,
    );
  });
});

describe('rotation and diversity', () => {
  it('penalizes repeatedly recommended pieces', () => {
    const recommendation = toRecommendation(
      outfit('repeat', [item('repeat-top', 'top'), item('repeat-bottom', 'bottom')]),
      90,
    );
    let history = EMPTY_WARDROBE_HISTORY;
    for (let count = 0; count < 4; count += 1) {
      history = recordRecommendations(history, [recommendation], now.toISOString());
    }
    expect(scoreWardrobeRotation(recommendation.outfit, history, now)).toBeLessThan(
      scoreWardrobeRotation(
        outfit('fresh', [item('fresh-top', 'top'), item('fresh-bottom', 'bottom')]),
        history,
        now,
      ),
    );
  });

  it('avoids near-identical top-three results when alternatives exist', () => {
    const candidates = [
      toRecommendation(
        outfit('one', [item('top-a', 'top'), item('bottom-a', 'bottom'), item('shoe-a', 'shoes')]),
        99,
      ),
      toRecommendation(
        outfit('two', [item('top-a', 'top'), item('bottom-a', 'bottom'), item('shoe-b', 'shoes')]),
        98,
      ),
      toRecommendation(
        outfit('three', [
          item('top-b', 'top'),
          item('bottom-b', 'bottom'),
          item('shoe-b', 'shoes'),
        ]),
        97,
      ),
      toRecommendation(outfit('four', [item('dress-a', 'dress'), item('shoe-c', 'shoes')]), 96),
    ];
    const selected = selectDiverseRecommendations(candidates, 3);
    expect(selected.map((candidate) => candidate.outfit.id)).toEqual(['one', 'three', 'four']);
  });
});

function item(
  id: string,
  category: ClothingItem['category'],
  extra: Partial<ClothingItem> = {},
): ClothingItem {
  return { id, name: id, category, ...extra };
}

function outfit(id: string, items: readonly ClothingItem[]): Outfit {
  const find = (category: ClothingItem['category']) =>
    items.find((candidate) => candidate.category === category);
  const accessories = items.filter((candidate) => candidate.category === 'accessory');
  return {
    id,
    ...(find('top') ? { top: find('top')! } : {}),
    ...(find('bottom') ? { bottom: find('bottom')! } : {}),
    ...(find('dress') ? { dress: find('dress')! } : {}),
    ...(find('shoes') ? { shoes: find('shoes')! } : {}),
    ...(find('outerwear') ? { outerwear: find('outerwear')! } : {}),
    ...(accessories.length > 0 ? { accessories } : {}),
    score: 0,
    scoreBreakdown: {
      style: 0,
      color: 0,
      occasion: 0,
      silhouette: 0,
      weather: 0,
      preference: 0,
      rotation: 0,
      novelty: 0,
    },
  };
}

function toRecommendation(candidate: Outfit, score: number): StylingRecommendation {
  return {
    outfit: { ...candidate, score },
    score,
    explanation: 'Test explanation.',
    scoreBreakdown: candidate.scoreBreakdown,
  };
}

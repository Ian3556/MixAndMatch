import { describe, expect, it } from 'vitest';

import {
  buildStylingInstructions,
  getRecommendationTitle,
} from '../presentation/stylingPresentation';
import type { ClothingItem, StylingRecommendation } from '../types';

function item(
  id: string,
  name: string,
  category: ClothingItem['category'],
  extra: Partial<ClothingItem> = {},
): ClothingItem {
  return { id, name, category, ...extra };
}

describe('styling presentation', () => {
  it('builds garment-specific instructions from the recommended pieces', () => {
    const instructions = buildStylingInstructions([
      item('top', 'Oxford Shirt', 'top', { subcategory: 'button-down' }),
      item('bottom', 'Tailored Trousers', 'bottom'),
      item('shoes', 'Leather Loafers', 'shoes'),
    ]);

    expect(instructions).toEqual([
      'Use a clean front tuck on Oxford Shirt to sharpen the line into Tailored Trousers.',
      'Roll the sleeves of Oxford Shirt once or twice for a lighter finish.',
      'Finish with Leather Loafers; the shoe pairing anchors the full look.',
    ]);
  });

  it('keeps dress and layering guidance tied to actual outfit items', () => {
    const instructions = buildStylingInstructions([
      item('dress', 'Column Dress', 'dress'),
      item('outerwear', 'Longline Coat', 'outerwear'),
      item('accessory', 'Silver Cuff', 'accessory'),
    ]);

    expect(instructions).toEqual([
      'Let Column Dress set the silhouette; keep the remaining layers restrained.',
      'Layer Longline Coat over Column Dress and keep the front open for a longer line.',
      'Keep Silver Cuff as the single focal accessory.',
    ]);
  });

  it('uses the first real style signal as the editorial look title', () => {
    const top = item('top', 'Boxy Tee', 'top', { styles: ['smart-casual'] });
    const scoreBreakdown = {
      style: 0,
      color: 0,
      occasion: 0,
      silhouette: 0,
      weather: 0,
      preference: 0,
      rotation: 0,
      novelty: 0,
    };
    const recommendation = {
      outfit: { id: 'look', top, score: 84, scoreBreakdown },
      score: 84,
      explanation: 'Test explanation',
      scoreBreakdown,
    } satisfies StylingRecommendation;

    expect(getRecommendationTitle(recommendation)).toBe('smart casual');
  });
});

import { describe, expect, it } from 'vitest';

import { generateOutfitCandidates } from '../engine/candidateGenerator';
import { validateOutfitConstraints } from '../engine/compatibilityEngine';
import type { ClothingItem, StyleProfile, StylingRequest } from '../types';
import { getOutfitItems } from '../types';
import { EMPTY_PREFERENCE_MODEL } from '../personalization/preferenceModel';

const profile: StyleProfile = {
  preferredStyles: [],
  favoriteColors: [],
  avoidedColors: [],
  preferredFits: [],
  preferredOccasions: [],
  dislikedCategories: [],
  dislikedItems: [],
};

describe('generateOutfitCandidates', () => {
  it('builds bounded separates, dress, outerwear, and accessory variants', () => {
    const wardrobe = [
      item('top', 'top'),
      item('bottom', 'bottom'),
      item('shoe', 'shoes'),
      item('dress', 'dress'),
      item('coat', 'outerwear'),
      item('watch', 'accessory'),
    ];
    const candidates = generateOutfitCandidates({ wardrobe, request: {}, styleProfile: profile });

    expect(candidates.length).toBeGreaterThan(0);
    expect(candidates.length).toBeLessThanOrEqual(240);
    expect(
      candidates.some((candidate) => candidate.top && candidate.bottom && candidate.shoes),
    ).toBe(true);
    expect(candidates.some((candidate) => candidate.dress && candidate.shoes)).toBe(true);
    expect(candidates.some((candidate) => candidate.outerwear)).toBe(true);
    expect(candidates.some((candidate) => (candidate.accessories?.length ?? 0) > 0)).toBe(true);
  });

  it('allows valid outfits when shoes are unavailable', () => {
    const candidates = generateOutfitCandidates({
      wardrobe: [item('top', 'top'), item('bottom', 'bottom')],
      request: {},
      styleProfile: profile,
    });
    expect(candidates).toHaveLength(1);
    expect(candidates[0]?.shoes).toBeUndefined();
  });

  it('keeps selected items in every candidate and removes excluded items', () => {
    const request: StylingRequest = {
      selectedItems: ['selected-top'],
      excludedItems: ['excluded-shoe'],
    };
    const candidates = generateOutfitCandidates({
      wardrobe: [
        item('selected-top', 'top'),
        item('other-top', 'top'),
        item('bottom', 'bottom'),
        item('excluded-shoe', 'shoes'),
        item('allowed-shoe', 'shoes'),
      ],
      request,
      styleProfile: profile,
    });

    expect(candidates.length).toBeGreaterThan(0);
    expect(
      candidates.every((candidate) =>
        getOutfitItems(candidate).some((candidateItem) => candidateItem.id === 'selected-top'),
      ),
    ).toBe(true);
    expect(
      candidates.every((candidate) =>
        getOutfitItems(candidate).every((candidateItem) => candidateItem.id !== 'excluded-shoe'),
      ),
    ).toBe(true);
  });

  it('rejects heavy outerwear in very hot weather while preserving lighter candidates', () => {
    const request: StylingRequest = { temperature: 31 };
    const candidates = generateOutfitCandidates({
      wardrobe: [
        item('top', 'top'),
        item('bottom', 'bottom'),
        item('coat', 'outerwear', { warmth: 9 }),
      ],
      request,
      styleProfile: profile,
    });
    const withCoat = candidates.find((candidate) => candidate.outerwear?.id === 'coat');
    const withoutCoat = candidates.find((candidate) => !candidate.outerwear);

    expect(withCoat).toBeDefined();
    expect(withoutCoat).toBeDefined();
    if (!withCoat) throw new Error('Expected an outerwear candidate.');
    expect(
      validateOutfitConstraints(withCoat, request, profile, EMPTY_PREFERENCE_MODEL),
    ).toMatchObject({
      valid: false,
      rejection: { reason: 'OUTERWEAR_TOO_WARM' },
    });
  });

  it('caps candidate growth for a 500-item wardrobe', () => {
    const wardrobe = Array.from({ length: 500 }, (_, index) =>
      item(`item-${index}`, index % 2 === 0 ? 'top' : 'bottom'),
    );
    const candidates = generateOutfitCandidates({ wardrobe, request: {}, styleProfile: profile });
    expect(candidates.length).toBeLessThanOrEqual(240);
  });
});

function item(
  id: string,
  category: ClothingItem['category'],
  extra: Partial<ClothingItem> = {},
): ClothingItem {
  return { id, name: id, category, ...extra };
}

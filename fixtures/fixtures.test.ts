import { describe, expect, it } from 'vitest';

import { exploreStyles, wardrobeCategories } from './categories';
import { allInspiration } from './inspiration';
import { outfitConcepts } from './outfits';
import { stylingTips } from './stylingTips';
import { wardrobeItems } from './wardrobe';

describe('Phase 2 fixture data', () => {
  it('uses stable unique ids in every fixture collection', () => {
    for (const collection of [
      wardrobeCategories,
      allInspiration,
      outfitConcepts,
      stylingTips,
      wardrobeItems,
    ]) {
      const ids = collection.map((item) => item.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  it('covers the required browse taxonomy and garment metadata', () => {
    expect(wardrobeCategories.map((item) => item.label)).toEqual(
      expect.arrayContaining([
        'Tops',
        'Bottoms',
        'Dresses',
        'Outerwear',
        'Shoes',
        'Bags',
        'Accessories',
      ]),
    );
    expect(exploreStyles).toEqual(
      expect.arrayContaining(['Minimalist', 'Streetwear', 'Travel', 'Evening']),
    );
    expect(wardrobeItems.every((item) => item.category && item.color && item.material)).toBe(true);
  });

  it('keeps outfit explanation fields complete for result and detail layouts', () => {
    expect(outfitConcepts.length).toBeGreaterThan(0);
    expect(
      outfitConcepts.every(
        (outfit) =>
          outfit.garments.length > 0 &&
          outfit.instructions.length > 0 &&
          outfit.colorRationale &&
          outfit.layeringNotes &&
          outfit.footwearNotes,
      ),
    ).toBe(true);
  });
});

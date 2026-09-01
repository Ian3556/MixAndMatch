import { describe, expect, it } from 'vitest';

import { isCatalogCategoryPair, normalizeCatalogCategory } from './taxonomy';

describe('catalog taxonomy', () => {
  it.each([
    ['Men Lifestyle Relaxed Tee', null, 'tops', 't_shirt'],
    ['Knitwear', 'Cardigan', 'knitwear', 'cardigan'],
    ['Pants', 'Cargo Trousers', 'bottoms', 'cargo_pants'],
    ['Outerwear', 'Down Jacket', 'outerwear', 'puffer'],
    ['Shoes', 'Running Trainers', 'footwear', 'sneakers'],
    ['Accessories', 'Baseball Hat', 'accessories', 'cap'],
  ])(
    'maps retailer language %s / %s to canonical taxonomy',
    (category, subcategory, expectedCategory, expectedSubcategory) => {
      expect(normalizeCatalogCategory(category, subcategory, 'Example product')).toMatchObject({
        categorySlug: expectedCategory,
        subcategorySlug: expectedSubcategory,
      });
    },
  );

  it('uses the reviewable other category rather than inventing a match', () => {
    expect(normalizeCatalogCategory('Special objects', null, 'Mystery item')).toEqual({
      categorySlug: 'other',
      subcategorySlug: 'other_clothing',
      confidence: 0.2,
      warnings: ['category_not_determined'],
    });
  });

  it('rejects a subcategory paired with the wrong root', () => {
    expect(isCatalogCategoryPair('tops', 'sneakers')).toBe(false);
    expect(isCatalogCategoryPair('footwear', 'sneakers')).toBe(true);
  });
});

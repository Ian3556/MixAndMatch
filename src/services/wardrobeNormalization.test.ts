import { describe, expect, it } from 'vitest';

import { buildWardrobeInput, normalizeClothingItem } from './wardrobeNormalization';

describe('wardrobe normalization', () => {
  it('normalizes a catalog item into the shared wardrobe input', () => {
    const input = buildWardrobeInput(
      {
        catalogProductId: 'product-1',
        sourceType: 'catalog',
        sourceUrl: ' https://shop.example.com/item ',
        name: ' Linen Shirt ',
        category: ' Tops ',
        color: 'Navy',
        size: 'M',
        primaryImageUrl: 'https://images.example.com/one.jpg',
        imageUrls: ['https://images.example.com/one.jpg', 'https://images.example.com/two.jpg'],
        metadata: { variantKey: 'navy-m' },
      },
      'catalog:product-1:navy-m',
    );

    expect(input).toMatchObject({
      catalogProductId: 'product-1',
      importMethod: 'catalog',
      sourceType: 'catalog',
      name: 'Linen Shirt',
      category: 'Tops',
      size: 'M',
      imageUrls: ['https://images.example.com/one.jpg', 'https://images.example.com/two.jpg'],
    });
  });

  it('rejects missing required normalized fields', () => {
    expect(() =>
      normalizeClothingItem({ sourceType: 'manual', name: ' ', category: 'Tops' }),
    ).toThrow('name is required');
  });
});

import { describe, expect, it } from 'vitest';

import type { WardrobeItem } from '@/types/wardrobe';

import {
  draftFromWardrobeItem,
  toWardrobeEditUpdate,
  validateWardrobeEdit,
} from './editWardrobeItem';

const item: WardrobeItem = {
  id: 'item-1',
  userId: 'user-1',
  catalogProductId: 'catalog-1',
  name: 'Cotton shirt',
  category: 'Tops',
  subcategory: 'Shirt',
  primaryColor: 'White',
  secondaryColor: null,
  size: 'M',
  pattern: null,
  material: 'Cotton',
  brand: 'COS',
  season: null,
  occasion: null,
  notes: null,
  description: 'A source-provided cotton shirt.',
  isFavorite: false,
  imageUrl: 'https://images.example.com/shirt.jpg',
  imageUrls: ['https://images.example.com/shirt.jpg'],
  sourceUrl: 'https://cos.com/products/shirt',
  sourceDomain: 'cos.com',
  externalProductId: 'sku-1',
  price: 200,
  currency: 'MYR',
  importMethod: 'catalog',
  sourceType: 'catalog',
  metadata: { variantKey: 'white-m' },
  deduplicationKey: 'catalog:catalog-1:white-m',
  createdAt: '2026-09-01T00:00:00Z',
  updatedAt: '2026-09-01T00:00:00Z',
};

describe('wardrobe editing', () => {
  it('updates editable fields without overwriting catalog or import provenance', () => {
    const draft = { ...draftFromWardrobeItem(item), material: '', notes: 'Fits well' };
    const update = toWardrobeEditUpdate(item, draft);
    expect(update).toMatchObject({
      material: null,
      notes: 'Fits well',
      metadata: {
        variantKey: 'white-m',
        productDescription: 'A source-provided cotton shirt.',
        metadataSuppressed: ['material'],
      },
    });
    expect(update).not.toHaveProperty('catalog_product_id');
    expect(update).not.toHaveProperty('source_url');
    expect(update).not.toHaveProperty('source_type');
    expect(update).not.toHaveProperty('deduplication_key');
  });

  it('rejects invalid image URLs and empty names', () => {
    expect(validateWardrobeEdit({ ...draftFromWardrobeItem(item), name: ' ' })).toContain('name');
    expect(
      validateWardrobeEdit({ ...draftFromWardrobeItem(item), imageUrl: 'file:///tmp/photo.jpg' }),
    ).toContain('HTTP');
  });
});

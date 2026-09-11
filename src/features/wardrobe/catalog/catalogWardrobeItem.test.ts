import { describe, expect, it } from 'vitest';

import type { CatalogProductDetail } from '@/catalog/browseTypes';

import { buildCatalogWardrobeInput } from './catalogWardrobeItem';

const product: CatalogProductDetail = {
  id: 'product-1',
  brandId: 'brand-1',
  brandName: 'COS',
  name: 'Oversized shirt',
  categoryId: 'category-1',
  categoryName: 'Tops',
  primaryColor: 'Navy',
  imageUrl: 'https://images.example.com/shirt.jpg',
  price: 100,
  currency: 'MYR',
  availability: 'in_stock',
  externalProductId: 'external-1',
  description: null,
  subcategoryName: 'Shirts',
  material: 'Cotton',
  sourceUrl: 'https://shop.example.com/shirt',
  sourceDomain: 'shop.example.com',
  imageUrls: ['https://images.example.com/shirt.jpg'],
  variants: [],
};

describe('catalog wardrobe adapter', () => {
  it('uses the shared normalized wardrobe representation', () => {
    expect(buildCatalogWardrobeInput(product, null)).toMatchObject({
      catalogProductId: 'product-1',
      sourceType: 'catalog',
      importMethod: 'catalog',
      brand: 'COS',
      category: 'Tops',
      deduplicationKey: 'catalog:product-1:default',
    });
  });

  it('creates a distinct physical-instance key only after duplicate confirmation', () => {
    expect(buildCatalogWardrobeInput(product, null, 'copy-2').deduplicationKey).toBe(
      'catalog:product-1:default:instance:copy-2',
    );
  });
});

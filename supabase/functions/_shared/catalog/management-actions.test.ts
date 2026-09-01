import { describe, expect, it } from 'vitest';

import { parseCatalogManagementAction } from './management-actions';

describe('catalogue management action parser', () => {
  const productId = '11111111-1111-4111-8111-111111111111';

  it('accepts bounded explicit import and maintenance commands', () => {
    expect(
      parseCatalogManagementAction({
        action: 'start_import',
        brandSlug: 'cos',
        urls: ['https://example.com/product/1'],
      }),
    ).toEqual({
      action: 'start_import',
      brandSlug: 'cos',
      urls: ['https://example.com/product/1'],
    });
    expect(
      parseCatalogManagementAction({
        action: 'start_maintenance',
        brandSlug: 'cos',
        operation: 'revalidate',
      }),
    ).toMatchObject({ operation: 'revalidate' });
    expect(
      parseCatalogManagementAction({
        action: 'start_product_maintenance',
        productId,
        operation: 'reenrich',
      }),
    ).toMatchObject({ productId, operation: 'reenrich' });
    expect(
      parseCatalogManagementAction({
        action: 'start_manual_import',
        brandSlug: 'cos',
        candidates: [
          {
            name: 'Manual source shirt',
            sourceUrl: 'https://approved.example/products/shirt',
            category: 'Shirt',
            images: [{ imageUrl: 'https://approved.example/images/shirt.jpg' }],
          },
        ],
      }),
    ).toMatchObject({
      candidates: [
        expect.objectContaining({ extractionMethod: 'manual', name: 'Manual source shirt' }),
      ],
    });
  });

  it('rejects unbounded imports, unknown actions, and empty edits', () => {
    expect(() =>
      parseCatalogManagementAction({
        action: 'start_import',
        brandSlug: 'cos',
        urls: Array.from({ length: 51 }, (_, index) => `https://example.com/${index}`),
      }),
    ).toThrow('1 to 50');
    expect(() => parseCatalogManagementAction({ action: 'crawl_everything' })).toThrow(
      'Unsupported',
    );
    expect(() =>
      parseCatalogManagementAction({ action: 'edit_product', productId, patch: {} }),
    ).toThrow('At least one');
  });

  it('validates editable price fields', () => {
    expect(
      parseCatalogManagementAction({
        action: 'edit_product',
        productId,
        patch: { currentPrice: 125, currency: 'USD', priceUnavailable: false },
      }),
    ).toMatchObject({ patch: { currentPrice: 125, currency: 'USD' } });
    expect(() =>
      parseCatalogManagementAction({
        action: 'edit_product',
        productId,
        patch: { currentPrice: -1 },
      }),
    ).toThrow('non-negative');
  });
});

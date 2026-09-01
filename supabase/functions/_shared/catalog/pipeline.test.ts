import { describe, expect, it } from 'vitest';

import { phaseACatalogProducts } from '@/fixtures/catalog/phaseAProducts';

import { processCatalogCandidates } from './pipeline';

describe('catalog pipeline', () => {
  it('processes the 20-product Phase A fixture through the complete offline pipeline', () => {
    const result = processCatalogCandidates([...phaseACatalogProducts], {
      brandSlug: 'cos',
      expectedBrandName: 'COS',
    });

    expect(result.products).toHaveLength(20);
    expect(result.duplicates).toHaveLength(0);
    expect(result.products.every((product) => product.validation.decision === 'validated')).toBe(
      true,
    );
    expect(new Set(result.products.map((product) => product.categorySlug)).size).toBeGreaterThan(5);
    expect(result.products.every((product) => product.styleTags.length > 0)).toBe(true);
  });

  it('rejects structurally unusable candidates and routes uncertain evidence to review', () => {
    const [rejected, review] = processCatalogCandidates(
      [
        { name: '', sourceUrl: 'not-a-url', extractionMethod: 'manual' },
        {
          name: 'Unknown Colour Shirt',
          category: 'Shirt',
          currentPrice: 50,
          currency: 'USD',
          sourceUrl: 'https://shop.example/unknown-shirt',
          extractionMethod: 'json_ld',
          images: [{ imageUrl: 'https://shop.example/images/unknown-shirt.jpg' }],
          materials: '100% cotton',
        },
      ],
      { brandSlug: 'example', expectedBrandName: 'Example' },
    ).products;

    expect(rejected?.validation).toMatchObject({ decision: 'rejected' });
    expect(rejected?.validation.errors).toEqual(
      expect.arrayContaining(['missing_product_name', 'invalid_source_url', 'missing_image']),
    );
    expect(review?.validation).toMatchObject({ decision: 'needs_review' });
    expect(review?.validation.errors).toContain('missing_color_family');
  });

  it('deduplicates repeated evidence but preserves distinct colourways', () => {
    const black = phaseACatalogProducts[0];
    expect(black).toBeDefined();
    const result = processCatalogCandidates(
      [
        black!,
        { ...black!, name: `${black!.name} duplicate` },
        { ...black!, color: 'White', externalSku: 'PHASE-A-WHITE' },
      ],
      { brandSlug: 'cos', expectedBrandName: 'COS' },
    );
    expect(result.products).toHaveLength(2);
    expect(result.duplicates).toHaveLength(1);
  });
});

import { createHash } from 'node:crypto';
import { access } from 'node:fs/promises';

import { describe, expect, it } from 'vitest';

import { DEMO_CATALOG_IMAGE_ASSETS } from './demoImages.ts';
import { generateCatalog } from './generator.ts';
import { validateCatalog } from './validator.ts';

describe('synthetic catalog generator', () => {
  it('generates a deterministic, valid 1,000-product catalog', () => {
    const first = generateCatalog();
    const second = generateCatalog();
    const firstHash = createHash('sha256').update(JSON.stringify(first)).digest('hex');
    const secondHash = createHash('sha256').update(JSON.stringify(second)).digest('hex');
    const report = validateCatalog(first);

    expect(firstHash).toBe(secondHash);
    expect(first.brands).toHaveLength(30);
    expect(first.products).toHaveLength(1_000);
    expect(first.variants.length).toBeGreaterThan(2_500);
    expect(report.passed).toBe(true);
    expect(report.demoProducts).toBe(1_000);
    expect(report.placeholderImages).toBe(0);
    expect(report.generatedImages).toBe(1_000);
    expect(new Set(first.products.map((product) => product.imageAssetKey))).toEqual(
      new Set(Object.keys(DEMO_CATALOG_IMAGE_ASSETS)),
    );
  });

  it('ships every generated image declared by the demo catalog manifest', async () => {
    await Promise.all(
      Object.values(DEMO_CATALOG_IMAGE_ASSETS).map((asset) =>
        access(new URL(`../../../${asset.localPath}`, import.meta.url)),
      ),
    );
  });

  it('changes deterministic identities when the seed changes', () => {
    const first = generateCatalog({ seed: 2026, productCount: 60 });
    const second = generateCatalog({ seed: 2027, productCount: 60 });

    expect(first.products[0]?.id).not.toBe(second.products[0]?.id);
  });

  it('rejects duplicate identities, missing variants, and contradictory season metadata', () => {
    const catalog = generateCatalog({ productCount: 60 });
    const firstProduct = catalog.products[0];
    const secondProduct = catalog.products[1];
    const firstProfile = catalog.styleProfiles[0];
    expect(firstProduct).toBeDefined();
    expect(secondProduct).toBeDefined();
    expect(firstProfile).toBeDefined();
    if (!firstProduct || !secondProduct || !firstProfile) return;

    secondProduct.id = firstProduct.id;
    catalog.variants = catalog.variants.filter((variant) => variant.productId !== firstProduct.id);
    firstProfile.warmthLevel = 5;
    firstProfile.seasonTags = ['summer'];
    const report = validateCatalog(catalog);

    expect(report.passed).toBe(false);
    expect(report.errors.map((issue) => issue.code)).toEqual(
      expect.arrayContaining([
        'DUPLICATE_PRODUCT_ID',
        'MISSING_VARIANTS',
        'IMPOSSIBLE_SEASON_WARMTH',
      ]),
    );
  });
});

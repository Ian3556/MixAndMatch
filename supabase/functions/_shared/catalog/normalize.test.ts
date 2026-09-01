import { describe, expect, it } from 'vitest';

import {
  createCatalogDeduplicationKey,
  normalizeCatalogProduct,
  normalizeHttpUrl,
  normalizePrice,
} from './normalize';

describe('catalog normalization', () => {
  it('normalizes URL tracking, taxonomy, colour, material, price, images, and variants', () => {
    const product = normalizeCatalogProduct(
      {
        externalProductId: 'STYLE-1-BLK',
        name: 'Relaxed Black Cotton Tee',
        category: "Men's Lifestyle Relaxed Tee",
        color: 'Jet Black',
        materials: '100% cotton, 2% elastane',
        currentPrice: '€1.299,95',
        currency: 'eur',
        sourceUrl: 'https://shop.example/product/1?utm_source=listing',
        canonicalUrl: 'https://SHOP.example/product/1?utm_source=listing&color=black#details',
        extractionMethod: 'json_ld',
        images: [{ imageUrl: '/images/1.jpg' }, { imageUrl: 'https://shop.example/images/1.jpg' }],
        variants: [
          { externalVariantId: 'S-BLK', size: 'S', price: '1299.95', currency: 'EUR' },
          { externalVariantId: 'S-BLK', size: 'S', price: '1299.95', currency: 'EUR' },
        ],
      },
      { brandSlug: 'example-brand' },
    );

    expect(product).toMatchObject({
      categorySlug: 'tops',
      subcategorySlug: 't_shirt',
      primaryColor: 'black',
      colorFamily: 'black',
      currentPrice: 1299.95,
      currency: 'EUR',
      sourceDomain: 'shop.example',
    });
    expect(product.canonicalUrl).toBe('https://shop.example/product/1?color=black');
    expect(product.images).toHaveLength(1);
    expect(product.variants).toHaveLength(1);
    expect(product.materials.map((material) => material.material)).toEqual(
      expect.arrayContaining(['cotton', 'elastane']),
    );
  });

  it('parses common price formats and rejects negative values', () => {
    expect(normalizePrice('$1,299.50')).toBe(1299.5);
    expect(normalizePrice('1.299,50 EUR')).toBe(1299.5);
    expect(normalizePrice('-20')).toBeNull();
  });

  it('normalizes only public HTTP-shaped URLs and removes tracking on request', () => {
    expect(normalizeHttpUrl('javascript:alert(1)')).toBeNull();
    expect(normalizeHttpUrl('/p/1?gclid=x&size=m', 'https://shop.example', true)).toBe(
      'https://shop.example/p/1?size=m',
    );
  });

  it('keeps distinct colourways separate in the deduplication key', () => {
    const base = {
      brandSlug: 'example',
      externalProductId: 'STYLE-1',
      externalSku: null,
      canonicalUrl: 'https://shop.example/p/1',
      name: 'Example Tee',
    };
    expect(createCatalogDeduplicationKey({ ...base, colorFamily: 'black' })).not.toBe(
      createCatalogDeduplicationKey({ ...base, colorFamily: 'white' }),
    );
  });
});

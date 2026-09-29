import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import { extractProductsFromHtml } from './extract-products';
import { extractJsonLdProducts } from './json-ld';
import { normalizeProducts } from './normalize-product';
import { MAX_JSON_LD_DEPTH, MAX_RAW_PRODUCT_CANDIDATES, type RawProductCandidate } from './types';

const fixtureDirectory = fileURLToPath(
  new URL('../../../../src/fixtures/wardrobe-import/', import.meta.url),
);
const sourceUrl = 'https://shop.example/collections/new';

function fixture(name: string) {
  return readFileSync(`${fixtureDirectory}${name}.html`, 'utf8');
}

describe('wardrobe import extraction pipeline', () => {
  it('extracts and normalizes an individual JSON-LD product', () => {
    const result = extractProductsFromHtml(fixture('json-ld-product'), sourceUrl);
    expect(result.pageType).toBe('product');
    expect(result.products).toHaveLength(1);
    expect(result.products[0]).toMatchObject({
      name: 'Linen & Cotton Shirt',
      brand: 'Example',
      category: 'Tops',
      color: 'Ivory',
      size: 'M',
      imageUrl: 'https://shop.example/images/shirt.jpg',
      extractionMethod: 'json-ld',
      confidence: 'high',
    });
    expect(result.products[0]?.canonicalUrl).not.toContain('utm_source');
  });

  it('reads Offer price, currency, availability, and image objects', () => {
    const [product] = extractProductsFromHtml(fixture('json-ld-offer'), sourceUrl).products;
    expect(product).toMatchObject({ price: 89.9, currency: 'MYR' });
    expect(product?.availability).toContain('InStock');
  });

  it('finds products nested in @graph', () => {
    expect(extractProductsFromHtml(fixture('json-ld-graph'), sourceUrl).products[0]?.name).toBe(
      'Graph Jacket',
    );
  });

  it('extracts ItemList collection products', () => {
    const result = extractProductsFromHtml(fixture('item-list'), sourceUrl);
    expect(result.pageType).toBe('collection');
    expect(result.products.map((product) => product.name)).toEqual(['Blue Tee', 'Green Tee']);
  });

  it('uses Open Graph product metadata when structured data is absent', () => {
    expect(
      extractProductsFromHtml(fixture('open-graph-product'), sourceUrl).products[0],
    ).toMatchObject({
      name: 'Open Graph Dress',
      extractionMethod: 'open-graph',
      price: 120,
      currency: 'USD',
    });
  });

  it.each([
    ['shopify-collection', 'platform-adapter', 2],
    ['woocommerce-collection', 'platform-adapter', 2],
    ['generic-product-cards', 'html-heuristic', 2],
  ])('extracts %s markup conservatively', (name, method, count) => {
    const result = extractProductsFromHtml(fixture(name), sourceUrl);
    expect(result.products).toHaveLength(count);
    expect(result.products.every((product) => product.extractionMethod === method)).toBe(true);
  });

  it('survives malformed JSON-LD and falls back to metadata', () => {
    const result = extractProductsFromHtml(fixture('malformed-json-ld'), sourceUrl);
    expect(result.products[0]).toMatchObject({
      name: 'Fallback Knit',
      extractionMethod: 'open-graph',
    });
  });

  it('deduplicates repeated products', () => {
    expect(extractProductsFromHtml(fixture('duplicate-products'), sourceUrl).products).toHaveLength(
      1,
    );
  });

  it('returns an honest empty result', () => {
    expect(extractProductsFromHtml(fixture('no-products'), sourceUrl)).toMatchObject({
      pageType: 'unknown',
      products: [],
    });
  });

  it('keeps explicit material composition on a single structured product page', () => {
    const html = `<script type="application/ld+json">${JSON.stringify({
      '@type': 'Product',
      name: "Men's tennis top",
      url: '/products/tennis-top',
      category: 'Tops',
    })}</script><section>Product details: 88% polyester/12% elastane</section>`;
    expect(extractProductsFromHtml(html, sourceUrl).products[0]?.material).toBe(
      '88% polyester / 12% elastane',
    );
  });

  it('does not assign page-wide material to a collection candidate', () => {
    const html = `<script type="application/ld+json">${JSON.stringify({
      '@type': 'ItemList',
      itemListElement: [{ '@type': 'Product', name: 'Tennis top', url: '/products/tennis-top' }],
    })}</script><section>Product details: 88% polyester/12% elastane</section>`;
    expect(extractProductsFromHtml(html, sourceUrl).products[0]?.material).toBeUndefined();
  });

  it('rejects logos and banners without rejecting a real product', () => {
    const products = extractProductsFromHtml(fixture('decorative-images'), sourceUrl).products;
    expect(products.map((product) => product.name)).toEqual(['Real Shirt']);
  });

  it('caps JSON-LD candidates before normalization', () => {
    const products = Array.from({ length: MAX_RAW_PRODUCT_CANDIDATES + 25 }, (_, index) => ({
      '@type': 'Product',
      name: `Product ${index}`,
      url: `/products/${index}`,
    }));
    const html = `<script type="application/ld+json">${JSON.stringify(products)}</script>`;

    expect(extractJsonLdProducts(html, sourceUrl)).toHaveLength(MAX_RAW_PRODUCT_CANDIDATES);
    expect(extractProductsFromHtml(html, sourceUrl).products).toHaveLength(50);
  });

  it('stops traversing JSON-LD beyond the configured depth', () => {
    let nested: unknown = {
      '@type': 'Product',
      name: 'Too Deep',
      url: '/products/too-deep',
    };
    for (let depth = 0; depth <= MAX_JSON_LD_DEPTH; depth += 1) nested = { child: nested };
    const html = `<script type="application/ld+json">${JSON.stringify(nested)}</script>`;

    expect(extractJsonLdProducts(html, sourceUrl)).toEqual([]);
  });

  it('never reads candidates beyond the raw-candidate budget', () => {
    const candidates = Array.from(
      { length: MAX_RAW_PRODUCT_CANDIDATES },
      () =>
        ({
          name: '',
          extractionMethod: 'html-heuristic',
          confidence: 'low',
        }) satisfies RawProductCandidate,
    );
    Object.defineProperty(candidates, MAX_RAW_PRODUCT_CANDIDATES, {
      get() {
        throw new Error('candidate budget exceeded');
      },
    });

    expect(normalizeProducts(candidates, sourceUrl)).toEqual([]);
  });
});

import { describe, expect, it } from 'vitest';

import { phaseACatalogProducts } from '@/fixtures/catalog/phaseAProducts';

import { persistCatalogProduct } from './persist';
import { processCatalogCandidates } from './pipeline';
import type { CatalogRestClient } from './rest-client';

class InMemoryCatalogClient {
  readonly productIds = new Map<string, string>();
  readonly deletedTables: string[] = [];
  productUpsertCount = 0;

  async select<T>(table: string): Promise<T[]> {
    if (table !== 'catalog_products') return [];
    return [...this.productIds.values()].map((id) => ({ id })) as T[];
  }

  async upsert<T>(table: string, _onConflict: string, body: Record<string, unknown>): Promise<T[]> {
    if (table !== 'catalog_products') return [];
    this.productUpsertCount += 1;
    const key = `${String(body.brand_id)}:${String(body.deduplication_key)}`;
    const id = this.productIds.get(key) ?? 'catalog-product-1';
    this.productIds.set(key, id);
    return [{ id }] as T[];
  }

  async insert<T>(): Promise<T[]> {
    return [];
  }

  async delete(table: string): Promise<void> {
    this.deletedTables.push(table);
  }
}

describe('catalog persistence', () => {
  it('is idempotent when the same normalized colourway is imported twice', async () => {
    const fixture = phaseACatalogProducts[0];
    expect(fixture).toBeDefined();
    const [product] = processCatalogCandidates([fixture!], {
      brandSlug: 'cos',
      expectedBrandName: 'COS',
    }).products;
    expect(product).toBeDefined();

    const client = new InMemoryCatalogClient();
    const categoryIds = new Map([
      [product!.categorySlug, 'category-1'],
      ...(product!.subcategorySlug ? [[product!.subcategorySlug, 'subcategory-1'] as const] : []),
    ]);
    const styleTagIds = new Map(product!.styleTags.map((tag) => [tag.slug, `tag-${tag.slug}`]));
    const context = {
      brandId: 'brand-cos',
      rawCandidate: fixture!,
      fetchedAt: '2026-08-08T00:00:00.000Z',
      contentHash: 'fixture-hash',
    };

    const first = await persistCatalogProduct(
      client as unknown as CatalogRestClient,
      product!,
      { categoryIds, styleTagIds },
      context,
    );
    const second = await persistCatalogProduct(
      client as unknown as CatalogRestClient,
      product!,
      { categoryIds, styleTagIds },
      context,
    );

    expect(first).toEqual({ productId: 'catalog-product-1', duplicate: false });
    expect(second).toEqual({ productId: 'catalog-product-1', duplicate: true });
    expect(client.productIds).toHaveLength(1);
    expect(client.productUpsertCount).toBe(2);
    expect(client.deletedTables).toHaveLength(8);
  });
});

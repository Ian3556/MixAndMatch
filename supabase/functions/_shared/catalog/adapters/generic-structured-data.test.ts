import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import { GenericStructuredDataAdapter } from './generic-structured-data';

const fixtureDirectory = fileURLToPath(
  new URL('../../../../../src/fixtures/wardrobe-import/', import.meta.url),
);

describe('generic catalogue structured-data adapter', () => {
  it('reuses the safe wardrobe JSON-LD extractor without making it the catalogue model', async () => {
    const adapter = new GenericStructuredDataAdapter();
    const source = {
      sourceType: 'url' as const,
      brandSlug: 'example',
      url: 'https://shop.example/collections/new',
      html: readFileSync(`${fixtureDirectory}json-ld-product.html`, 'utf8'),
    };

    expect(adapter.canHandle(source)).toBe(true);
    await expect(adapter.extract(source)).resolves.toEqual([
      expect.objectContaining({
        name: 'Linen & Cotton Shirt',
        brand: 'Example',
        category: 'Tops',
        extractionMethod: 'json_ld',
        images: [expect.objectContaining({ imageType: 'primary' })],
      }),
    ]);
  });

  it('fails closed when fetched HTML is absent', async () => {
    const adapter = new GenericStructuredDataAdapter();
    const source = {
      sourceType: 'url' as const,
      brandSlug: 'example',
      url: 'https://shop.example',
    };
    expect(adapter.canHandle(source)).toBe(false);
    await expect(adapter.extract(source)).rejects.toThrow('requires a public URL and fetched HTML');
  });
});

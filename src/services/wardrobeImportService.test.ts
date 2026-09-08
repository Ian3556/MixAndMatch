import { beforeEach, describe, expect, it, vi } from 'vitest';

import { importWardrobeUrl } from './wardrobeImportService';

const { invoke } = vi.hoisted(() => ({ invoke: vi.fn() }));

vi.mock('@supabase', () => ({
  getSupabaseClient: () => ({ functions: { invoke } }),
}));

describe('wardrobe import client', () => {
  beforeEach(() => invoke.mockReset());

  it('rejects invalid input before calling the Edge Function', async () => {
    await expect(importWardrobeUrl('')).rejects.toMatchObject({ code: 'INVALID_URL' });
    expect(invoke).not.toHaveBeenCalled();
  });

  it('converts an empty successful response into an actionable no-products error', async () => {
    invoke.mockResolvedValue({
      data: {
        sourceUrl: 'https://shop.example.com/collection',
        sourceDomain: 'shop.example.com',
        pageType: 'collection',
        products: [],
        warnings: [],
      },
      error: null,
    });

    await expect(importWardrobeUrl('https://shop.example.com/collection')).rejects.toMatchObject({
      code: 'NO_PRODUCTS_FOUND',
    });
  });

  it('returns validated product responses for preview', async () => {
    const response = {
      sourceUrl: 'https://shop.example.com/product/shirt',
      sourceDomain: 'shop.example.com',
      pageType: 'product' as const,
      products: [
        {
          name: 'Linen Shirt',
          productUrl: 'https://shop.example.com/product/shirt',
          sourceDomain: 'shop.example.com',
          extractionMethod: 'json-ld' as const,
          confidence: 'high' as const,
        },
      ],
      warnings: [],
    };
    invoke.mockResolvedValue({ data: response, error: null });

    await expect(importWardrobeUrl(response.sourceUrl)).resolves.toEqual(response);
  });
});

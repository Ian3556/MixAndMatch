import { describe, expect, it, vi } from 'vitest';

import {
  createWardrobeService,
  mapWardrobeRow,
  normalizeWardrobeError,
  toWardrobeInsert,
  type WardrobeGateway,
  type WardrobeRow,
} from './wardrobeService';

const row: WardrobeRow = {
  id: 'item-1',
  user_id: 'user-1',
  name: 'Linen Shirt',
  category: 'Tops',
  subcategory: null,
  primary_color: 'Ivory',
  secondary_color: null,
  pattern: null,
  material: 'Linen',
  brand: 'Example',
  season: null,
  occasion: null,
  notes: null,
  is_favorite: false,
  image_url: 'https://shop.example/shirt.jpg',
  source_url: 'https://shop.example/products/shirt',
  source_domain: 'shop.example',
  external_product_id: 'shirt-1',
  price: 89,
  currency: 'MYR',
  import_method: 'website-url',
  deduplication_key: 'external:shop.example:shirt-1',
  created_at: '2026-08-05T00:00:00.000Z',
  updated_at: '2026-08-05T00:00:00.000Z',
};

function gateway(overrides: Partial<WardrobeGateway> = {}): WardrobeGateway {
  return {
    listByUser: vi.fn(async () => ({ data: [row], error: null })),
    insert: vi.fn(async () => ({ data: row, error: null })),
    update: vi.fn(async () => ({ data: { ...row, is_favorite: true }, error: null })),
    delete: vi.fn(async () => ({ data: null, error: null })),
    ...overrides,
  };
}

describe('wardrobe service', () => {
  it('maps database rows into the application model', () => {
    expect(mapWardrobeRow(row)).toMatchObject({
      userId: 'user-1',
      primaryColor: 'Ivory',
      importMethod: 'website-url',
    });
  });

  it('derives ownership from the service user instead of imported input', async () => {
    const testGateway = gateway();
    const service = createWardrobeService(testGateway);
    await service.create('trusted-user', {
      name: ' Shirt ',
      category: ' Tops ',
      importMethod: 'manual',
      deduplicationKey: 'manual:1',
    });
    expect(testGateway.insert).toHaveBeenCalledWith(
      expect.objectContaining({ user_id: 'trusted-user', name: 'Shirt', category: 'Tops' }),
    );
  });

  it('returns per-item added, duplicate, and failed outcomes', async () => {
    const testGateway = gateway({
      insert: vi
        .fn()
        .mockResolvedValueOnce({ data: row, error: null })
        .mockResolvedValueOnce({ data: null, error: { code: '23505' } })
        .mockResolvedValueOnce({ data: null, error: { code: '42501' } }),
    });
    const results = await createWardrobeService(testGateway).saveMany(
      'user-1',
      ['one', 'two', 'three'].map((key) => ({
        name: key,
        category: 'Tops',
        importMethod: 'manual' as const,
        deduplicationKey: key,
      })),
    );
    expect(results.map((result) => result.status)).toEqual(['added', 'duplicate', 'failed']);
  });

  it('normalizes database and network failures without exposing raw messages', () => {
    expect(normalizeWardrobeError({ code: '23505' }).code).toBe('duplicate');
    expect(normalizeWardrobeError({ code: '42501' }).code).toBe('unauthorized');
    expect(normalizeWardrobeError(new TypeError('secret fetch detail')).message).not.toContain(
      'secret',
    );
  });

  it('normalizes optional values for inserts', () => {
    expect(
      toWardrobeInsert('user-1', {
        name: 'Shirt',
        category: 'Tops',
        brand: '   ',
        currency: 'myr',
        importMethod: 'manual',
        deduplicationKey: 'manual:1',
      }),
    ).toMatchObject({ brand: null, currency: 'MYR' });
  });
});

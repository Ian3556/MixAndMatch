import { describe, expect, it } from 'vitest';

import { mapWardrobeRow, type WardrobeRow } from '@/services/wardrobeService';

import { wardrobeDetailPresentation } from './wardrobePresentation';

const nikeRow: WardrobeRow = {
  id: 'nike-item',
  user_id: 'test-user',
  catalog_product_id: null,
  name: "NikeCourt Advantage Men's Dri-FIT Tennis Top - Purple Dynasty/Lemon Venom/Lemon Venom - Size S",
  category: 'Tops',
  subcategory: null,
  primary_color: 'Purple Dynasty/Lemon Venom/Lemon Venom',
  secondary_color: null,
  size: 'S',
  pattern: null,
  material: null,
  brand: null,
  season: null,
  occasion: null,
  notes: 'The slim-fit Advantage top is built to minimise distractions. It uses Dri-FIT material.',
  is_favorite: false,
  image_url: 'https://static.nike.com/example.png',
  image_urls: ['https://static.nike.com/example.png'],
  source_url: 'https://www.nike.com/my/t/nikecourt-advantage-mens-dri-fit-tennis-top-BpTVbg',
  source_domain: 'www.nike.com',
  external_product_id: null,
  price: 239,
  currency: 'MYR',
  import_method: 'website-url',
  source_type: 'url_import',
  metadata: { extractionMethod: 'json-ld', confidence: 'high' },
  deduplication_key: 'url:nikecourt',
  created_at: '2026-09-01T00:00:00Z',
  updated_at: '2026-09-01T00:00:00Z',
};

describe('wardrobe detail presentation', () => {
  it('repairs the existing NikeCourt URL import without inventing material or season', () => {
    const item = mapWardrobeRow(nikeRow);
    const detail = wardrobeDetailPresentation(item);
    expect(item.brand).toBe('Nike');
    expect(detail.title).toBe("NikeCourt Advantage Men's Dri-FIT Tennis Top");
    expect(detail.category).toBe('Tops · Performance Top');
    expect(detail.color).toBe('Purple Dynasty / Lemon Venom');
    expect(detail.price?.replace(/\s/g, ' ')).toBe('RM 239');
    expect(detail.description).toContain('slim-fit Advantage top');
    expect(detail.notes).toBeNull();
    expect(detail.details).toContainEqual(['Occasion', 'Sport · Tennis']);
    expect(detail.details.some(([label]) => label === 'Material' || label === 'Season')).toBe(
      false,
    );
    expect(item.sourceUrl).toBe(nikeRow.source_url);
  });

  it('omits optional fields on sparse manual items and preserves personal notes', () => {
    const item = mapWardrobeRow({
      ...nikeRow,
      name: 'My plain shirt',
      source_type: 'manual',
      import_method: 'manual',
      source_url: null,
      source_domain: null,
      primary_color: null,
      notes: 'Bought on holiday',
      metadata: {},
      price: null,
      currency: null,
      size: null,
    });
    const detail = wardrobeDetailPresentation(item);
    expect(detail.details).toEqual([]);
    expect(detail.price).toBeNull();
    expect(detail.description).toBeNull();
    expect(detail.notes).toBe('Bought on holiday');
  });
});

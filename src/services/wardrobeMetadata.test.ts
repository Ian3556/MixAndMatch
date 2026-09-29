import { describe, expect, it } from 'vitest';

import {
  displayProductName,
  knownBrandFromDomain,
  normalizeColour,
  resolveWardrobeMetadata,
} from './wardrobeMetadata';

describe('wardrobe metadata', () => {
  it('recognizes only mapped official brand domains', () => {
    expect(knownBrandFromDomain('www.nike.com')).toBe('Nike');
    expect(knownBrandFromDomain('shop.uniqlo.com')).toBe('UNIQLO');
    expect(knownBrandFromDomain('cos.com')).toBe('COS');
    expect(knownBrandFromDomain('notnike.com')).toBeNull();
    expect(knownBrandFromDomain('nike.com.evil.example')).toBeNull();
  });

  it('deduplicates exact colour tokens while preserving their order', () => {
    expect(normalizeColour('Purple Dynasty/Lemon Venom/Lemon Venom')).toBe(
      'Purple Dynasty / Lemon Venom',
    );
    expect(normalizeColour('Blue / Navy / blue')).toBe('Blue / Navy');
  });

  it('infers only supported NikeCourt signals and keeps unverified material and season empty', () => {
    const resolved = resolveWardrobeMetadata({
      name: "NikeCourt Advantage Men's Dri-FIT Tennis Top",
      category: 'Tops',
      sourceDomain: 'www.nike.com',
      color: 'Purple Dynasty/Lemon Venom/Lemon Venom',
      description: "It's made from sweat-wicking Dri-FIT material.",
    });
    expect(resolved).toMatchObject({
      brand: 'Nike',
      color: 'Purple Dynasty / Lemon Venom',
      subcategory: 'Performance Top',
      occasion: 'Sport, Tennis',
      material: null,
      season: null,
      sources: { brand: 'domain', subcategory: 'inferred', occasion: 'inferred' },
    });
  });

  it('reads complete explicit fibre compositions but not partial recycled-content claims', () => {
    expect(
      resolveWardrobeMetadata({
        name: 'Tennis top',
        category: 'Tops',
        description: 'Product details: 88% polyester/12% elastane.',
      }).material,
    ).toBe('88% polyester / 12% elastane');
    expect(
      resolveWardrobeMetadata({
        name: 'Tennis top',
        category: 'Tops',
        description: 'Made from at least 75% recycled polyester fibres.',
      }).material,
    ).toBeNull();
  });

  it('removes only variant suffixes that match the known colour and size', () => {
    expect(
      displayProductName(
        "NikeCourt Advantage Men's Dri-FIT Tennis Top - Purple Dynasty/Lemon Venom/Lemon Venom - Size S",
        'Purple Dynasty / Lemon Venom',
        'S',
      ),
    ).toBe("NikeCourt Advantage Men's Dri-FIT Tennis Top");
    expect(displayProductName('Blue-and-white shirt - limited edition', 'Blue', null)).toBe(
      'Blue-and-white shirt - limited edition',
    );
  });
});

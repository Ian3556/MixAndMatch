import { describe, expect, it } from 'vitest';

import type { DraftWardrobeItem } from '@/types/wardrobe';

import { buildManualWardrobeInput, validateManualWardrobeItem } from './manualWardrobeItem';

const draft: DraftWardrobeItem = {
  deduplicationKey: 'manual:draft-1',
  imageKey: 'manual',
  imageUrl: 'https://images.example.com/blazer.jpg',
  name: 'Navy Blazer',
  category: 'Outerwear',
  subcategory: 'Tailored',
  primaryColor: 'Navy',
  secondaryColor: '',
  pattern: 'Solid',
  material: 'Wool',
  brand: 'Example',
  season: 'Transitional',
  occasion: 'Work',
  notes: '',
  price: '249.90',
  currency: 'myr',
  isFavorite: false,
};

describe('manual wardrobe item workflow', () => {
  it('requires a name and category and validates purchase and image data', () => {
    expect(
      validateManualWardrobeItem({
        ...draft,
        name: '',
        category: '',
        imageUrl: 'file:///private/photo.jpg',
        price: '-1',
        currency: 'ringgit',
      }),
    ).toEqual({
      name: 'Enter an item name.',
      category: 'Select a category.',
      imageUrl: 'Enter a valid HTTP or HTTPS image URL.',
      price: 'Enter a valid non-negative price.',
      currency: 'Use a three-letter currency code, such as MYR.',
    });
  });

  it('maps supported schema fields and normalizes optional values', () => {
    expect(buildManualWardrobeInput(draft)).toMatchObject({
      name: 'Navy Blazer',
      category: 'Outerwear',
      imageUrl: 'https://images.example.com/blazer.jpg',
      price: 249.9,
      currency: 'MYR',
      importMethod: 'manual',
    });
  });

  it('keeps retries idempotent without blocking a separate identical garment', () => {
    const first = buildManualWardrobeInput(draft).deduplicationKey;
    const second = buildManualWardrobeInput(draft).deduplicationKey;
    expect(first).toBe(second);
    expect(
      buildManualWardrobeInput({ ...draft, deduplicationKey: 'manual:draft-2' }).deduplicationKey,
    ).not.toBe(first);
  });
});

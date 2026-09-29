import { describe, expect, it } from 'vitest';

import { productImageResizeMode } from './imageLayout';

describe('wardrobe hero image layout', () => {
  it('fills portrait and square product photography without stretching', () => {
    expect(productImageResizeMode(800, 1000)).toBe('cover');
    expect(productImageResizeMode(1000, 1000)).toBe('cover');
  });

  it('preserves a landscape image instead of severely cropping it', () => {
    expect(productImageResizeMode(1600, 900)).toBe('contain');
  });
});

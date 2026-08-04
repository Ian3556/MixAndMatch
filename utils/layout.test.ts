import { describe, expect, it } from 'vitest';

import { getGridColumnCount, getGridItemWidth } from './layout';

describe('responsive grid helpers', () => {
  it('uses one, two, and three columns at the intended phone and future-wide breakpoints', () => {
    expect(getGridColumnCount(320)).toBe(1);
    expect(getGridColumnCount(390)).toBe(2);
    expect(getGridColumnCount(800)).toBe(3);
  });

  it('accounts for outer padding and inter-card gaps without negative widths', () => {
    expect(getGridItemWidth(390, 2, 16, 16)).toBe(171);
    expect(getGridItemWidth(20, 2, 16, 16)).toBe(0);
  });
});

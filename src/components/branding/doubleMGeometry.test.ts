import { describe, expect, it } from 'vitest';

import { calculateDoubleMFillBounds, DOUBLE_M_BOTTOM, DOUBLE_M_TOP } from './doubleMGeometry';

describe('Double M fill geometry', () => {
  it.each([0, 0.25, 0.5, 0.75, 1])('clips %s progress from bottom to top', (progress) => {
    const logoHeight = DOUBLE_M_BOTTOM - DOUBLE_M_TOP;

    expect(calculateDoubleMFillBounds(progress)).toEqual({
      height: logoHeight * progress,
      y: DOUBLE_M_BOTTOM - logoHeight * progress,
    });
  });

  it('clamps out-of-range and invalid values', () => {
    expect(calculateDoubleMFillBounds(-1)).toEqual({ height: 0, y: DOUBLE_M_BOTTOM });
    expect(calculateDoubleMFillBounds(2)).toEqual({
      height: DOUBLE_M_BOTTOM - DOUBLE_M_TOP,
      y: DOUBLE_M_TOP,
    });
    expect(calculateDoubleMFillBounds(Number.NaN)).toEqual({ height: 0, y: DOUBLE_M_BOTTOM });
  });
});

import { describe, expect, it } from 'vitest';

import { extractMaterialCompositionFromHtml } from './material-spec';

describe('material specifications', () => {
  it('extracts a complete product-page composition', () => {
    expect(
      extractMaterialCompositionFromHtml(
        '<div>At least 75% recycled fibres</div><li>88% polyester/12% elastane</li>',
      ),
    ).toBe('88% polyester / 12% elastane');
  });

  it('does not confuse Dri-FIT or a partial claim with composition', () => {
    expect(extractMaterialCompositionFromHtml('Dri-FIT material')).toBeUndefined();
    expect(extractMaterialCompositionFromHtml('at least 75% recycled polyester')).toBeUndefined();
  });

  it('rejects ambiguous multi-product compositions', () => {
    expect(
      extractMaterialCompositionFromHtml('100% cotton ... 88% polyester/12% elastane'),
    ).toBeUndefined();
  });
});

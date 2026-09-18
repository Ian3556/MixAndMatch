export const FIT_COMPATIBILITY: Record<string, readonly string[]> = {
  slim: ['straight', 'regular', 'wide'],
  regular: ['regular', 'straight', 'relaxed', 'wide'],
  relaxed: ['straight', 'regular', 'relaxed', 'wide'],
  oversized: ['straight', 'wide', 'slim'],
  wide: ['fitted', 'cropped', 'regular', 'oversized'],
  straight: ['regular', 'relaxed', 'oversized', 'fitted'],
  cropped: ['wide', 'straight', 'regular'],
  fitted: ['wide', 'straight', 'relaxed'],
  tailored: ['straight', 'slim', 'regular'],
  loose: ['fitted', 'cropped', 'regular'],
};

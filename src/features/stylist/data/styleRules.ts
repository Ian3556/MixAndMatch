export const STYLE_RELATIONSHIPS: Record<string, readonly string[]> = {
  minimal: ['classic', 'smart-casual', 'quiet-luxury', 'casual'],
  minimalist: ['minimal', 'classic', 'smart-casual', 'quiet-luxury'],
  classic: ['minimal', 'smart-casual', 'business-casual', 'preppy', 'old-money'],
  streetwear: ['sporty', 'workwear', 'casual', 'techwear'],
  sporty: ['streetwear', 'casual', 'gorpcore'],
  workwear: ['streetwear', 'casual', 'heritage'],
  'smart-casual': ['minimal', 'classic', 'business-casual', 'quiet-luxury'],
  'business-casual': ['classic', 'smart-casual', 'formal', 'preppy'],
  formal: ['classic', 'business-casual', 'quiet-luxury'],
  preppy: ['classic', 'business-casual', 'old-money'],
  vintage: ['classic', 'heritage', 'workwear'],
  techwear: ['streetwear', 'gorpcore', 'sporty'],
  gorpcore: ['outdoor', 'techwear', 'sporty'],
  'quiet-luxury': ['minimal', 'classic', 'smart-casual', 'old-money'],
  'old-money': ['classic', 'preppy', 'quiet-luxury'],
  casual: ['minimal', 'streetwear', 'sporty', 'workwear'],
};

export const STYLE_INFERENCE_RULES: { terms: readonly string[]; styles: readonly string[] }[] = [
  { terms: ['oxford', 'polo', 'loafer', 'trench'], styles: ['classic', 'smart-casual'] },
  { terms: ['blazer', 'tailored', 'suit'], styles: ['classic', 'business-casual', 'formal'] },
  { terms: ['hoodie', 'cargo', 'oversized'], styles: ['streetwear', 'casual'] },
  { terms: ['running', 'gym', 'athletic', 'jogger'], styles: ['sporty'] },
  { terms: ['linen', 'simple', 'essential'], styles: ['minimal', 'casual'] },
];

export function areStylesRelated(left: string, right: string): boolean {
  if (left === right) return true;
  return (
    STYLE_RELATIONSHIPS[left]?.includes(right) === true ||
    STYLE_RELATIONSHIPS[right]?.includes(left) === true
  );
}

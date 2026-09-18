export const COLORS = [
  { name: 'Black', family: 'Dark Neutral', skinTones: ['cool', 'warm', 'neutral'] },
  { name: 'Optic White', family: 'Light Neutral', skinTones: ['cool', 'warm', 'neutral'] },
  { name: 'Cream', family: 'Warm Neutral', skinTones: ['warm', 'neutral'] },
  { name: 'Stone', family: 'Warm Neutral', skinTones: ['warm', 'neutral'] },
  { name: 'Charcoal', family: 'Dark Neutral', skinTones: ['cool', 'neutral'] },
  { name: 'Navy', family: 'Blue', skinTones: ['cool', 'warm', 'neutral'] },
  { name: 'Sky Blue', family: 'Blue', skinTones: ['cool', 'neutral'] },
  { name: 'Forest Green', family: 'Green', skinTones: ['warm', 'neutral'] },
  { name: 'Olive', family: 'Earth', skinTones: ['warm', 'neutral'] },
  { name: 'Rust', family: 'Earth', skinTones: ['warm'] },
  { name: 'Burgundy', family: 'Red', skinTones: ['cool', 'warm', 'neutral'] },
  { name: 'Cobalt', family: 'Blue', skinTones: ['cool', 'neutral'] },
  { name: 'Soft Pink', family: 'Pink', skinTones: ['cool', 'neutral'] },
  { name: 'Camel', family: 'Warm Neutral', skinTones: ['warm', 'neutral'] },
  { name: 'Silver Grey', family: 'Light Neutral', skinTones: ['cool', 'neutral'] },
] as const;

export const BODY_TYPE_TAGS_BY_FIT: Record<string, string[]> = {
  slim: ['balanced', 'rectangle'],
  tailored: ['balanced', 'hourglass', 'inverted_triangle'],
  regular: ['balanced', 'rectangle', 'oval'],
  relaxed: ['balanced', 'rectangle', 'oval', 'pear'],
  oversized: ['balanced', 'rectangle', 'inverted_triangle'],
};

export const STOCK_STATUSES = ['in_stock', 'in_stock', 'in_stock', 'low_stock'] as const;

export const STYLE_TAG_NAMES: Record<string, string> = {
  minimal: 'Minimal',
  streetwear: 'Streetwear',
  casual: 'Casual',
  smart_casual: 'Smart Casual',
  formal: 'Formal',
  preppy: 'Preppy',
  workwear: 'Workwear',
  sporty: 'Sporty',
  technical: 'Technical',
  outdoor: 'Outdoor',
  vintage: 'Vintage',
  luxury: 'Luxury',
  contemporary: 'Contemporary',
  classic: 'Classic',
};

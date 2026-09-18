import type { ClothingCategory } from '../types';

const CATEGORY_TERMS: Record<Exclude<ClothingCategory, 'other'>, readonly string[]> = {
  top: [
    'top',
    'tops',
    'shirt',
    't-shirt',
    'tee',
    'blouse',
    'sweater',
    'sweatshirt',
    'hoodie',
    'polo',
    'cardigan',
    'knitwear',
    'tank',
  ],
  bottom: [
    'bottom',
    'bottoms',
    'trouser',
    'trousers',
    'pants',
    'jeans',
    'shorts',
    'skirt',
    'chinos',
    'joggers',
  ],
  shoes: [
    'shoe',
    'shoes',
    'footwear',
    'sneaker',
    'sneakers',
    'trainer',
    'trainers',
    'loafer',
    'loafers',
    'boot',
    'boots',
    'heel',
    'heels',
    'sandal',
    'sandals',
  ],
  outerwear: [
    'outerwear',
    'coat',
    'jacket',
    'blazer',
    'parka',
    'windbreaker',
    'overshirt',
    'trench',
  ],
  accessory: [
    'accessory',
    'accessories',
    'bag',
    'bags',
    'belt',
    'watch',
    'jewellery',
    'jewelry',
    'scarf',
    'hat',
    'cap',
  ],
  dress: ['dress', 'dresses', 'jumpsuit', 'romper'],
};

export function normalizeCategory(...values: (string | null | undefined)[]): ClothingCategory {
  const terms = values
    .filter((value): value is string => Boolean(value?.trim()))
    .flatMap((value) => tokenize(value));

  for (const [category, aliases] of Object.entries(CATEGORY_TERMS) as [
    Exclude<ClothingCategory, 'other'>,
    readonly string[],
  ][]) {
    if (aliases.some((alias) => terms.includes(alias))) return category;
  }
  return 'other';
}

function tokenize(value: string): string[] {
  const normalized = value.toLowerCase().replace(/[_/]+/g, ' ').replace(/\s+/g, ' ').trim();
  return [normalized, ...normalized.split(/[\s-]+/)];
}

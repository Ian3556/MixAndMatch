import type { CatalogCategoryMatch } from './types';

export type CatalogSubcategoryDefinition = {
  name: string;
  slug: string;
  patterns: readonly RegExp[];
};

export type CatalogCategoryDefinition = {
  name: string;
  slug: string;
  patterns: readonly RegExp[];
  subcategories: readonly CatalogSubcategoryDefinition[];
};

export const CATALOG_TAXONOMY: readonly CatalogCategoryDefinition[] = [
  {
    name: 'Tops',
    slug: 'tops',
    patterns: [/\btops?\b/, /\bupperwear\b/],
    subcategories: [
      { name: 'T-Shirt', slug: 't_shirt', patterns: [/\bt[ -]?shirts?\b/, /\btees?\b/] },
      { name: 'Polo', slug: 'polo', patterns: [/\bpolos?\b/] },
      { name: 'Tank Top', slug: 'tank_top', patterns: [/\btank(?: tops?)?\b/, /\bvest top\b/] },
      { name: 'Blouse', slug: 'blouse', patterns: [/\bblouses?\b/] },
      { name: 'Long Sleeve', slug: 'long_sleeve', patterns: [/\blong[ -]?sleeve(?:d)?\b/] },
      { name: 'Sweatshirt', slug: 'sweatshirt', patterns: [/\bsweatshirts?\b/, /\bcrewnecks?\b/] },
      { name: 'Hoodie', slug: 'hoodie', patterns: [/\bhood(?:ie|ed sweatshirt)s?\b/] },
      { name: 'Shirt', slug: 'shirt', patterns: [/\bshirts?\b/, /\bbutton[ -]?(?:up|down)\b/] },
    ],
  },
  {
    name: 'Knitwear',
    slug: 'knitwear',
    patterns: [/\bknitwear\b/, /\bknits?\b/],
    subcategories: [
      { name: 'Cardigan', slug: 'cardigan', patterns: [/\bcardigans?\b/] },
      {
        name: 'Knit Vest',
        slug: 'knit_vest',
        patterns: [/\bknit(?:ted)? vests?\b/, /\bsweater vests?\b/],
      },
      {
        name: 'Sweater',
        slug: 'sweater',
        patterns: [/\bsweaters?\b/, /\bjumpers?\b/, /\bpullovers?\b/],
      },
    ],
  },
  {
    name: 'Bottoms',
    slug: 'bottoms',
    patterns: [/\bbottoms?\b/, /\blegwear\b/],
    subcategories: [
      { name: 'Jeans', slug: 'jeans', patterns: [/\bjeans?\b/, /\bdenim pants?\b/] },
      { name: 'Chinos', slug: 'chinos', patterns: [/\bchinos?\b/] },
      { name: 'Cargo Pants', slug: 'cargo_pants', patterns: [/\bcargo(?: pants?| trousers?)\b/] },
      {
        name: 'Joggers',
        slug: 'joggers',
        patterns: [/\bjoggers?\b/, /\bsweatpants?\b/, /\btrack pants?\b/],
      },
      { name: 'Shorts', slug: 'shorts', patterns: [/\bshorts?\b/] },
      { name: 'Skirt', slug: 'skirt', patterns: [/\bskirts?\b/] },
      {
        name: 'Trousers',
        slug: 'trousers',
        patterns: [/\btrousers?\b/, /\bpants?\b/, /\bslacks?\b/],
      },
    ],
  },
  {
    name: 'Outerwear',
    slug: 'outerwear',
    patterns: [/\bouterwear\b/],
    subcategories: [
      { name: 'Overshirt', slug: 'overshirt', patterns: [/\bovershirts?\b/, /\bshirt jackets?\b/] },
      { name: 'Blazer', slug: 'blazer', patterns: [/\bblazers?\b/, /\bsport coats?\b/] },
      { name: 'Parka', slug: 'parka', patterns: [/\bparkas?\b/] },
      { name: 'Puffer', slug: 'puffer', patterns: [/\bpuffers?\b/, /\bdown jackets?\b/] },
      { name: 'Vest', slug: 'vest', patterns: [/\bvests?\b/, /\bgilets?\b/] },
      { name: 'Coat', slug: 'coat', patterns: [/\bcoats?\b/, /\btrench(?: coats?)?\b/] },
      { name: 'Jacket', slug: 'jacket', patterns: [/\bjackets?\b/, /\bwindbreakers?\b/] },
    ],
  },
  {
    name: 'Dresses & One-Pieces',
    slug: 'dresses_one_pieces',
    patterns: [/\bdresses?\b/, /\bone[ -]?pieces?\b/],
    subcategories: [
      { name: 'Gown', slug: 'gown', patterns: [/\bgowns?\b/] },
      { name: 'Jumpsuit', slug: 'jumpsuit', patterns: [/\bjumpsuits?\b/, /\brompers?\b/] },
      { name: 'Dress', slug: 'dress', patterns: [/\bdresses?\b/] },
    ],
  },
  {
    name: 'Footwear',
    slug: 'footwear',
    patterns: [/\bfootwear\b/, /\bshoes?\b/],
    subcategories: [
      {
        name: 'Sneakers',
        slug: 'sneakers',
        patterns: [/\bsneakers?\b/, /\btrainers?\b/, /\brunning shoes?\b/],
      },
      { name: 'Boots', slug: 'boots', patterns: [/\bboots?\b/] },
      { name: 'Loafers', slug: 'loafers', patterns: [/\bloafers?\b/] },
      {
        name: 'Formal Shoes',
        slug: 'formal_shoes',
        patterns: [/\boxfords?\b/, /\bderby shoes?\b/, /\bdress shoes?\b/],
      },
      { name: 'Sandals', slug: 'sandals', patterns: [/\bsandals?\b/] },
      { name: 'Slides', slug: 'slides', patterns: [/\bslides?\b/, /\bsliders?\b/] },
    ],
  },
  {
    name: 'Accessories',
    slug: 'accessories',
    patterns: [/\baccessories?\b/],
    subcategories: [
      { name: 'Bag', slug: 'bag', patterns: [/\bbags?\b/, /\bbackpacks?\b/, /\btotes?\b/] },
      { name: 'Belt', slug: 'belt', patterns: [/\bbelts?\b/] },
      { name: 'Cap', slug: 'cap', patterns: [/\bcaps?\b/, /\bbaseball hats?\b/] },
      { name: 'Hat', slug: 'hat', patterns: [/\bhats?\b/, /\bbeanies?\b/] },
      { name: 'Scarf', slug: 'scarf', patterns: [/\bscar(?:f|ves)\b/] },
      { name: 'Sunglasses', slug: 'sunglasses', patterns: [/\bsunglasses?\b/, /\beyewear\b/] },
      {
        name: 'Jewellery',
        slug: 'jewellery',
        patterns: [/\bjewel(?:lery|ry)\b/, /\bnecklaces?\b/, /\bbracelets?\b/, /\brings?\b/],
      },
      { name: 'Wallet', slug: 'wallet', patterns: [/\bwallets?\b/, /\bcard holders?\b/] },
    ],
  },
  {
    name: 'Other',
    slug: 'other',
    patterns: [/\bother\b/],
    subcategories: [
      { name: 'Other Clothing', slug: 'other_clothing', patterns: [] },
      { name: 'Other Accessory', slug: 'other_accessory', patterns: [] },
    ],
  },
] as const;

export function normalizeCatalogCategory(
  rawCategory: string | null,
  rawSubcategory: string | null,
  productName: string,
): CatalogCategoryMatch {
  const categorySignal = normalizeSignal(rawCategory);
  const subcategorySignal = normalizeSignal(rawSubcategory);
  const nameSignal = normalizeSignal(productName);
  const combined = `${subcategorySignal} ${categorySignal} ${nameSignal}`.trim();

  for (const category of CATALOG_TAXONOMY) {
    for (const subcategory of category.subcategories) {
      if (subcategory.patterns.some((pattern) => pattern.test(combined))) {
        const direct = subcategory.patterns.some(
          (pattern) => pattern.test(subcategorySignal) || pattern.test(categorySignal),
        );
        return {
          categorySlug: category.slug,
          subcategorySlug: subcategory.slug,
          confidence: direct ? 0.98 : 0.86,
          warnings: [],
        };
      }
    }
  }

  for (const category of CATALOG_TAXONOMY) {
    if (
      category.patterns.some(
        (pattern) => pattern.test(categorySignal) || pattern.test(subcategorySignal),
      )
    ) {
      return {
        categorySlug: category.slug,
        subcategorySlug: null,
        confidence: 0.68,
        warnings: ['subcategory_not_determined'],
      };
    }
  }

  return {
    categorySlug: 'other',
    subcategorySlug: 'other_clothing',
    confidence: 0.2,
    warnings: ['category_not_determined'],
  };
}

export function isCatalogCategoryPair(
  categorySlug: string,
  subcategorySlug: string | null,
): boolean {
  const category = CATALOG_TAXONOMY.find((candidate) => candidate.slug === categorySlug);
  if (!category) return false;
  if (subcategorySlug === null) return true;
  return category.subcategories.some((candidate) => candidate.slug === subcategorySlug);
}

function normalizeSignal(value: string | null): string {
  return (value ?? '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[_/]+/g, ' ')
    .replace(/[^a-z0-9 -]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

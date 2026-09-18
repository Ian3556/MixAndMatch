export const CATALOG_BRANDS = [
  { name: 'Nike', slug: 'nike', brandGroup: 'sportswear', featured: true },
  { name: 'Adidas', slug: 'adidas', brandGroup: 'sportswear', featured: true },
  { name: 'Uniqlo', slug: 'uniqlo', brandGroup: 'mainstream', featured: true },
  { name: 'Zara', slug: 'zara', brandGroup: 'mainstream', featured: true },
  { name: 'H&M', slug: 'hm', brandGroup: 'mainstream', featured: false },
  { name: 'COS', slug: 'cos', brandGroup: 'contemporary_premium', featured: true },
  {
    name: 'Massimo Dutti',
    slug: 'massimo-dutti',
    brandGroup: 'contemporary_premium',
    featured: false,
  },
  {
    name: 'Ralph Lauren',
    slug: 'ralph-lauren',
    brandGroup: 'contemporary_premium',
    featured: true,
  },
  {
    name: 'Tommy Hilfiger',
    slug: 'tommy-hilfiger',
    brandGroup: 'contemporary_premium',
    featured: false,
  },
  { name: "Levi's", slug: 'levis', brandGroup: 'denim_workwear', featured: false },
  { name: 'New Balance', slug: 'new-balance', brandGroup: 'sportswear', featured: false },
  { name: 'ASICS', slug: 'asics', brandGroup: 'sportswear', featured: false },
  { name: 'Puma', slug: 'puma', brandGroup: 'sportswear', featured: false },
  { name: 'Under Armour', slug: 'under-armour', brandGroup: 'sportswear', featured: false },
  {
    name: 'The North Face',
    slug: 'the-north-face',
    brandGroup: 'outdoor_technical',
    featured: false,
  },
  { name: 'Patagonia', slug: 'patagonia', brandGroup: 'outdoor_technical', featured: false },
  { name: 'Carhartt WIP', slug: 'carhartt-wip', brandGroup: 'denim_workwear', featured: false },
  { name: 'Lacoste', slug: 'lacoste', brandGroup: 'contemporary_premium', featured: false },
  { name: 'Mango', slug: 'mango', brandGroup: 'mainstream', featured: false },
  {
    name: 'Abercrombie & Fitch',
    slug: 'abercrombie-fitch',
    brandGroup: 'mainstream',
    featured: false,
  },
  { name: 'GU', slug: 'gu', brandGroup: 'budget', featured: false },
  { name: 'MUJI', slug: 'muji', brandGroup: 'minimalist', featured: false },
  { name: 'On', slug: 'on', brandGroup: 'sportswear', featured: false },
  { name: 'Salomon', slug: 'salomon', brandGroup: 'outdoor_technical', featured: false },
  { name: "Arc'teryx", slug: 'arcteryx', brandGroup: 'outdoor_technical', featured: false },
  { name: 'Columbia', slug: 'columbia', brandGroup: 'outdoor_technical', featured: false },
  { name: 'A.P.C.', slug: 'apc', brandGroup: 'contemporary_premium', featured: false },
  {
    name: 'Acne Studios',
    slug: 'acne-studios',
    brandGroup: 'contemporary_premium',
    featured: false,
  },
  { name: 'Stüssy', slug: 'stussy', brandGroup: 'streetwear', featured: false },
  { name: 'Burberry', slug: 'burberry', brandGroup: 'luxury_designer', featured: false },
] as const;

export const CATALOG_SEED = 2026;
export const DEFAULT_PRODUCT_COUNT = 1_000;
export const SYNTHETIC_CATALOG_TIMESTAMP = '2026-01-01T00:00:00.000Z';
export const SYNTHETIC_SOURCE_DOMAIN = 'synthetic.mixandmatch.invalid';

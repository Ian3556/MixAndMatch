export const EDITORIAL_IMAGE_KEYS = [
  'season-release-hero',
  'season-release-secondary',
  'season-release-resort',
  'featured-outfit-city-minimal',
  'featured-outfit-tonal-layers',
  'featured-outfit-soft-utility',
] as const;

export type EditorialImageKey = (typeof EDITORIAL_IMAGE_KEYS)[number];

export type EditorialImageSource =
  { kind: 'asset'; key: EditorialImageKey } | { kind: 'remote'; uri: string };

export type FashionSeason =
  | 'Spring/Summer'
  | 'Fall/Winter'
  | 'Resort'
  | 'Cruise'
  | 'Pre-Fall'
  | 'Couture'
  | 'Menswear'
  | 'Womenswear';

export type FashionReleaseStatus = 'released' | 'current' | 'upcoming';

export type FashionSeasonRelease = {
  id: string;
  brand: string;
  collection: string;
  title: string;
  releaseDate: string;
  season: FashionSeason;
  year: number;
  collectionType: string;
  image: EditorialImageSource;
  supportingImages: readonly EditorialImageSource[];
  description: string;
  category: string;
  location?: string;
  status: FashionReleaseStatus;
  source: string;
  sourceUrl?: string;
};

export type FeaturedOutfit = {
  id: string;
  title: string;
  description: string;
  image: EditorialImageSource;
  supportingImages: readonly EditorialImageSource[];
  style: string;
  season: string;
  occasion: string;
  audience: 'womenswear' | 'menswear' | 'unisex';
  garments: readonly string[];
  brands: readonly string[];
  colours: readonly string[];
  materials: readonly string[];
  stylingTechniques: readonly string[];
  tags: readonly string[];
  savedState: 'saved' | 'not-saved';
  source: string;
  linkedInspirationId?: string;
  linkedWardrobeItemIds: readonly string[];
  linkedPurchasableItemIds: readonly string[];
};

export type HomeEditorialContent = {
  featuredReleaseId: string;
  releases: readonly FashionSeasonRelease[];
  featuredOutfitId: string;
  outfits: readonly FeaturedOutfit[];
  provenance: 'manually-seeded';
  referenceUrl: string;
};

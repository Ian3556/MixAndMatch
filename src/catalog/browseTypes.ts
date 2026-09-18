import type {
  CatalogBrandSourceStatus,
  CatalogImageSourceType,
  CatalogProductSourceType,
  CatalogProductVariantRow,
} from '@/types/catalogDatabase';

export type CatalogBrand = {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  websiteUrl: string | null;
  status: CatalogBrandSourceStatus;
  featured: boolean;
  lastSyncedAt: string | null;
  hasDemoCatalog: boolean;
  productCount: number;
};

export type CatalogCategory = {
  id: string;
  name: string;
  slug: string;
  productCount: number;
};

export type CatalogProductSummary = {
  id: string;
  brandId: string;
  brandName: string;
  name: string;
  categoryId: string;
  categoryName: string;
  primaryColor: string | null;
  imageUrl: string | null;
  price: number | null;
  currency: string | null;
  availability: string | null;
  colorFamily: string | null;
  gender: string;
  imageSourceType: CatalogImageSourceType;
  sourceType: CatalogProductSourceType;
  isDemo: boolean;
};

export type CatalogProductFilters = {
  gender: string | null;
  colorFamily: string | null;
  size: string | null;
  minimumPrice: number | null;
  maximumPrice: number | null;
  styleTags: string[];
  sort: 'newest' | 'price_asc' | 'price_desc' | 'name';
};

export type CatalogFilterOptions = {
  genders: string[];
  colorFamilies: string[];
  sizes: string[];
  styleTags: string[];
  minimumPrice: number | null;
  maximumPrice: number | null;
};

export const EMPTY_CATALOG_FILTERS: CatalogProductFilters = {
  gender: null,
  colorFamily: null,
  size: null,
  minimumPrice: null,
  maximumPrice: null,
  styleTags: [],
  sort: 'newest',
};

export type CatalogProductVariant = Pick<
  CatalogProductVariantRow,
  | 'id'
  | 'variant_key'
  | 'external_variant_id'
  | 'sku'
  | 'size'
  | 'color'
  | 'price'
  | 'currency'
  | 'availability'
>;

export type CatalogProductDetail = CatalogProductSummary & {
  externalProductId: string | null;
  description: string | null;
  subcategoryName: string | null;
  material: string | null;
  sourceUrl: string;
  sourceDomain: string;
  imageUrls: string[];
  variants: CatalogProductVariant[];
  styleTags: string[];
  occasionTags: string[];
  seasonTags: string[];
  fit: string | null;
  silhouette: string | null;
  pattern: string | null;
  length: string | null;
  formalityLevel: number | null;
  warmthLevel: number | null;
};

export type CatalogPage<T> = {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
};

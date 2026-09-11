import type { CatalogBrandSourceStatus, CatalogProductVariantRow } from '@/types/catalogDatabase';

export type CatalogBrand = {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  websiteUrl: string | null;
  status: CatalogBrandSourceStatus;
  featured: boolean;
  lastSyncedAt: string | null;
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
};

export type CatalogPage<T> = {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
};

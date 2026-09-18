import { getSupabaseClient } from '@supabase';

import {
  EMPTY_CATALOG_FILTERS,
  type CatalogBrand,
  type CatalogCategory,
  type CatalogFilterOptions,
  type CatalogPage,
  type CatalogProductDetail,
  type CatalogProductFilters,
  type CatalogProductSummary,
} from '@/catalog/browseTypes';
import type {
  CatalogBrowseBrandRow,
  CatalogFilterOptionsRow,
  CatalogProductImageRow,
  CatalogProductRow,
  CatalogSearchProductRow,
} from '@/types/catalogDatabase';

const PRODUCT_COLUMNS =
  'id, brand_id, external_product_id, name, description, category_id, subcategory_id, raw_category, raw_subcategory, primary_color, color_family, material_summary, current_price, currency, availability, source_url, canonical_url, source_domain, status, source_type, is_demo, image_source_type, created_at';
const DEFAULT_PAGE_SIZE = 20;

export class CatalogBrowseServiceError extends Error {
  constructor(
    readonly code: 'access-denied' | 'network' | 'not-configured' | 'not-found' | 'unknown',
    message: string,
    readonly cause?: unknown,
  ) {
    super(message);
    this.name = 'CatalogBrowseServiceError';
  }
}

export async function loadFeaturedBrands(limit = 6): Promise<CatalogBrand[]> {
  const page = await loadBrands({ pageSize: 100 });
  return page.items.filter((brand) => brand.featured).slice(0, limit);
}

export async function loadBrands(options?: {
  query?: string;
  page?: number;
  pageSize?: number;
}): Promise<CatalogPage<CatalogBrand>> {
  const page = options?.page ?? 0;
  const pageSize = options?.pageSize ?? DEFAULT_PAGE_SIZE;
  const search = options?.query?.trim().slice(0, 120) ?? '';
  const result = await getSupabaseClient().rpc('catalog_browse_brands', {
    p_query: search || null,
    p_offset: page * pageSize,
    p_limit: pageSize,
  });
  if (result.error) throw normalizeCatalogBrowseError(result.error);
  const rows = result.data ?? [];
  const total = Number(rows[0]?.total_count ?? 0);
  return {
    items: rows.map(mapBrowseBrand),
    page,
    pageSize,
    total,
    hasMore: (page + 1) * pageSize < total,
  };
}

export async function searchCatalogProducts(
  query: string,
  options?: {
    page?: number;
    pageSize?: number;
    brandId?: string;
    categoryId?: string | null;
    filters?: CatalogProductFilters;
  },
): Promise<CatalogPage<CatalogProductSummary>> {
  const page = options?.page ?? 0;
  const pageSize = options?.pageSize ?? 12;
  const filters = options?.filters ?? EMPTY_CATALOG_FILTERS;
  const result = await getSupabaseClient().rpc('catalog_search_products', {
    p_query: query.trim().slice(0, 180) || null,
    p_brand_id: options?.brandId ?? null,
    p_category_id: options?.categoryId ?? null,
    p_gender: filters.gender,
    p_color_family: filters.colorFamily,
    p_size: filters.size,
    p_min_price: filters.minimumPrice,
    p_max_price: filters.maximumPrice,
    p_style_tags: filters.styleTags,
    p_sort: filters.sort,
    p_offset: page * pageSize,
    p_limit: pageSize,
  });
  if (result.error) throw normalizeCatalogBrowseError(result.error);
  const rows = result.data ?? [];
  const total = Number(rows[0]?.total_count ?? 0);
  return {
    items: rows.map(mapSearchProduct),
    page,
    pageSize,
    total,
    hasMore: (page + 1) * pageSize < total,
  };
}

export async function loadBrandProducts(options: {
  brandId: string;
  query?: string;
  categoryId?: string | null;
  filters?: CatalogProductFilters;
  page?: number;
  pageSize?: number;
}): Promise<CatalogPage<CatalogProductSummary>> {
  return searchCatalogProducts(options.query ?? '', options);
}

export async function loadBrandCategories(brandId: string): Promise<CatalogCategory[]> {
  const result = await getSupabaseClient().rpc('catalog_browse_brand_categories', {
    p_brand_id: brandId,
  });
  if (result.error) throw normalizeCatalogBrowseError(result.error);
  return (result.data ?? []).map((row) => ({
    id: row.category_id,
    name: row.category_name,
    slug: row.category_slug,
    productCount: Number(row.product_count),
  }));
}

export async function loadBrandFilterOptions(brandId: string): Promise<CatalogFilterOptions> {
  const result = await getSupabaseClient().rpc('catalog_browse_filter_options', {
    p_brand_id: brandId,
  });
  if (result.error) throw normalizeCatalogBrowseError(result.error);
  return mapFilterOptions(result.data?.[0]);
}

export async function loadCatalogProduct(productId: string): Promise<CatalogProductDetail> {
  const client = getSupabaseClient();
  const productResult = await client
    .from('catalog_products')
    .select(PRODUCT_COLUMNS)
    .eq('id', productId)
    .eq('status', 'validated')
    .maybeSingle();
  if (productResult.error) throw normalizeCatalogBrowseError(productResult.error);
  if (!productResult.data) {
    throw new CatalogBrowseServiceError('not-found', 'This catalog product is unavailable.');
  }
  const product = productResult.data as CatalogProductRow;
  const [
    brandResult,
    categoryResult,
    subcategoryResult,
    imageResult,
    variantResult,
    profileResult,
    productStyleResult,
  ] = await Promise.all([
    client.from('catalog_brands').select('id, name').eq('id', product.brand_id).maybeSingle(),
    client
      .from('catalog_categories')
      .select('id, name')
      .eq('id', product.category_id)
      .maybeSingle(),
    product.subcategory_id
      ? client
          .from('catalog_categories')
          .select('id, name')
          .eq('id', product.subcategory_id)
          .maybeSingle()
      : Promise.resolve({ data: null, error: null }),
    client
      .from('catalog_product_images')
      .select(
        'id, product_id, image_url, source_url, position, image_type, source_type, is_demo, created_at',
      )
      .eq('product_id', product.id)
      .order('position'),
    client
      .from('catalog_product_variants')
      .select(
        'id, product_id, external_variant_id, sku, variant_key, size, color, price, currency, availability, created_at, updated_at',
      )
      .eq('product_id', product.id)
      .order('color')
      .order('size'),
    client
      .from('catalog_product_style_profiles')
      .select(
        'fit, silhouette, pattern, length, formality_score, warmth_score, season_tags, occasion_tags',
      )
      .eq('product_id', product.id)
      .maybeSingle(),
    client.from('catalog_product_style_tags').select('style_tag_id').eq('product_id', product.id),
  ]);
  const error =
    brandResult.error ??
    categoryResult.error ??
    subcategoryResult.error ??
    imageResult.error ??
    variantResult.error ??
    profileResult.error ??
    productStyleResult.error;
  if (error) throw normalizeCatalogBrowseError(error);

  const styleTagIds = (productStyleResult.data ?? [])
    .map((row) => readString(row, 'style_tag_id'))
    .filter(Boolean);
  const styleTagResult =
    styleTagIds.length > 0
      ? await client
          .from('catalog_style_tags')
          .select('id, name')
          .in('id', styleTagIds)
          .order('name')
      : { data: [], error: null };
  if (styleTagResult.error) throw normalizeCatalogBrowseError(styleTagResult.error);

  const imageRows = (imageResult.data ?? []) as CatalogProductImageRow[];
  const imageUrls = imageRows.map((image) => image.image_url);
  const profile = profileResult.data;
  return {
    id: product.id,
    brandId: product.brand_id,
    brandName: brandResult.data?.name ?? 'Unknown brand',
    name: product.name,
    categoryId: product.category_id,
    categoryName: categoryResult.data?.name ?? product.raw_category ?? 'Other',
    primaryColor: product.primary_color,
    colorFamily: product.color_family,
    gender: product.gender,
    imageUrl: imageUrls[0] ?? null,
    imageSourceType: imageRows[0]?.source_type ?? product.image_source_type,
    price: product.current_price,
    currency: product.currency,
    availability: product.availability,
    sourceType: product.source_type,
    isDemo: product.is_demo,
    externalProductId: product.external_product_id,
    description: product.description,
    subcategoryName: subcategoryResult.data?.name ?? product.raw_subcategory,
    material: product.material_summary,
    sourceUrl: product.canonical_url || product.source_url,
    sourceDomain: product.source_domain,
    imageUrls,
    variants: variantResult.data ?? [],
    styleTags: (styleTagResult.data ?? []).map((row) => readString(row, 'name')).filter(Boolean),
    occasionTags: readStringArray(profile, 'occasion_tags'),
    seasonTags: readStringArray(profile, 'season_tags'),
    fit: readNullableString(profile, 'fit'),
    silhouette: readNullableString(profile, 'silhouette'),
    pattern: readNullableString(profile, 'pattern'),
    length: readNullableString(profile, 'length'),
    formalityLevel: readNullableNumber(profile, 'formality_score'),
    warmthLevel: readNullableNumber(profile, 'warmth_score'),
  };
}

function mapBrowseBrand(row: CatalogBrowseBrandRow): CatalogBrand {
  return {
    id: row.brand_id,
    name: row.brand_name,
    slug: row.brand_slug,
    logoUrl: row.logo_url,
    websiteUrl: row.website_url,
    status: row.source_status,
    featured: row.featured,
    lastSyncedAt: row.last_synced_at,
    hasDemoCatalog: row.has_demo_catalog,
    productCount: Number(row.product_count),
  };
}

function mapSearchProduct(row: CatalogSearchProductRow): CatalogProductSummary {
  return {
    id: row.product_id,
    brandId: row.brand_id,
    brandName: row.brand_name,
    name: row.product_name,
    categoryId: row.category_id,
    categoryName: row.category_name,
    primaryColor: row.primary_color,
    colorFamily: row.color_family,
    gender: row.gender,
    imageUrl: row.image_url,
    imageSourceType: row.image_source_type,
    price: row.current_price,
    currency: row.currency,
    availability: row.availability,
    sourceType: row.source_type,
    isDemo: row.is_demo,
  };
}

function mapFilterOptions(row: CatalogFilterOptionsRow | undefined): CatalogFilterOptions {
  return {
    genders: row?.genders ?? [],
    colorFamilies: row?.color_families ?? [],
    sizes: row?.sizes ?? [],
    styleTags: row?.style_tags ?? [],
    minimumPrice: row?.minimum_price ?? null,
    maximumPrice: row?.maximum_price ?? null,
  };
}

function normalizeCatalogBrowseError(error: unknown): CatalogBrowseServiceError {
  const code = readString(error, 'code');
  const message = readString(error, 'message');
  const normalized = message.toLowerCase();
  if (code === '42501' || code === 'PGRST301') {
    return new CatalogBrowseServiceError(
      'access-denied',
      'Sign in to browse the product catalog.',
      error,
    );
  }
  if (
    code === 'PGRST202' ||
    code === 'PGRST205' ||
    code === '42883' ||
    normalized.includes('schema cache')
  ) {
    return new CatalogBrowseServiceError(
      'not-configured',
      'The synthetic catalog migration and seed have not been applied to this environment yet.',
      error,
    );
  }
  if (
    error instanceof TypeError ||
    normalized.includes('network') ||
    normalized.includes('fetch')
  ) {
    return new CatalogBrowseServiceError(
      'network',
      'The catalog could not be reached. Check your connection and retry.',
      error,
    );
  }
  return new CatalogBrowseServiceError(
    'unknown',
    message || 'The catalog could not be loaded.',
    error,
  );
}

function readString(value: unknown, key: string): string {
  if (typeof value !== 'object' || value === null || !(key in value)) return '';
  const property = Reflect.get(value, key);
  return typeof property === 'string' ? property : '';
}

function readNullableString(value: unknown, key: string): string | null {
  const result = readString(value, key);
  return result || null;
}

function readNullableNumber(value: unknown, key: string): number | null {
  if (typeof value !== 'object' || value === null || !(key in value)) return null;
  const property = Reflect.get(value, key);
  return typeof property === 'number' ? property : null;
}

function readStringArray(value: unknown, key: string): string[] {
  if (typeof value !== 'object' || value === null || !(key in value)) return [];
  const property = Reflect.get(value, key);
  return Array.isArray(property)
    ? property.filter((entry): entry is string => typeof entry === 'string')
    : [];
}

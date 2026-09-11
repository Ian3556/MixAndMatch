import { getSupabaseClient } from '@supabase';

import type {
  CatalogBrand,
  CatalogCategory,
  CatalogPage,
  CatalogProductDetail,
  CatalogProductSummary,
} from '@/catalog/browseTypes';
import type {
  CatalogBrandRow,
  CatalogProductImageRow,
  CatalogProductRow,
} from '@/types/catalogDatabase';

const BRAND_COLUMNS = 'id, name, slug, logo_url, website_url, source_status, enabled';
const PRODUCT_COLUMNS =
  'id, brand_id, external_product_id, name, description, category_id, subcategory_id, primary_color, material_summary, current_price, currency, availability, source_url, canonical_url, source_domain, status, created_at';
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
  const result = await getSupabaseClient()
    .from('catalog_brands')
    .select(`${BRAND_COLUMNS}, featured, last_synced_at`)
    .eq('enabled', true)
    .eq('featured', true)
    .order('name')
    .limit(limit);
  if (result.error && ['42703', 'PGRST204'].includes(result.error.code)) return [];
  if (result.error) throw normalizeCatalogBrowseError(result.error);
  return (result.data ?? []).map(mapBrand);
}

export async function loadBrands(options?: {
  query?: string;
  page?: number;
  pageSize?: number;
}): Promise<CatalogPage<CatalogBrand>> {
  const page = options?.page ?? 0;
  const pageSize = options?.pageSize ?? DEFAULT_PAGE_SIZE;
  const search = options?.query?.trim().slice(0, 120) ?? '';
  let request = getSupabaseClient()
    .from('catalog_brands')
    .select(BRAND_COLUMNS, { count: 'exact' })
    .eq('enabled', true)
    .order('name')
    .range(page * pageSize, page * pageSize + pageSize - 1);
  if (search) request = request.ilike('name', `%${escapeLike(search)}%`);
  const result = await request;
  if (result.error) throw normalizeCatalogBrowseError(result.error);
  const total = result.count ?? 0;
  return {
    items: (result.data ?? []).map(mapBrand),
    page,
    pageSize,
    total,
    hasMore: (page + 1) * pageSize < total,
  };
}

export async function searchCatalogProducts(
  query: string,
  options?: { page?: number; pageSize?: number; brandId?: string; categoryId?: string | null },
): Promise<CatalogPage<CatalogProductSummary>> {
  const page = options?.page ?? 0;
  const pageSize = options?.pageSize ?? 12;
  const search = query.trim().slice(0, 180);
  let request = getSupabaseClient()
    .from('catalog_products')
    .select(PRODUCT_COLUMNS, { count: 'exact' })
    .eq('status', 'validated')
    .order('created_at', { ascending: false })
    .range(page * pageSize, page * pageSize + pageSize - 1);
  if (options?.brandId) request = request.eq('brand_id', options.brandId);
  if (options?.categoryId) request = request.eq('category_id', options.categoryId);
  if (search) {
    request = request.textSearch('search_document', search, {
      type: 'websearch',
      config: 'simple',
    });
  }
  const result = await request;
  if (result.error) throw normalizeCatalogBrowseError(result.error);
  const rows = (result.data ?? []) as CatalogProductRow[];
  const items = await hydrateProductSummaries(rows);
  const total = result.count ?? 0;
  return { items, page, pageSize, total, hasMore: (page + 1) * pageSize < total };
}

export async function loadBrandProducts(options: {
  brandId: string;
  query?: string;
  categoryId?: string | null;
  page?: number;
  pageSize?: number;
}): Promise<CatalogPage<CatalogProductSummary>> {
  return searchCatalogProducts(options.query ?? '', options);
}

export async function loadBrandCategories(brandId: string): Promise<CatalogCategory[]> {
  const client = getSupabaseClient();
  const result = await client.rpc('catalog_browse_brand_categories', {
    p_brand_id: brandId,
  });
  if (result.error && result.error.code === 'PGRST202') {
    const fallback = await client
      .from('catalog_categories')
      .select('id, name, slug')
      .eq('enabled', true)
      .eq('level', 1)
      .order('sort_order');
    if (fallback.error) throw normalizeCatalogBrowseError(fallback.error);
    return (fallback.data ?? []).map((row) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      productCount: 0,
    }));
  }
  if (result.error) throw normalizeCatalogBrowseError(result.error);
  return (result.data ?? []).map((row) => ({
    id: row.category_id,
    name: row.category_name,
    slug: row.category_slug,
    productCount: Number(row.product_count),
  }));
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
  const [brandResult, categoryResult, subcategoryResult, imageResult, variantResult] =
    await Promise.all([
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
        .select('id, product_id, image_url, source_url, position, image_type, created_at')
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
    ]);
  const error =
    brandResult.error ??
    categoryResult.error ??
    subcategoryResult.error ??
    imageResult.error ??
    variantResult.error;
  if (error) throw normalizeCatalogBrowseError(error);

  const imageUrls = (imageResult.data ?? []).map((image) => image.image_url);
  return {
    id: product.id,
    brandId: product.brand_id,
    brandName: brandResult.data?.name ?? 'Unknown brand',
    name: product.name,
    categoryId: product.category_id,
    categoryName: categoryResult.data?.name ?? product.raw_category ?? 'Other',
    primaryColor: product.primary_color,
    imageUrl: imageUrls[0] ?? null,
    price: product.current_price,
    currency: product.currency,
    availability: product.availability,
    externalProductId: product.external_product_id,
    description: product.description,
    subcategoryName: subcategoryResult.data?.name ?? product.raw_subcategory,
    material: product.material_summary,
    sourceUrl: product.canonical_url || product.source_url,
    sourceDomain: product.source_domain,
    imageUrls,
    variants: variantResult.data ?? [],
  };
}

async function hydrateProductSummaries(
  products: CatalogProductRow[],
): Promise<CatalogProductSummary[]> {
  if (products.length === 0) return [];
  const client = getSupabaseClient();
  const brandIds = unique(products.map((product) => product.brand_id));
  const categoryIds = unique(products.map((product) => product.category_id));
  const productIds = products.map((product) => product.id);
  const [brandResult, categoryResult, imageResult] = await Promise.all([
    client.from('catalog_brands').select('id, name').in('id', brandIds),
    client.from('catalog_categories').select('id, name').in('id', categoryIds),
    client
      .from('catalog_product_images')
      .select('product_id, image_url, position')
      .in('product_id', productIds)
      .order('position'),
  ]);
  const error = brandResult.error ?? categoryResult.error ?? imageResult.error;
  if (error) throw normalizeCatalogBrowseError(error);

  const brands = new Map((brandResult.data ?? []).map((brand) => [brand.id, brand.name]));
  const categories = new Map(
    (categoryResult.data ?? []).map((category) => [category.id, category.name]),
  );
  const images = firstImageByProduct(imageResult.data ?? []);

  return products.map((product) => ({
    id: product.id,
    brandId: product.brand_id,
    brandName: brands.get(product.brand_id) ?? 'Unknown brand',
    name: product.name,
    categoryId: product.category_id,
    categoryName: categories.get(product.category_id) ?? product.raw_category ?? 'Other',
    primaryColor: product.primary_color,
    imageUrl: images.get(product.id) ?? null,
    price: product.current_price,
    currency: product.currency,
    availability: product.availability,
  }));
}

function mapBrand(
  row: Pick<
    CatalogBrandRow,
    'id' | 'name' | 'slug' | 'logo_url' | 'website_url' | 'source_status'
  > &
    Partial<Pick<CatalogBrandRow, 'featured' | 'last_synced_at'>>,
): CatalogBrand {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    logoUrl: row.logo_url,
    websiteUrl: row.website_url,
    status: row.source_status,
    featured: row.featured ?? false,
    lastSyncedAt: row.last_synced_at ?? null,
  };
}

function firstImageByProduct(
  rows: Pick<CatalogProductImageRow, 'product_id' | 'image_url' | 'position'>[],
): Map<string, string> {
  const images = new Map<string, string>();
  for (const row of rows) {
    if (!images.has(row.product_id)) images.set(row.product_id, row.image_url);
  }
  return images;
}

function unique(values: string[]): string[] {
  return [...new Set(values)];
}

function escapeLike(value: string): string {
  return value.replace(/[\\%_]/g, (character) => `\\${character}`);
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
  if (code === 'PGRST202' || code === 'PGRST205' || normalized.includes('schema cache')) {
    return new CatalogBrowseServiceError(
      'not-configured',
      'The catalog update has not been applied to this environment yet.',
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

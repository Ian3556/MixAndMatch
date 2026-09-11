export type CatalogJson =
  string | number | boolean | null | { [key: string]: CatalogJson | undefined } | CatalogJson[];

export type CatalogBrandSourceStatus =
  | 'ready'
  | 'supported'
  | 'partially_supported'
  | 'manual_seed_required'
  | 'blocked'
  | 'unavailable'
  | 'completed';
export type CatalogProductStatus =
  | 'raw'
  | 'processing'
  | 'enriched'
  | 'needs_review'
  | 'validated'
  | 'rejected'
  | 'unavailable'
  | 'archived';
export type CatalogImportJobStatus =
  'queued' | 'running' | 'paused' | 'completed' | 'completed_with_errors' | 'failed' | 'stopped';

export type CatalogBrandRow = {
  id: string;
  name: string;
  slug: string;
  brand_group: string;
  website_url: string | null;
  logo_url: string | null;
  source_status: CatalogBrandSourceStatus;
  enabled: boolean;
  featured: boolean;
  last_synced_at: string | null;
  target_validated_count: number;
  category_targets: CatalogJson;
  source_status_reason: string | null;
  created_at: string;
  updated_at: string;
};

export type CatalogCategoryRow = {
  id: string;
  parent_id: string | null;
  name: string;
  slug: string;
  level: number;
  sort_order: number;
  enabled: boolean;
  created_at: string;
  updated_at: string;
};

export type CatalogProductRow = {
  id: string;
  brand_id: string;
  external_product_id: string | null;
  external_style_id: string | null;
  external_sku: string | null;
  name: string;
  slug: string;
  description: string | null;
  category_id: string;
  subcategory_id: string | null;
  raw_category: string | null;
  raw_subcategory: string | null;
  gender: string;
  primary_color: string | null;
  color_family: string | null;
  material_summary: string | null;
  current_price: number | null;
  original_price: number | null;
  currency: string | null;
  price_unavailable: boolean;
  availability: string | null;
  source_url: string;
  canonical_url: string;
  source_domain: string;
  deduplication_key: string;
  status: CatalogProductStatus;
  validation_errors: string[];
  validation_warnings: string[];
  overall_confidence: number;
  normalization_version: string;
  imported_at: string;
  last_checked_at: string | null;
  created_at: string;
  updated_at: string;
  search_document: unknown;
};

export type CatalogProductVariantRow = {
  id: string;
  product_id: string;
  external_variant_id: string | null;
  sku: string | null;
  variant_key: string;
  size: string | null;
  color: string | null;
  price: number | null;
  currency: string | null;
  availability: string | null;
  created_at: string;
  updated_at: string;
};

export type CatalogProductImageRow = {
  id: string;
  product_id: string;
  image_url: string;
  source_url: string;
  position: number;
  image_type: string;
  created_at: string;
};

export type CatalogBrandCategoryRow = {
  category_id: string;
  category_name: string;
  category_slug: string;
  product_count: number;
};

type ReadMostlyTable<Row> = {
  Row: Row;
  Insert: Partial<Row>;
  Update: Partial<Row>;
  Relationships: [];
};

export type CatalogOverviewRow = {
  total_brands: number;
  enabled_brands: number;
  total_products: number;
  raw_products: number;
  validated_products: number;
  needs_review_products: number;
  rejected_products: number;
  failed_imports: number;
  duplicate_imports: number;
};

export type CatalogBrandProgressRow = {
  brand_id: string;
  brand_name: string;
  brand_slug: string;
  source_status: CatalogBrandSourceStatus;
  enabled: boolean;
  target_validated_count: number;
  total_count: number;
  validated_count: number;
  needs_review_count: number;
  rejected_count: number;
  category_targets: CatalogJson;
  category_distribution: CatalogJson;
  enabled_source_count: number;
};

export type CatalogReviewQueueRow = {
  product_id: string;
  brand_name: string;
  product_name: string;
  status: CatalogProductStatus;
  current_price: number | null;
  currency: string | null;
  source_url: string;
  raw_category: string | null;
  primary_color: string | null;
  color_family: string | null;
  material_summary: string | null;
  price_unavailable: boolean;
  category_slug: string;
  subcategory_slug: string | null;
  image_url: string | null;
  confidence: number;
  warnings: string[];
  errors: string[];
  style_tags: string[];
};

export type CatalogRecentJobRow = {
  job_id: string;
  brand_name: string;
  status: CatalogImportJobStatus;
  operation: string;
  requested_count: number;
  discovered_count: number;
  imported_count: number;
  validated_count: number;
  rejected_count: number;
  duplicate_count: number;
  failed_count: number;
  started_at: string | null;
  completed_at: string | null;
  error_summary: string | null;
};

export type CatalogImportErrorRow = {
  error_id: string;
  job_id: string;
  product_url: string | null;
  error_type: string;
  message: string;
  retryable: boolean;
  created_at: string;
};

export type CatalogDatabaseTables = {
  catalog_developers: ReadMostlyTable<{
    user_id: string;
    note: string | null;
    created_at: string;
  }>;
  catalog_brands: ReadMostlyTable<CatalogBrandRow>;
  catalog_brand_sources: ReadMostlyTable<{
    id: string;
    brand_id: string;
    source_type: string;
    label: string;
    status: CatalogBrandSourceStatus;
    allowed_domains: string[];
    entry_urls: string[];
    max_requests: number;
    delay_ms: number;
    concurrency: number;
    timeout_ms: number;
    retry_count: number;
    max_crawl_depth: number;
    enabled: boolean;
    robots_reviewed_at: string | null;
    terms_reviewed_at: string | null;
    blocked_reason: string | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
  }>;
  catalog_categories: ReadMostlyTable<CatalogCategoryRow>;
  catalog_products: ReadMostlyTable<CatalogProductRow>;
  catalog_product_variants: ReadMostlyTable<CatalogProductVariantRow>;
  catalog_product_images: ReadMostlyTable<CatalogProductImageRow>;
  catalog_style_tags: ReadMostlyTable<Record<string, unknown>>;
  catalog_product_style_tags: ReadMostlyTable<Record<string, unknown>>;
  catalog_product_style_profiles: ReadMostlyTable<Record<string, unknown>>;
  catalog_product_materials: ReadMostlyTable<Record<string, unknown>>;
  catalog_product_sources: ReadMostlyTable<Record<string, unknown>>;
  catalog_collections: ReadMostlyTable<Record<string, unknown>>;
  catalog_product_collections: ReadMostlyTable<Record<string, unknown>>;
  catalog_import_jobs: ReadMostlyTable<Record<string, unknown>>;
  catalog_import_entries: ReadMostlyTable<Record<string, unknown>>;
  catalog_import_errors: ReadMostlyTable<Record<string, unknown>>;
};

export type CatalogDatabaseFunctions = {
  is_catalog_developer: { Args: Record<PropertyKey, never>; Returns: boolean };
  catalog_admin_overview: { Args: Record<PropertyKey, never>; Returns: CatalogOverviewRow[] };
  catalog_admin_brand_progress: {
    Args: Record<PropertyKey, never>;
    Returns: CatalogBrandProgressRow[];
  };
  catalog_admin_review_queue: {
    Args: { p_limit?: number };
    Returns: CatalogReviewQueueRow[];
  };
  catalog_admin_recent_jobs: {
    Args: { p_limit?: number };
    Returns: CatalogRecentJobRow[];
  };
  catalog_admin_import_errors: {
    Args: { p_job_id?: string | null; p_limit?: number };
    Returns: CatalogImportErrorRow[];
  };
  catalog_browse_brand_categories: {
    Args: { p_brand_id: string };
    Returns: CatalogBrandCategoryRow[];
  };
};

export type CatalogDatabaseEnums = {
  catalog_brand_source_status: CatalogBrandSourceStatus;
  catalog_product_status: CatalogProductStatus;
  catalog_import_job_status: CatalogImportJobStatus;
};

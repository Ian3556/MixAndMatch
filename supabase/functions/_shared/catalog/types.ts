export const CATALOG_NORMALIZATION_VERSION = 'catalog-normalizer-v1';
export const CATALOG_ENRICHMENT_VERSION = 'catalog-rules-v1';
export const CATALOG_IMPORTER_VERSION = 'catalog-importer-v1';

export type CatalogSourceType =
  'url' | 'csv' | 'retailer_feed' | 'affiliate_feed' | 'brand_api' | 'pim' | 'manual';

export type CatalogExtractionMethod =
  | 'json_ld'
  | 'open_graph'
  | 'html_meta'
  | 'public_embedded_state'
  | 'domain_adapter'
  | 'csv'
  | 'feed'
  | 'api'
  | 'pim'
  | 'manual';

export type CatalogGender = 'men' | 'women' | 'unisex' | 'kids' | 'unknown';
export type CatalogProductDecision = 'validated' | 'needs_review' | 'rejected';
export type CatalogImageType = 'primary' | 'alternate' | 'detail' | 'lifestyle';

export type RawCatalogVariant = {
  externalVariantId?: string | undefined;
  sku?: string | undefined;
  size?: string | undefined;
  color?: string | undefined;
  price?: number | string | undefined;
  currency?: string | undefined;
  availability?: string | undefined;
};

export type RawCatalogImage = {
  imageUrl: string;
  sourceUrl?: string | undefined;
  imageType?: CatalogImageType | undefined;
};

export type RawCatalogProductCandidate = {
  externalProductId?: string | undefined;
  externalStyleId?: string | undefined;
  externalSku?: string | undefined;
  name?: string | undefined;
  description?: string | undefined;
  brand?: string | undefined;
  gender?: string | undefined;
  category?: string | undefined;
  subcategory?: string | undefined;
  color?: string | undefined;
  materials?: string | string[] | undefined;
  currentPrice?: number | string | undefined;
  originalPrice?: number | string | undefined;
  currency?: string | undefined;
  priceUnavailable?: boolean | undefined;
  availability?: string | undefined;
  sourceUrl?: string | undefined;
  canonicalUrl?: string | undefined;
  sourceDomain?: string | undefined;
  extractionMethod: CatalogExtractionMethod;
  images?: RawCatalogImage[] | undefined;
  variants?: RawCatalogVariant[] | undefined;
  styleHints?: string[] | undefined;
  rawPayload?: Record<string, unknown> | undefined;
};

export type CatalogCategoryMatch = {
  categorySlug: string;
  subcategorySlug: string | null;
  confidence: number;
  warnings: string[];
};

export type NormalizedCatalogVariant = {
  externalVariantId: string | null;
  sku: string | null;
  variantKey: string;
  size: string | null;
  color: string | null;
  price: number | null;
  currency: string | null;
  availability: string | null;
};

export type NormalizedCatalogImage = {
  imageUrl: string;
  sourceUrl: string;
  position: number;
  imageType: CatalogImageType;
};

export type NormalizedMaterial = {
  material: string;
  percentage: number | null;
  confidence: number;
};

export type NormalizedCatalogProduct = {
  brandSlug: string;
  sourceBrand: string | null;
  externalProductId: string | null;
  externalStyleId: string | null;
  externalSku: string | null;
  name: string;
  slug: string;
  description: string | null;
  categorySlug: string;
  subcategorySlug: string | null;
  rawCategory: string | null;
  rawSubcategory: string | null;
  categoryConfidence: number;
  gender: CatalogGender;
  primaryColor: string | null;
  colorFamily: string | null;
  colorConfidence: number;
  materialSummary: string | null;
  materials: NormalizedMaterial[];
  currentPrice: number | null;
  originalPrice: number | null;
  currency: string | null;
  priceUnavailable: boolean;
  availability: string | null;
  sourceUrl: string;
  canonicalUrl: string;
  sourceDomain: string;
  extractionMethod: CatalogExtractionMethod;
  deduplicationKey: string;
  images: NormalizedCatalogImage[];
  variants: NormalizedCatalogVariant[];
  styleHints: string[];
  rawPayload: Record<string, unknown>;
  normalizationWarnings: string[];
  normalizationVersion: string;
};

export type CatalogStyleTag = {
  slug: string;
  confidence: number;
};

export type CatalogStyleProfile = {
  fit: string | null;
  silhouette: string | null;
  pattern: string | null;
  texture: string | null;
  layerRole: string | null;
  formalityScore: number | null;
  warmthScore: number | null;
  seasonTags: string[];
  occasionTags: string[];
  dominantColor: string | null;
  secondaryColors: string[];
  confidence: number;
  enrichmentVersion: string;
  reviewed: boolean;
};

export type EnrichedCatalogProduct = NormalizedCatalogProduct & {
  styleTags: CatalogStyleTag[];
  styleProfile: CatalogStyleProfile;
  overallConfidence: number;
  enrichmentWarnings: string[];
};

export type CatalogValidationResult = {
  decision: CatalogProductDecision;
  errors: string[];
  warnings: string[];
};

export type CatalogPipelineProduct = EnrichedCatalogProduct & {
  sourceCandidateIndex: number;
  validation: CatalogValidationResult;
};

export type CatalogDuplicate = {
  candidateIndex: number;
  duplicateOfIndex: number;
  deduplicationKey: string;
};

export type CatalogPipelineBatch = {
  products: CatalogPipelineProduct[];
  duplicates: CatalogDuplicate[];
};

export type CatalogPipelineContext = {
  brandSlug: string;
  expectedBrandName?: string | undefined;
};

export type CatalogImportSource = {
  sourceType: CatalogSourceType;
  brandSlug: string;
  url?: string | undefined;
  html?: string | undefined;
  payload?: unknown;
};

export interface CatalogImporterAdapter {
  readonly id: string;
  readonly sourceType: CatalogSourceType;
  canHandle(source: CatalogImportSource): boolean;
  extract(source: CatalogImportSource): Promise<RawCatalogProductCandidate[]>;
}

export type CatalogJobEntryState = {
  id: string;
  sequenceNumber: number;
  status: 'pending' | 'processing' | 'completed' | 'duplicate' | 'failed' | 'skipped';
  attemptCount: number;
  maxAttempts: number;
  retryable: boolean;
};

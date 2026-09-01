import { isCatalogCategoryPair } from './taxonomy';
import { normalizeSlug } from './normalize';
import type {
  CatalogPipelineContext,
  CatalogValidationResult,
  EnrichedCatalogProduct,
} from './types';

const REJECTING_ERRORS = new Set([
  'invalid_brand',
  'brand_mismatch',
  'missing_product_name',
  'invalid_source_url',
  'source_domain_mismatch',
  'missing_image',
  'invalid_category',
]);

export function validateCatalogProduct(
  product: EnrichedCatalogProduct,
  context: CatalogPipelineContext,
): CatalogValidationResult {
  const errors: string[] = [];
  const warnings = [...product.normalizationWarnings, ...product.enrichmentWarnings];

  if (!product.brandSlug || product.brandSlug === 'unknown-brand') errors.push('invalid_brand');
  if (
    context.expectedBrandName &&
    product.sourceBrand &&
    normalizeSlug(product.sourceBrand) !== normalizeSlug(context.expectedBrandName) &&
    normalizeSlug(product.sourceBrand) !== normalizeSlug(context.brandSlug)
  ) {
    errors.push('brand_mismatch');
  }
  if (!product.name) errors.push('missing_product_name');
  if (!isHttpUrl(product.sourceUrl) || !isHttpUrl(product.canonicalUrl)) {
    errors.push('invalid_source_url');
  }
  if (readDomain(product.sourceUrl) !== product.sourceDomain) errors.push('source_domain_mismatch');
  if (product.images.length === 0 || !product.images.some((image) => isHttpUrl(image.imageUrl))) {
    errors.push('missing_image');
  }
  if (!isCatalogCategoryPair(product.categorySlug, product.subcategorySlug)) {
    errors.push('invalid_category');
  } else if (product.categorySlug === 'other' || product.categoryConfidence < 0.55) {
    errors.push('category_requires_review');
  }
  if (!product.colorFamily) errors.push('missing_color_family');
  if (product.currentPrice === null && !product.priceUnavailable)
    errors.push('missing_price_state');
  if (product.currentPrice !== null && !product.currency) errors.push('missing_currency');
  if (product.styleTags.length === 0 || !product.styleProfile.layerRole) {
    errors.push('missing_style_classification');
  }
  if (!product.deduplicationKey || !product.normalizationVersion) {
    errors.push('normalization_failed');
  }

  const uniqueErrors = unique(errors);
  if (uniqueErrors.some((error) => REJECTING_ERRORS.has(error))) {
    return { decision: 'rejected', errors: uniqueErrors, warnings: unique(warnings) };
  }
  if (uniqueErrors.length > 0 || product.overallConfidence < 0.72) {
    if (product.overallConfidence < 0.72)
      warnings.push('overall_confidence_below_validation_threshold');
    return { decision: 'needs_review', errors: uniqueErrors, warnings: unique(warnings) };
  }
  return { decision: 'validated', errors: [], warnings: unique(warnings) };
}

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function readDomain(value: string): string {
  try {
    return new URL(value).hostname.toLowerCase().replace(/^www\./, '');
  } catch {
    return '';
  }
}

function unique(values: string[]): string[] {
  return [...new Set(values)];
}

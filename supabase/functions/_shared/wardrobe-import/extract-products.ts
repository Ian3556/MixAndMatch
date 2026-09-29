import { extractMarkupProducts, extractOpenGraphProduct } from './html-parsers.ts';
import { extractJsonLdProducts } from './json-ld.ts';
import { extractMaterialCompositionFromHtml } from './material-spec.ts';
import { normalizeProducts } from './normalize-product.ts';
import { MAX_RAW_PRODUCT_CANDIDATES, type WardrobeImportResponse } from './types.ts';

export function extractProductsFromHtml(html: string, sourceUrl: string): WardrobeImportResponse {
  const structured = extractJsonLdProducts(html, sourceUrl, MAX_RAW_PRODUCT_CANDIDATES);
  const remainingAfterStructured = MAX_RAW_PRODUCT_CANDIDATES - structured.length;
  const openGraph = remainingAfterStructured > 0 ? extractOpenGraphProduct(html, sourceUrl) : [];
  const remainingAfterMetadata = remainingAfterStructured - openGraph.length;
  const markup =
    remainingAfterMetadata > 0 ? extractMarkupProducts(html, remainingAfterMetadata) : [];
  const products = normalizeProducts([...structured, ...openGraph, ...markup], sourceUrl);
  const structuredCollection = /["']@type["']\s*:\s*["']ItemList["']/i.test(html);
  if (
    structured.length === 1 &&
    products.length === 1 &&
    !structuredCollection &&
    !products[0]?.material
  ) {
    const material = extractMaterialCompositionFromHtml(html);
    if (material) products[0]!.material = material;
  }
  const warnings: string[] = [];

  if (products.some((product) => product.confidence === 'low')) {
    warnings.push('Some products were detected from page markup and may need review.');
  }
  if (products.some((product) => !product.imageUrl || !product.category)) {
    warnings.push('Some product details are incomplete. Review them before saving.');
  }

  const pageType =
    products.length === 0
      ? 'unknown'
      : products.length > 1 || structuredCollection
        ? 'collection'
        : 'product';

  return {
    sourceUrl,
    sourceDomain: new URL(sourceUrl).hostname.toLowerCase(),
    pageType,
    products,
    warnings,
  };
}

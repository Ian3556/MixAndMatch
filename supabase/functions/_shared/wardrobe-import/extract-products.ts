import {
  extractGenericHtmlProducts,
  extractOpenGraphProduct,
  extractPlatformProducts,
} from './html-parsers.ts';
import { extractJsonLdProducts } from './json-ld.ts';
import { normalizeProducts } from './normalize-product.ts';
import type { WardrobeImportResponse } from './types.ts';

export function extractProductsFromHtml(html: string, sourceUrl: string): WardrobeImportResponse {
  const structured = extractJsonLdProducts(html, sourceUrl);
  const openGraph = extractOpenGraphProduct(html, sourceUrl);
  const platform = extractPlatformProducts(html);
  const generic = extractGenericHtmlProducts(html);
  const products = normalizeProducts(
    [...structured, ...openGraph, ...platform, ...generic],
    sourceUrl,
  );
  const warnings: string[] = [];

  if (products.some((product) => product.confidence === 'low')) {
    warnings.push('Some products were detected from page markup and may need review.');
  }
  if (products.some((product) => !product.imageUrl || !product.category)) {
    warnings.push('Some product details are incomplete. Review them before saving.');
  }

  const structuredCollection = /["']@type["']\s*:\s*["']ItemList["']/i.test(html);
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

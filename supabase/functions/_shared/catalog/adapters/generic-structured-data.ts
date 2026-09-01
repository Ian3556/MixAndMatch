import { extractProductsFromHtml } from '../../wardrobe-import/extract-products';
import type { ExtractionMethod } from '../../wardrobe-import/types';
import type {
  CatalogExtractionMethod,
  CatalogImporterAdapter,
  CatalogImportSource,
  RawCatalogProductCandidate,
} from '../types';

const EXTRACTION_METHODS: Record<ExtractionMethod, CatalogExtractionMethod> = {
  'json-ld': 'json_ld',
  'open-graph': 'open_graph',
  'platform-adapter': 'domain_adapter',
  'html-heuristic': 'html_meta',
};

export class GenericStructuredDataAdapter implements CatalogImporterAdapter {
  readonly id = 'generic-structured-data-v1';
  readonly sourceType = 'url' as const;

  canHandle(source: CatalogImportSource): boolean {
    return source.sourceType === 'url' && Boolean(source.url?.trim() && source.html?.trim());
  }

  async extract(source: CatalogImportSource): Promise<RawCatalogProductCandidate[]> {
    if (!this.canHandle(source) || !source.url || !source.html) {
      throw new Error(
        'The generic structured-data adapter requires a public URL and fetched HTML.',
      );
    }

    const extracted = extractProductsFromHtml(source.html, source.url);
    return extracted.products.map((product) => ({
      externalProductId: product.externalId,
      name: product.name,
      description: product.description,
      brand: product.brand,
      category: product.category,
      subcategory: product.subcategory,
      color: product.color,
      currentPrice: product.price,
      currency: product.currency,
      availability: product.availability,
      sourceUrl: product.productUrl,
      canonicalUrl: product.canonicalUrl,
      sourceDomain: product.sourceDomain,
      extractionMethod: EXTRACTION_METHODS[product.extractionMethod],
      images: product.imageUrl
        ? [{ imageUrl: product.imageUrl, sourceUrl: product.productUrl, imageType: 'primary' }]
        : [],
      rawPayload: {
        extractionConfidence: product.confidence,
        discoveredFrom: extracted.sourceUrl,
        pageType: extracted.pageType,
      },
    }));
  }
}

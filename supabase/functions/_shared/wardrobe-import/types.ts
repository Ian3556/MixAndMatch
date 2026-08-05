export const MAX_IMPORTED_PRODUCTS = 50;

export type WardrobeImportErrorCode =
  | 'INVALID_URL'
  | 'UNSAFE_URL'
  | 'UNSUPPORTED_PROTOCOL'
  | 'PAGE_NOT_FOUND'
  | 'ACCESS_DENIED'
  | 'IMPORT_TIMEOUT'
  | 'RESPONSE_TOO_LARGE'
  | 'UNSUPPORTED_CONTENT_TYPE'
  | 'NO_PRODUCTS_FOUND'
  | 'RATE_LIMITED'
  | 'NETWORK_ERROR'
  | 'IMPORT_FAILED';

export type ExtractionMethod = 'json-ld' | 'open-graph' | 'platform-adapter' | 'html-heuristic';

export type ImportedProductCandidate = {
  externalId?: string;
  name: string;
  description?: string;
  brand?: string;
  imageUrl?: string;
  productUrl: string;
  canonicalUrl?: string;
  category?: string;
  subcategory?: string;
  color?: string;
  price?: number;
  currency?: string;
  availability?: string;
  sourceDomain: string;
  extractionMethod: ExtractionMethod;
  confidence: 'high' | 'medium' | 'low';
};

export type WardrobeImportResponse = {
  sourceUrl: string;
  sourceDomain: string;
  pageType: 'product' | 'collection' | 'unknown';
  products: ImportedProductCandidate[];
  warnings: string[];
};

export type WardrobeImportErrorResponse = {
  code: WardrobeImportErrorCode;
  message: string;
};

export type RawProductCandidate = {
  externalId?: string | undefined;
  name?: string | undefined;
  description?: string | undefined;
  brand?: string | undefined;
  imageUrl?: string | undefined;
  productUrl?: string | undefined;
  canonicalUrl?: string | undefined;
  category?: string | undefined;
  subcategory?: string | undefined;
  color?: string | undefined;
  price?: number | string | undefined;
  currency?: string | undefined;
  availability?: string | undefined;
  extractionMethod: ExtractionMethod;
  confidence: ImportedProductCandidate['confidence'];
};

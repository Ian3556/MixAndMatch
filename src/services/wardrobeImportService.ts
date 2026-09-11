import { getSupabaseClient } from '@supabase';
import type {
  WardrobeImportErrorCode,
  WardrobeImportErrorResponse,
  WardrobeImportResponse,
} from '@supabase/functions/_shared/wardrobe-import/types';
import { validateImportUrl } from '@supabase/functions/_shared/wardrobe-import/validate-url';

export class WardrobeImportClientError extends Error {
  constructor(
    readonly code: WardrobeImportErrorCode,
    message: string,
  ) {
    super(message);
    this.name = 'WardrobeImportClientError';
  }
}

export async function importWardrobeUrl(input: string): Promise<WardrobeImportResponse> {
  const validation = validateImportUrl(input);
  if (!validation.ok) throw new WardrobeImportClientError(validation.code, validation.message);

  logImportStage('request_started', { domain: validation.url.hostname.toLowerCase() });

  const result = await getSupabaseClient().functions.invoke<WardrobeImportResponse>(
    'import-wardrobe-url',
    { body: { url: validation.url.toString() } },
  );
  if (result.error) {
    const normalized = await normalizeFunctionError(result.error);
    logImportStage('failed', { code: normalized.code, stage: 'function_invoke' });
    throw normalized;
  }
  if (!isImportResponse(result.data)) {
    logImportStage('failed', { code: 'IMPORT_FAILED', stage: 'response_validation' });
    throw new WardrobeImportClientError(
      'IMPORT_FAILED',
      'The import service returned an invalid response.',
    );
  }
  if (result.data.products.length === 0) {
    logImportStage('failed', { code: 'NO_PRODUCTS_FOUND', stage: 'product_normalization' });
    throw new WardrobeImportClientError(
      'NO_PRODUCTS_FOUND',
      'No clothing products were found on this page. Try a direct product or collection URL.',
    );
  }
  logImportStage('request_completed', { products: result.data.products.length });
  return result.data;
}

async function normalizeFunctionError(error: unknown): Promise<WardrobeImportClientError> {
  const context = readProperty(error, 'context');
  if (context instanceof Response) {
    try {
      const body = (await context.json()) as Partial<WardrobeImportErrorResponse>;
      if (
        context.status === 404 &&
        readProperty(body, 'code') === 'NOT_FOUND' &&
        readProperty(body, 'message') === 'Requested function was not found'
      ) {
        return new WardrobeImportClientError(
          'SERVICE_UNAVAILABLE',
          'Product import is not available in this environment yet. Continue manually or try again after the service is deployed.',
        );
      }
      if (isErrorCode(body.code) && typeof body.message === 'string') {
        return new WardrobeImportClientError(body.code, body.message);
      }
    } catch {
      // Fall through to safe generic error mapping.
    }
  }

  const message = readString(error, 'message').toLowerCase();
  if (message.includes('network') || message.includes('fetch')) {
    return new WardrobeImportClientError(
      'NETWORK_ERROR',
      'We could not reach the import service. Check your connection and try again.',
    );
  }
  return new WardrobeImportClientError(
    'IMPORT_FAILED',
    'The page could not be imported. Try again later.',
  );
}

function isImportResponse(value: unknown): value is WardrobeImportResponse {
  if (typeof value !== 'object' || value === null) return false;
  const products = readProperty(value, 'products');
  return (
    typeof readProperty(value, 'sourceUrl') === 'string' &&
    typeof readProperty(value, 'sourceDomain') === 'string' &&
    Array.isArray(products) &&
    products.every(
      (product) =>
        typeof product === 'object' &&
        product !== null &&
        typeof readProperty(product, 'name') === 'string' &&
        typeof readProperty(product, 'productUrl') === 'string',
    )
  );
}

function isErrorCode(value: unknown): value is WardrobeImportErrorCode {
  return [
    'INVALID_URL',
    'UNSAFE_URL',
    'UNSUPPORTED_PROTOCOL',
    'PAGE_NOT_FOUND',
    'ACCESS_DENIED',
    'IMPORT_TIMEOUT',
    'RESPONSE_TOO_LARGE',
    'UNSUPPORTED_CONTENT_TYPE',
    'NO_PRODUCTS_FOUND',
    'RATE_LIMITED',
    'NETWORK_ERROR',
    'SERVICE_UNAVAILABLE',
    'IMPORT_FAILED',
  ].includes(String(value));
}

function logImportStage(stage: string, details: Record<string, string | number>) {
  if (typeof __DEV__ !== 'undefined' && __DEV__) console.info(`[ProductImport] ${stage}`, details);
}

function readProperty(value: unknown, key: string): unknown {
  if (typeof value !== 'object' || value === null || !(key in value)) return undefined;
  return Reflect.get(value, key);
}

function readString(value: unknown, key: string): string {
  const property = readProperty(value, key);
  return typeof property === 'string' ? property : '';
}

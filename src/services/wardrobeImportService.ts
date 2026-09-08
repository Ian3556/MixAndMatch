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

  const result = await getSupabaseClient().functions.invoke<WardrobeImportResponse>(
    'import-wardrobe-url',
    { body: { url: validation.url.toString() } },
  );
  if (result.error) throw await normalizeFunctionError(result.error);
  if (!isImportResponse(result.data)) {
    throw new WardrobeImportClientError(
      'IMPORT_FAILED',
      'The import service returned an invalid response.',
    );
  }
  if (result.data.products.length === 0) {
    throw new WardrobeImportClientError(
      'NO_PRODUCTS_FOUND',
      'No clothing products were found on this page. Try a direct product or collection URL.',
    );
  }
  return result.data;
}

async function normalizeFunctionError(error: unknown): Promise<WardrobeImportClientError> {
  const context = readProperty(error, 'context');
  if (context instanceof Response) {
    try {
      const body = (await context.json()) as Partial<WardrobeImportErrorResponse>;
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
    'IMPORT_FAILED',
  ].includes(String(value));
}

function readProperty(value: unknown, key: string): unknown {
  if (typeof value !== 'object' || value === null || !(key in value)) return undefined;
  return Reflect.get(value, key);
}

function readString(value: unknown, key: string): string {
  const property = readProperty(value, key);
  return typeof property === 'string' ? property : '';
}

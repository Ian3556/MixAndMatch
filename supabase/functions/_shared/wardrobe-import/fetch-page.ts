import { isUnsafeIpAddress, validateImportUrl } from './validate-url';
import type { WardrobeImportErrorCode } from './types';

export const IMPORT_FETCH_TIMEOUT_MS = 12_000;
export const IMPORT_MAX_RESPONSE_BYTES = 3 * 1024 * 1024;
export const IMPORT_MAX_REDIRECTS = 3;

export class WardrobeImportError extends Error {
  constructor(
    readonly code: WardrobeImportErrorCode,
    message: string,
    readonly status = 400,
  ) {
    super(message);
    this.name = 'WardrobeImportError';
  }
}

export type FetchPageDependencies = {
  fetch: typeof fetch;
  resolveHostname: (hostname: string) => Promise<string[]>;
  timeoutMs?: number;
  maxResponseBytes?: number;
  maxRedirects?: number;
  userAgent?: string;
};

export type FetchedHtmlPage = {
  html: string;
  finalUrl: string;
};

export async function fetchHtmlPage(
  inputUrl: string,
  dependencies: FetchPageDependencies,
): Promise<FetchedHtmlPage> {
  const initial = validateImportUrl(inputUrl);
  if (!initial.ok) throw new WardrobeImportError(initial.code, initial.message);

  const maxRedirects = dependencies.maxRedirects ?? IMPORT_MAX_REDIRECTS;
  const timeoutMs = dependencies.timeoutMs ?? IMPORT_FETCH_TIMEOUT_MS;
  const maxResponseBytes = dependencies.maxResponseBytes ?? IMPORT_MAX_RESPONSE_BYTES;
  const deadline = Date.now() + timeoutMs;
  let currentUrl = initial.url;

  for (let redirectCount = 0; redirectCount <= maxRedirects; redirectCount += 1) {
    await assertPublicResolution(currentUrl.hostname, dependencies.resolveHostname);
    const remainingMs = deadline - Date.now();
    if (remainingMs <= 0) {
      throw new WardrobeImportError(
        'IMPORT_TIMEOUT',
        'The retailer took too long to respond. Try again later.',
        504,
      );
    }
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), remainingMs);
    let response: Response;

    try {
      response = await dependencies.fetch(currentUrl, {
        method: 'GET',
        redirect: 'manual',
        signal: controller.signal,
        headers: {
          Accept: 'text/html,application/xhtml+xml;q=0.9',
          'User-Agent': dependencies.userAgent ?? 'MixAndMatchWardrobeImporter/1.0',
        },
      });
    } catch (error) {
      if (isAbortError(error)) {
        throw new WardrobeImportError(
          'IMPORT_TIMEOUT',
          'The retailer took too long to respond. Try again later.',
          504,
        );
      }
      throw new WardrobeImportError(
        'NETWORK_ERROR',
        'We could not reach this retailer page. Check the URL and try again.',
        502,
      );
    } finally {
      clearTimeout(timeout);
    }

    if (isRedirect(response.status)) {
      if (redirectCount === maxRedirects) {
        throw new WardrobeImportError('IMPORT_FAILED', 'This page redirected too many times.', 422);
      }
      const location = response.headers.get('location');
      if (!location) {
        throw new WardrobeImportError(
          'IMPORT_FAILED',
          'The retailer returned an invalid redirect.',
          422,
        );
      }
      const redirect = validateImportUrl(new URL(location, currentUrl).toString());
      if (!redirect.ok) throw new WardrobeImportError(redirect.code, redirect.message);
      currentUrl = redirect.url;
      continue;
    }

    assertHttpStatus(response.status);
    const contentType = response.headers.get('content-type')?.toLowerCase() ?? '';
    if (!contentType.includes('text/html') && !contentType.includes('application/xhtml+xml')) {
      throw new WardrobeImportError(
        'UNSUPPORTED_CONTENT_TYPE',
        'This URL does not return a readable HTML page.',
        415,
      );
    }

    const declaredLength = Number(response.headers.get('content-length'));
    if (Number.isFinite(declaredLength) && declaredLength > maxResponseBytes) {
      throw new WardrobeImportError(
        'RESPONSE_TOO_LARGE',
        'This page is too large to import safely.',
        413,
      );
    }

    return {
      html: await readLimitedText(response, maxResponseBytes),
      finalUrl: currentUrl.toString(),
    };
  }

  throw new WardrobeImportError('IMPORT_FAILED', 'The page could not be imported.', 422);
}

export async function assertPublicResolution(
  hostname: string,
  resolveHostname: FetchPageDependencies['resolveHostname'],
) {
  const addresses = await resolveHostname(hostname);
  if (addresses.length === 0) {
    throw new WardrobeImportError(
      'NETWORK_ERROR',
      'The retailer hostname could not be resolved.',
      502,
    );
  }
  if (addresses.some(isUnsafeIpAddress)) {
    throw new WardrobeImportError(
      'UNSAFE_URL',
      'This URL resolves to a private or local network address.',
      400,
    );
  }
}

async function readLimitedText(response: Response, limit: number): Promise<string> {
  if (!response.body) return '';
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (!value) continue;
    total += value.byteLength;
    if (total > limit) {
      await reader.cancel();
      throw new WardrobeImportError(
        'RESPONSE_TOO_LARGE',
        'This page is too large to import safely.',
        413,
      );
    }
    chunks.push(value);
  }

  const merged = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    merged.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder().decode(merged);
}

function assertHttpStatus(status: number) {
  if (status >= 200 && status < 300) return;
  if (status === 404) {
    throw new WardrobeImportError('PAGE_NOT_FOUND', 'The retailer page was not found.', 404);
  }
  if (status === 401 || status === 403) {
    throw new WardrobeImportError(
      'ACCESS_DENIED',
      'The retailer did not allow this page to be read.',
      422,
    );
  }
  if (status === 429) {
    throw new WardrobeImportError('RATE_LIMITED', 'The retailer is rate limiting requests.', 429);
  }
  throw new WardrobeImportError(
    'IMPORT_FAILED',
    'The retailer returned an unexpected response.',
    502,
  );
}

function isRedirect(status: number): boolean {
  return status >= 300 && status <= 399;
}

function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === 'AbortError';
}

import { extractProductsFromHtml } from '../_shared/wardrobe-import/extract-products.ts';
import { fetchHtmlPage, WardrobeImportError } from '../_shared/wardrobe-import/fetch-page.ts';
import { resolvePublicDns } from '../_shared/wardrobe-import/resolve-public-dns.ts';
import { validateImportUrl } from '../_shared/wardrobe-import/validate-url.ts';
import type {
  WardrobeImportErrorResponse,
  WardrobeImportResponse,
} from '../_shared/wardrobe-import/types.ts';

const corsHeaders = {
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
};
const rateWindows = new Map<string, number[]>();
const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 60_000;

Deno.serve(async (request: Request) => {
  if (request.method === 'OPTIONS')
    return new Response(null, { status: 204, headers: corsHeaders });
  if (request.method !== 'POST') return errorResponse('IMPORT_FAILED', 'Method not allowed.', 405);

  let stage = 'request_started';
  logStage('request_started');
  try {
    const userId = await authenticateRequest(request);
    enforceRateLimit(userId);
    stage = 'request_parsing';
    const rawBody = await request.text();
    if (rawBody.length > 4096) {
      throw new WardrobeImportError('INVALID_URL', 'The request body is too large.', 413);
    }
    const body = JSON.parse(rawBody) as { url?: unknown };
    if (typeof body.url !== 'string') {
      throw new WardrobeImportError('INVALID_URL', 'Enter a public product or collection URL.');
    }

    stage = 'url_validation';
    const validation = validateImportUrl(body.url);
    if (!validation.ok) {
      throw new WardrobeImportError(validation.code, validation.message);
    }
    logStage('url_validated', { domain: validation.url.hostname.toLowerCase() });

    stage = 'page_fetch';
    const page = await fetchHtmlPage(validation.url.toString(), {
      fetch,
      resolveHostname: resolvePublicDns,
    });
    logStage('page_fetched', { domain: new URL(page.finalUrl).hostname.toLowerCase() });
    stage = 'product_extraction';
    const result = extractProductsFromHtml(page.html, page.finalUrl);
    if (result.products.length === 0) {
      throw new WardrobeImportError(
        'NO_PRODUCTS_FOUND',
        'No clothing products were detected on this page.',
        422,
      );
    }

    logStage('product_normalized', { products: result.products.length });
    logStage('request_completed', { products: result.products.length });

    return jsonResponse<WardrobeImportResponse>(result, 200);
  } catch (error) {
    if (error instanceof WardrobeImportError) {
      logStage('failed', { stage, code: error.code });
      return errorResponse(error.code, error.message, error.status);
    }
    if (error instanceof SyntaxError) {
      logStage('failed', { stage, code: 'INVALID_URL' });
      return errorResponse('INVALID_URL', 'The request body is invalid.', 400);
    }
    logStage('failed', { stage, code: 'IMPORT_FAILED' });
    return errorResponse('IMPORT_FAILED', 'The page could not be imported. Try again later.', 500);
  }
});

async function authenticateRequest(request: Request): Promise<string> {
  const authorization = request.headers.get('authorization');
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const publicKey = Deno.env.get('SUPABASE_ANON_KEY') ?? Deno.env.get('SB_PUBLISHABLE_KEY');
  if (!authorization?.startsWith('Bearer ') || !supabaseUrl || !publicKey) {
    throw new WardrobeImportError('ACCESS_DENIED', 'Sign in before importing wardrobe items.', 401);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: { Authorization: authorization, apikey: publicKey },
    signal: controller.signal,
  }).finally(() => clearTimeout(timeout));
  if (!response.ok) {
    throw new WardrobeImportError('ACCESS_DENIED', 'Your session is no longer valid.', 401);
  }
  const user = (await response.json()) as { id?: unknown };
  if (typeof user.id !== 'string') {
    throw new WardrobeImportError('ACCESS_DENIED', 'Your session is no longer valid.', 401);
  }
  return user.id;
}

function enforceRateLimit(userId: string) {
  const now = Date.now();
  const recent = (rateWindows.get(userId) ?? []).filter(
    (timestamp) => now - timestamp < RATE_WINDOW_MS,
  );
  if (recent.length >= RATE_LIMIT) {
    throw new WardrobeImportError(
      'RATE_LIMITED',
      'Too many import attempts. Wait a minute and try again.',
      429,
    );
  }
  recent.push(now);
  rateWindows.set(userId, recent);
}

function errorResponse(code: WardrobeImportErrorResponse['code'], message: string, status: number) {
  return jsonResponse<WardrobeImportErrorResponse>({ code, message }, status);
}

function jsonResponse<T>(body: T, status: number) {
  return new Response(JSON.stringify(body), { status, headers: corsHeaders });
}

function logStage(stage: string, details: Record<string, string | number> = {}) {
  console.info(`[ProductImport] ${stage}`, details);
}

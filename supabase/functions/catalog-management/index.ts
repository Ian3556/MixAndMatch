/// <reference path="../_shared/deno-runtime.d.ts" />

import { GenericStructuredDataAdapter } from '../_shared/catalog/adapters/generic-structured-data.ts';
import { selectNextCatalogJobEntries } from '../_shared/catalog/job-state.ts';
import {
  CatalogManagementRequestError,
  parseCatalogManagementAction,
  type CatalogManagementAction,
  type CatalogProductEditPatch,
} from '../_shared/catalog/management-actions.ts';
import { normalizeHttpUrl } from '../_shared/catalog/normalize.ts';
import {
  persistCatalogProduct,
  type CatalogPersistenceLookup,
} from '../_shared/catalog/persist.ts';
import { processCatalogCandidates } from '../_shared/catalog/pipeline.ts';
import { CatalogRestClient, CatalogRestError } from '../_shared/catalog/rest-client.ts';
import type {
  CatalogJobEntryState,
  CatalogPipelineProduct,
  RawCatalogProductCandidate,
} from '../_shared/catalog/types.ts';
import { fetchHtmlPage, WardrobeImportError } from '../_shared/wardrobe-import/fetch-page.ts';
import { resolvePublicDns } from '../_shared/wardrobe-import/resolve-public-dns.ts';
import { validateImportUrl } from '../_shared/wardrobe-import/validate-url.ts';

const corsHeaders = {
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Origin': '*',
  'Cache-Control': 'no-store',
  'Content-Type': 'application/json; charset=utf-8',
};
const rateWindows = new Map<string, number[]>();
const RATE_LIMIT = 30;
const RATE_WINDOW_MS = 60_000;
const MAX_BODY_BYTES = 32_768;
const MAX_MAINTENANCE_PRODUCTS = 50;

type BrandRow = {
  id: string;
  name: string;
  slug: string;
  enabled: boolean;
  source_status: string;
};

type BrandSourceRow = {
  id: string;
  brand_id: string;
  source_type: 'url';
  status: string;
  allowed_domains: string[];
  entry_urls: string[];
  max_requests: number;
  delay_ms: number;
  concurrency: number;
  timeout_ms: number;
  retry_count: number;
  enabled: boolean;
  robots_reviewed_at: string | null;
  terms_reviewed_at: string | null;
};

type JobRow = {
  id: string;
  brand_id: string;
  brand_source_id: string | null;
  source_type: string;
  status: string;
  operation: 'import' | 'revalidate' | 'reenrich';
  started_at: string | null;
  config_snapshot: Record<string, unknown>;
};

type EntryRow = CatalogJobEntryState & {
  import_job_id: string;
  source_url: string;
  normalized_source_url: string;
  lastAttemptedAt: string | null;
  raw_payload: Record<string, unknown> | null;
  product_id: string | null;
};

type CategoryRow = { id: string; slug: string; parent_id: string | null; level: number };
type StyleTagRow = { id: string; slug: string };
type IdRow = { id: string };

type ProductReviewRow = {
  id: string;
  name: string;
  category_id: string;
  subcategory_id: string | null;
  primary_color: string | null;
  color_family: string | null;
  material_summary: string | null;
  current_price: number | null;
  original_price: number | null;
  currency: string | null;
  price_unavailable: boolean;
  source_url: string;
  source_domain: string;
  validation_errors: string[];
};

class CatalogManagementError extends Error {
  constructor(
    message: string,
    readonly status = 400,
    readonly code = 'CATALOG_MANAGEMENT_ERROR',
  ) {
    super(message);
    this.name = 'CatalogManagementError';
  }
}

Deno.serve(async (request: Request) => {
  if (request.method === 'OPTIONS')
    return new Response(null, { status: 204, headers: corsHeaders });
  if (request.method !== 'POST')
    return errorResponse('METHOD_NOT_ALLOWED', 'Method not allowed.', 405);

  try {
    const environment = readEnvironment();
    const userId = await authenticateCatalogDeveloper(request, environment);
    enforceRateLimit(userId);
    const rawBody = await request.text();
    if (rawBody.length > MAX_BODY_BYTES) {
      throw new CatalogManagementError('The request body is too large.', 413, 'REQUEST_TOO_LARGE');
    }
    const action = parseCatalogManagementAction(JSON.parse(rawBody));
    const client = new CatalogRestClient(environment.supabaseUrl, environment.serviceRoleKey);
    const result = await handleAction(action, userId, client);
    return jsonResponse(result, 200);
  } catch (error) {
    if (error instanceof SyntaxError || error instanceof CatalogManagementRequestError) {
      return errorResponse(
        'INVALID_REQUEST',
        safeMessage(error, 'The request body is invalid.'),
        400,
      );
    }
    if (error instanceof CatalogManagementError) {
      return errorResponse(error.code, error.message, error.status);
    }
    if (error instanceof WardrobeImportError) {
      return errorResponse(error.code, error.message, error.status);
    }
    if (error instanceof CatalogRestError) {
      return errorResponse(
        'CATALOG_DATABASE_ERROR',
        'The catalogue database operation failed. Review the migration and function logs.',
        error.status >= 400 && error.status < 500 ? error.status : 502,
      );
    }
    return errorResponse(
      'CATALOG_MANAGEMENT_ERROR',
      'The catalogue operation failed. Review the function logs and retry safely.',
      500,
    );
  }
});

async function handleAction(
  action: CatalogManagementAction,
  userId: string,
  client: CatalogRestClient,
): Promise<Record<string, unknown>> {
  switch (action.action) {
    case 'start_import':
      return startImport(action, userId, client);
    case 'start_manual_import':
      return startManualImport(action.brandSlug, action.candidates, userId, client);
    case 'continue_import':
      return processJob(action.jobId, client);
    case 'retry_failed': {
      const job = await findJob(action.jobId, client);
      if (['completed', 'stopped'].includes(job.status)) {
        throw new CatalogManagementError('This import job cannot be retried.', 409, 'JOB_TERMINAL');
      }
      await client.update(
        'catalog_import_entries',
        `import_job_id=eq.${action.jobId}&status=eq.failed&retryable=eq.true`,
        { status: 'pending', last_error_code: null, last_error_message: null },
      );
      await client.update('catalog_import_jobs', `id=eq.${action.jobId}`, {
        status: 'paused',
        completed_at: null,
      });
      return processJob(action.jobId, client);
    }
    case 'pause':
      return transitionJob(action.jobId, 'paused', client);
    case 'stop':
      return transitionJob(action.jobId, 'stopped', client, true);
    case 'start_maintenance':
      return startMaintenance(action.brandSlug, action.operation, userId, client);
    case 'start_product_maintenance':
      return startProductMaintenance(action.productId, action.operation, userId, client);
    case 'review_product':
      return reviewProduct(action.productId, action.decision, client);
    case 'edit_product':
      return editProduct(action.productId, action.patch, client);
  }
}

async function startImport(
  action: Extract<CatalogManagementAction, { action: 'start_import' }>,
  userId: string,
  client: CatalogRestClient,
) {
  const brand = await findBrand(action.brandSlug, client);
  const source = await findApprovedSource(brand.id, action.sourceId, client);
  const requestedUrls = action.urls ?? source.entry_urls;
  if (requestedUrls.length === 0) {
    throw new CatalogManagementError(
      'This brand source has no approved entry URLs. Add a controlled URL before importing.',
      409,
      'SOURCE_URLS_REQUIRED',
    );
  }

  const urls = validateSourceUrls(requestedUrls, source).slice(0, source.max_requests);
  const [job] = await client.insert<IdRow>('catalog_import_jobs', {
    brand_id: brand.id,
    brand_source_id: source.id,
    initiated_by: userId,
    source_type: 'url',
    status: 'queued',
    operation: 'import',
    requested_count: urls.length,
    config_snapshot: {
      sourceId: source.id,
      allowedDomains: source.allowed_domains,
      maxRequests: source.max_requests,
      delayMs: source.delay_ms,
      concurrency: 1,
      timeoutMs: source.timeout_ms,
      retryCount: source.retry_count,
    },
  });
  if (!job) throw new CatalogManagementError('The import job could not be created.', 502);

  await client.insert(
    'catalog_import_entries',
    urls.map((url, index) => ({
      import_job_id: job.id,
      sequence_number: index,
      source_url: url,
      normalized_source_url: url,
      max_attempts: source.retry_count + 1,
    })),
  );
  return processJob(job.id, client);
}

async function startManualImport(
  brandSlug: string,
  candidates: RawCatalogProductCandidate[],
  userId: string,
  client: CatalogRestClient,
) {
  const brand = await findBrand(brandSlug, client);
  const [job] = await client.insert<IdRow>('catalog_import_jobs', {
    brand_id: brand.id,
    initiated_by: userId,
    source_type: 'manual',
    status: 'queued',
    operation: 'import',
    requested_count: candidates.length,
    config_snapshot: { manualSeed: true, maxProducts: 50 },
  });
  if (!job) throw new CatalogManagementError('The manual import job could not be created.', 502);
  await client.insert(
    'catalog_import_entries',
    candidates.map((candidate, index) => {
      const sourceUrl = appendManualCheckpoint(candidate.sourceUrl ?? '', index);
      return {
        import_job_id: job.id,
        sequence_number: index,
        source_url: sourceUrl,
        normalized_source_url: sourceUrl,
        max_attempts: 1,
        raw_payload: { candidate },
      };
    }),
  );
  return processJob(job.id, client);
}

async function startMaintenance(
  brandSlug: string,
  operation: 'revalidate' | 'reenrich',
  userId: string,
  client: CatalogRestClient,
) {
  const brand = await findBrand(brandSlug, client);
  const products = await client.select<{ id: string; source_url: string }>(
    'catalog_products',
    `select=id,source_url&brand_id=eq.${brand.id}&status=neq.archived&order=updated_at.asc&limit=${MAX_MAINTENANCE_PRODUCTS}`,
  );
  if (products.length === 0) {
    throw new CatalogManagementError(
      'No catalogue products are available for this operation.',
      409,
    );
  }
  const productIds = products.map((product) => product.id);
  const sources = await client.select<{
    product_id: string;
    source_url: string;
    raw_payload: Record<string, unknown>;
  }>(
    'catalog_product_sources',
    `select=product_id,source_url,raw_payload&product_id=in.(${productIds.join(',')})&order=fetched_at.desc`,
  );
  const firstSourceByProduct = new Map<string, (typeof sources)[number]>();
  sources.forEach((source) => {
    if (!firstSourceByProduct.has(source.product_id))
      firstSourceByProduct.set(source.product_id, source);
  });
  const checkpoints = products.flatMap((product) => {
    const source = firstSourceByProduct.get(product.id);
    const candidate = readRecordProperty(source?.raw_payload, 'candidate');
    if (!source || !candidate) return [];
    const checkpointUrl = appendCheckpointId(source.source_url, product.id);
    return [{ productId: product.id, sourceUrl: checkpointUrl, candidate }];
  });
  if (checkpoints.length === 0) {
    throw new CatalogManagementError(
      'No stored raw product evidence is available. Re-import from an approved source first.',
      409,
      'RAW_EVIDENCE_REQUIRED',
    );
  }

  const [job] = await client.insert<IdRow>('catalog_import_jobs', {
    brand_id: brand.id,
    initiated_by: userId,
    source_type: 'manual',
    status: 'queued',
    operation,
    requested_count: checkpoints.length,
    config_snapshot: { offline: true, evidence: 'catalog_product_sources.raw_payload' },
  });
  if (!job) throw new CatalogManagementError('The maintenance job could not be created.', 502);
  await client.insert(
    'catalog_import_entries',
    checkpoints.map((checkpoint, index) => ({
      import_job_id: job.id,
      sequence_number: index,
      source_url: checkpoint.sourceUrl,
      normalized_source_url: checkpoint.sourceUrl,
      max_attempts: 1,
      raw_payload: { productId: checkpoint.productId, candidate: checkpoint.candidate },
    })),
  );
  return processJob(job.id, client);
}

async function startProductMaintenance(
  productId: string,
  operation: 'revalidate' | 'reenrich',
  userId: string,
  client: CatalogRestClient,
) {
  const [product] = await client.select<{ id: string; brand_id: string }>(
    'catalog_products',
    `select=id,brand_id&id=eq.${productId}&limit=1`,
  );
  if (!product) throw new CatalogManagementError('The catalogue product was not found.', 404);
  const [source] = await client.select<{
    source_url: string;
    raw_payload: Record<string, unknown>;
  }>(
    'catalog_product_sources',
    `select=source_url,raw_payload&product_id=eq.${productId}&order=fetched_at.desc&limit=1`,
  );
  const candidate = readRecordProperty(source?.raw_payload, 'candidate');
  if (!source || !candidate) {
    throw new CatalogManagementError(
      'No stored raw evidence is available for this product.',
      409,
      'RAW_EVIDENCE_REQUIRED',
    );
  }
  const [job] = await client.insert<IdRow>('catalog_import_jobs', {
    brand_id: product.brand_id,
    initiated_by: userId,
    source_type: 'manual',
    status: 'queued',
    operation,
    requested_count: 1,
    config_snapshot: { offline: true, productId },
  });
  if (!job) throw new CatalogManagementError('The maintenance job could not be created.', 502);
  const checkpointUrl = appendCheckpointId(source.source_url, productId);
  await client.insert('catalog_import_entries', {
    import_job_id: job.id,
    sequence_number: 0,
    source_url: checkpointUrl,
    normalized_source_url: checkpointUrl,
    max_attempts: 1,
    raw_payload: { productId, candidate },
  });
  return processJob(job.id, client);
}

async function processJob(jobId: string, client: CatalogRestClient) {
  const job = await findJob(jobId, client);
  if (['completed', 'completed_with_errors', 'failed', 'stopped'].includes(job.status)) {
    return { jobId, status: job.status, message: 'This job is already terminal.' };
  }
  const entries = await listJobEntries(jobId, client);
  const retryAfterMs = getRetryDelayMs(job, entries);
  if (retryAfterMs > 0) {
    return {
      jobId,
      status: job.status,
      retryAfterMs,
      message: 'The approved source delay is still active. Retry after the reported interval.',
    };
  }
  const startedAt = job.started_at ?? new Date().toISOString();
  await client.update('catalog_import_jobs', `id=eq.${jobId}`, {
    status: 'running',
    started_at: startedAt,
    completed_at: null,
  });

  const [entry] = selectNextCatalogJobEntries(entries, 1);
  if (!entry) return finalizeJob(job, entries, client);

  const attempts = entry.attemptCount + 1;
  await client.update('catalog_import_entries', `id=eq.${entry.id}`, {
    status: 'processing',
    attempt_count: attempts,
    last_attempted_at: new Date().toISOString(),
  });

  try {
    const outcome = await processEntry(job, entry, client);
    await client.update('catalog_import_entries', `id=eq.${entry.id}`, {
      status:
        outcome.summary.imported === 0 && outcome.summary.duplicates > 0
          ? 'duplicate'
          : 'completed',
      product_id: outcome.productId,
      raw_payload: {
        ...(entry.raw_payload ?? {}),
        summary: outcome.summary,
        rejectedEvidence: outcome.rejectedEvidence,
      },
      warnings: outcome.warnings,
      retryable: false,
      last_error_code: null,
      last_error_message: null,
      completed_at: new Date().toISOString(),
    });
  } catch (error) {
    const failure = normalizeEntryError(error, attempts, entry.maxAttempts);
    await client.update('catalog_import_entries', `id=eq.${entry.id}`, {
      status: 'failed',
      retryable: failure.retryable,
      last_error_code: failure.code,
      last_error_message: failure.message,
      completed_at: failure.retryable ? null : new Date().toISOString(),
      raw_payload: {
        ...(entry.raw_payload ?? {}),
        summary: {
          discovered: 0,
          imported: 0,
          validated: 0,
          rejected: 0,
          duplicates: 0,
          failed: 1,
        },
      },
    });
    await client.insert('catalog_import_errors', {
      import_job_id: job.id,
      import_entry_id: entry.id,
      product_url: entry.source_url,
      error_type: failure.code,
      message: failure.message,
      retryable: failure.retryable,
    });
  }

  return finalizeJob(job, await listJobEntries(jobId, client), client);
}

async function processEntry(job: JobRow, entry: EntryRow, client: CatalogRestClient) {
  const [brand] = await client.select<BrandRow>(
    'catalog_brands',
    `select=id,name,slug,enabled,source_status&id=eq.${job.brand_id}&limit=1`,
  );
  if (!brand) throw new CatalogManagementError('The import brand no longer exists.', 409);
  const lookup = await loadPersistenceLookup(client);
  let candidates: RawCatalogProductCandidate[];
  let contentHash: string | null = null;
  const fetchedAt = new Date().toISOString();
  let targetProductId: string | undefined;

  if (job.operation === 'import' && job.source_type === 'url') {
    const source = await findSourceById(job.brand_source_id, client);
    const page = await fetchHtmlPage(entry.source_url, {
      fetch,
      resolveHostname: resolvePublicDns,
      timeoutMs: source.timeout_ms,
      userAgent: 'MixAndMatchCatalogImporter/1.0',
    });
    ensureAllowedDomain(page.finalUrl, source.allowed_domains);
    const adapter = new GenericStructuredDataAdapter();
    candidates = await adapter.extract({
      sourceType: 'url',
      brandSlug: brand.slug,
      url: page.finalUrl,
      html: page.html,
    });
    contentHash = await hashText(page.html);
  } else {
    const candidate = readRecordProperty(entry.raw_payload, 'candidate');
    const productId = readStringProperty(entry.raw_payload, 'productId');
    if (!candidate || (job.operation !== 'import' && !productId)) {
      throw new CatalogManagementError(
        'The maintenance checkpoint has no reusable raw evidence.',
        409,
      );
    }
    candidates = [candidate as RawCatalogProductCandidate];
    targetProductId = productId || undefined;
  }

  if (candidates.length === 0) {
    throw new WardrobeImportError(
      'NO_PRODUCTS_FOUND',
      'No products were detected in this source.',
      422,
    );
  }
  const batch = processCatalogCandidates(candidates, {
    brandSlug: brand.slug,
    expectedBrandName: brand.name,
  });
  const persisted: { productId: string; duplicate: boolean; product: CatalogPipelineProduct }[] =
    [];
  const rejectedEvidence: { candidate: RawCatalogProductCandidate; errors: string[] }[] = [];
  for (const product of batch.products) {
    const rawCandidate = candidates[product.sourceCandidateIndex] ?? candidates[0];
    if (!rawCandidate) continue;
    if (product.validation.decision === 'rejected') {
      await client.insert('catalog_import_errors', {
        import_job_id: job.id,
        import_entry_id: entry.id,
        product_url: product.sourceUrl || entry.source_url,
        error_type: 'PRODUCT_REJECTED',
        message: product.validation.errors.join(', ').slice(0, 5000),
        retryable: false,
      });
      if (!canPersistRejectedProduct(product)) {
        rejectedEvidence.push({ candidate: rawCandidate, errors: product.validation.errors });
        continue;
      }
    }
    const result = await persistCatalogProduct(client, product, lookup, {
      brandId: brand.id,
      rawCandidate,
      fetchedAt,
      contentHash,
      targetProductId,
    });
    persisted.push({ ...result, product });
  }
  const rejectedCount = batch.products.filter(
    (product) => product.validation.decision === 'rejected',
  ).length;
  if (persisted.length === 0 && rejectedCount === 0)
    throw new CatalogManagementError('No normalized products were persisted.', 422);

  return {
    productId: persisted[0]?.productId ?? null,
    warnings: unique(
      batch.products.flatMap((product) => [
        ...product.validation.warnings,
        ...product.validation.errors,
      ]),
    ),
    rejectedEvidence: rejectedEvidence.slice(0, 20),
    summary: {
      discovered: candidates.length,
      imported:
        job.operation === 'import'
          ? persisted.filter((item) => !item.duplicate).length
          : persisted.length,
      validated: persisted.filter((item) => item.product.validation.decision === 'validated')
        .length,
      rejected: rejectedCount,
      duplicates: batch.duplicates.length + persisted.filter((item) => item.duplicate).length,
      failed: 0,
    },
  };
}

function canPersistRejectedProduct(product: CatalogPipelineProduct): boolean {
  return Boolean(
    product.name &&
    product.sourceUrl &&
    product.canonicalUrl &&
    product.sourceDomain &&
    product.deduplicationKey,
  );
}

async function finalizeJob(job: JobRow, entries: EntryRow[], client: CatalogRestClient) {
  const counters = entries.reduce(
    (totals, entry) => {
      const summary = readRecordProperty(entry.raw_payload, 'summary');
      totals.discovered += readNumberProperty(summary, 'discovered');
      totals.imported += readNumberProperty(summary, 'imported');
      totals.validated += readNumberProperty(summary, 'validated');
      totals.rejected += readNumberProperty(summary, 'rejected');
      totals.duplicates += readNumberProperty(summary, 'duplicates');
      totals.failed += readNumberProperty(summary, 'failed');
      return totals;
    },
    { discovered: 0, imported: 0, validated: 0, rejected: 0, duplicates: 0, failed: 0 },
  );
  const hasPending = entries.some(
    (entry) =>
      entry.status === 'pending' ||
      entry.status === 'processing' ||
      (entry.status === 'failed' && entry.retryable && entry.attemptCount < entry.maxAttempts),
  );
  const status = hasPending
    ? 'paused'
    : counters.failed > 0
      ? 'completed_with_errors'
      : 'completed';
  const completedAt = hasPending ? null : new Date().toISOString();
  await client.update('catalog_import_jobs', `id=eq.${job.id}`, {
    status,
    discovered_count: counters.discovered,
    imported_count: counters.imported,
    validated_count: counters.validated,
    rejected_count: counters.rejected,
    duplicate_count: counters.duplicates,
    failed_count: counters.failed,
    completed_at: completedAt,
    error_summary: counters.failed > 0 ? `${counters.failed} checkpoint(s) failed.` : null,
  });
  return { jobId: job.id, status, counters, remaining: hasPending };
}

async function reviewProduct(
  productId: string,
  decision: 'approve' | 'reject',
  client: CatalogRestClient,
) {
  if (decision === 'reject') {
    const rows = await client.update<IdRow>('catalog_products', `id=eq.${productId}&select=id`, {
      status: 'rejected',
    });
    if (!rows[0]) throw new CatalogManagementError('The catalogue product was not found.', 404);
    return { productId, status: 'rejected' };
  }

  const product = await findReviewProduct(productId, client);
  const errors = await validateStoredProduct(product, client);
  if (errors.length > 0) {
    await client.update('catalog_products', `id=eq.${productId}`, {
      status: 'needs_review',
      validation_errors: errors,
    });
    throw new CatalogManagementError(
      `Resolve these required fields before approval: ${errors.join(', ')}.`,
      409,
      'PRODUCT_STILL_INVALID',
    );
  }
  await Promise.all([
    client.update('catalog_products', `id=eq.${productId}`, {
      status: 'validated',
      validation_errors: [],
    }),
    client.update('catalog_product_style_profiles', `product_id=eq.${productId}`, {
      reviewed: true,
    }),
  ]);
  return { productId, status: 'validated' };
}

async function editProduct(
  productId: string,
  patch: CatalogProductEditPatch,
  client: CatalogRestClient,
) {
  const product = await findReviewProduct(productId, client);
  const databasePatch: Record<string, unknown> = {};
  if (patch.name !== undefined) databasePatch.name = patch.name.trim().slice(0, 220);
  if (patch.primaryColor !== undefined)
    databasePatch.primary_color = normalizeNullable(patch.primaryColor, 100);
  if (patch.colorFamily !== undefined)
    databasePatch.color_family = normalizeNullable(patch.colorFamily, 100);
  if (patch.materialSummary !== undefined)
    databasePatch.material_summary = normalizeNullable(patch.materialSummary, 1000);
  if (patch.currentPrice !== undefined) databasePatch.current_price = patch.currentPrice;
  if (patch.originalPrice !== undefined) databasePatch.original_price = patch.originalPrice;
  if (patch.currency !== undefined)
    databasePatch.currency = patch.currency?.trim().toUpperCase() || null;
  if (patch.priceUnavailable !== undefined)
    databasePatch.price_unavailable = patch.priceUnavailable;

  if (patch.categorySlug !== undefined || patch.subcategorySlug !== undefined) {
    const categories = await loadCategories(client);
    const currentCategory = categories.find((category) => category.id === product.category_id);
    const category = patch.categorySlug
      ? categories.find(
          (candidate) => candidate.slug === patch.categorySlug && candidate.level === 1,
        )
      : currentCategory;
    if (!category) throw new CatalogManagementError('The selected category does not exist.', 400);
    databasePatch.category_id = category.id;
    if (patch.subcategorySlug === null) databasePatch.subcategory_id = null;
    else if (patch.subcategorySlug !== undefined) {
      const subcategory = categories.find(
        (candidate) =>
          candidate.slug === patch.subcategorySlug && candidate.parent_id === category.id,
      );
      if (!subcategory) {
        throw new CatalogManagementError(
          'The selected subcategory does not belong to the category.',
          400,
        );
      }
      databasePatch.subcategory_id = subcategory.id;
    }
  }
  databasePatch.status = 'needs_review';
  const [updated] = await client.update<ProductReviewRow>(
    'catalog_products',
    `id=eq.${productId}&select=id,name,category_id,subcategory_id,primary_color,color_family,material_summary,current_price,original_price,currency,price_unavailable,source_url,source_domain,validation_errors`,
    databasePatch,
  );
  if (!updated) throw new CatalogManagementError('The catalogue product was not found.', 404);
  const errors = await validateStoredProduct(updated, client);
  await client.update('catalog_products', `id=eq.${productId}`, { validation_errors: errors });
  return { productId, status: 'needs_review', validationErrors: errors };
}

async function validateStoredProduct(product: ProductReviewRow, client: CatalogRestClient) {
  const errors: string[] = [];
  if (!product.name.trim()) errors.push('missing_product_name');
  if (!product.primary_color || !product.color_family) errors.push('missing_color_family');
  if (product.current_price === null && !product.price_unavailable)
    errors.push('missing_price_state');
  if (product.current_price !== null && !product.currency) errors.push('missing_currency');
  if (!product.source_url || !product.source_domain) errors.push('invalid_source_url');
  const [images, profiles, tags] = await Promise.all([
    client.select<IdRow>('catalog_product_images', `select=id&product_id=eq.${product.id}&limit=1`),
    client.select<{ product_id: string }>(
      'catalog_product_style_profiles',
      `select=product_id&product_id=eq.${product.id}&limit=1`,
    ),
    client.select<{ product_id: string }>(
      'catalog_product_style_tags',
      `select=product_id&product_id=eq.${product.id}&limit=1`,
    ),
  ]);
  if (images.length === 0) errors.push('missing_image');
  if (profiles.length === 0 || tags.length === 0) errors.push('missing_style_classification');
  return unique(errors);
}

async function transitionJob(
  jobId: string,
  status: 'paused' | 'stopped',
  client: CatalogRestClient,
  terminal = false,
) {
  const job = await findJob(jobId, client);
  if (['completed', 'completed_with_errors', 'failed', 'stopped'].includes(job.status)) {
    throw new CatalogManagementError('This import job is already terminal.', 409, 'JOB_TERMINAL');
  }
  const rows = await client.update<IdRow>('catalog_import_jobs', `id=eq.${jobId}&select=id`, {
    status,
    completed_at: terminal ? new Date().toISOString() : null,
  });
  if (!rows[0]) throw new CatalogManagementError('The import job was not found.', 404);
  return { jobId, status };
}

async function findBrand(slug: string, client: CatalogRestClient): Promise<BrandRow> {
  const [brand] = await client.select<BrandRow>(
    'catalog_brands',
    `select=id,name,slug,enabled,source_status&slug=eq.${encodeURIComponent(slug)}&limit=1`,
  );
  if (!brand || !brand.enabled)
    throw new CatalogManagementError('The catalogue brand is not enabled.', 404);
  return brand;
}

async function findApprovedSource(
  brandId: string,
  sourceId: string | undefined,
  client: CatalogRestClient,
): Promise<BrandSourceRow> {
  const filter = sourceId ? `id=eq.${sourceId}&source_type=eq.url` : 'source_type=eq.url';
  const [source] = await client.select<BrandSourceRow>(
    'catalog_brand_sources',
    `select=id,brand_id,source_type,status,allowed_domains,entry_urls,max_requests,delay_ms,concurrency,timeout_ms,retry_count,enabled,robots_reviewed_at,terms_reviewed_at&brand_id=eq.${brandId}&enabled=eq.true&${filter}&limit=1`,
  );
  if (!source || !['ready', 'supported', 'partially_supported'].includes(source.status)) {
    throw new CatalogManagementError(
      'No enabled and approved URL source exists for this brand.',
      409,
      'SOURCE_NOT_APPROVED',
    );
  }
  if (!source.robots_reviewed_at || !source.terms_reviewed_at) {
    throw new CatalogManagementError(
      'Record the source terms and robots review before enabling imports.',
      409,
      'SOURCE_REVIEW_REQUIRED',
    );
  }
  if (source.allowed_domains.length === 0) {
    throw new CatalogManagementError(
      'The source domain allowlist is empty.',
      409,
      'SOURCE_ALLOWLIST_REQUIRED',
    );
  }
  return source;
}

async function findSourceById(sourceId: string | null, client: CatalogRestClient) {
  if (!sourceId)
    throw new CatalogManagementError('The import job has no source configuration.', 409);
  const [source] = await client.select<BrandSourceRow>(
    'catalog_brand_sources',
    `select=id,brand_id,source_type,status,allowed_domains,entry_urls,max_requests,delay_ms,concurrency,timeout_ms,retry_count,enabled,robots_reviewed_at,terms_reviewed_at&id=eq.${sourceId}&limit=1`,
  );
  if (
    !source ||
    !source.enabled ||
    !['ready', 'supported', 'partially_supported'].includes(source.status)
  )
    throw new CatalogManagementError('The import source is disabled.', 409);
  if (
    !source.robots_reviewed_at ||
    !source.terms_reviewed_at ||
    source.allowed_domains.length === 0
  ) {
    throw new CatalogManagementError(
      'The import source no longer has complete governance approval.',
      409,
      'SOURCE_REVIEW_REQUIRED',
    );
  }
  return source;
}

async function findJob(jobId: string, client: CatalogRestClient): Promise<JobRow> {
  const [job] = await client.select<JobRow>(
    'catalog_import_jobs',
    `select=id,brand_id,brand_source_id,source_type,status,operation,started_at,config_snapshot&id=eq.${jobId}&limit=1`,
  );
  if (!job) throw new CatalogManagementError('The import job was not found.', 404);
  return job;
}

async function listJobEntries(jobId: string, client: CatalogRestClient): Promise<EntryRow[]> {
  const rows = await client.select<{
    id: string;
    import_job_id: string;
    source_url: string;
    normalized_source_url: string;
    sequence_number: number;
    status: EntryRow['status'];
    attempt_count: number;
    max_attempts: number;
    retryable: boolean;
    last_attempted_at: string | null;
    raw_payload: Record<string, unknown> | null;
    product_id: string | null;
  }>(
    'catalog_import_entries',
    `select=id,import_job_id,source_url,normalized_source_url,sequence_number,status,attempt_count,max_attempts,retryable,last_attempted_at,raw_payload,product_id&import_job_id=eq.${jobId}&order=sequence_number.asc`,
  );
  return rows.map((row) => ({
    id: row.id,
    import_job_id: row.import_job_id,
    source_url: row.source_url,
    normalized_source_url: row.normalized_source_url,
    sequenceNumber: row.sequence_number,
    status: row.status,
    attemptCount: row.attempt_count,
    maxAttempts: row.max_attempts,
    retryable: row.retryable,
    lastAttemptedAt: row.last_attempted_at,
    raw_payload: row.raw_payload,
    product_id: row.product_id,
  }));
}

function getRetryDelayMs(job: JobRow, entries: EntryRow[]): number {
  if (job.source_type !== 'url') return 0;
  const configuredDelay = readNumberProperty(job.config_snapshot, 'delayMs');
  if (configuredDelay <= 0) return 0;
  const lastAttemptedAt = entries.reduce((latest, entry) => {
    if (!entry.lastAttemptedAt) return latest;
    const timestamp = Date.parse(entry.lastAttemptedAt);
    return Number.isFinite(timestamp) ? Math.max(latest, timestamp) : latest;
  }, 0);
  return Math.max(0, Math.ceil(configuredDelay - (Date.now() - lastAttemptedAt)));
}

async function findReviewProduct(productId: string, client: CatalogRestClient) {
  const [product] = await client.select<ProductReviewRow>(
    'catalog_products',
    `select=id,name,category_id,subcategory_id,primary_color,color_family,material_summary,current_price,original_price,currency,price_unavailable,source_url,source_domain,validation_errors&id=eq.${productId}&limit=1`,
  );
  if (!product) throw new CatalogManagementError('The catalogue product was not found.', 404);
  return product;
}

async function loadPersistenceLookup(client: CatalogRestClient): Promise<CatalogPersistenceLookup> {
  const [categories, styleTags] = await Promise.all([
    loadCategories(client),
    client.select<StyleTagRow>('catalog_style_tags', 'select=id,slug'),
  ]);
  return {
    categoryIds: new Map(categories.map((category) => [category.slug, category.id])),
    styleTagIds: new Map(styleTags.map((tag) => [tag.slug, tag.id])),
  };
}

function loadCategories(client: CatalogRestClient) {
  return client.select<CategoryRow>('catalog_categories', 'select=id,slug,parent_id,level');
}

function validateSourceUrls(urls: string[], source: BrandSourceRow): string[] {
  const normalized = urls.map((value) => {
    const validation = validateImportUrl(value);
    if (!validation.ok) throw new CatalogManagementError(validation.message, 400, validation.code);
    ensureAllowedDomain(validation.url.toString(), source.allowed_domains);
    return (
      normalizeHttpUrl(validation.url.toString(), undefined, true) ?? validation.url.toString()
    );
  });
  return unique(normalized);
}

function ensureAllowedDomain(value: string, allowedDomains: string[]) {
  const validation = validateImportUrl(value);
  if (!validation.ok) throw new CatalogManagementError(validation.message, 400, validation.code);
  const hostname = validation.url.hostname.toLowerCase().replace(/^www\./, '');
  const allowed = allowedDomains.some((domain) => {
    const normalized = domain
      .toLowerCase()
      .replace(/^www\./, '')
      .replace(/^\./, '');
    return hostname === normalized || hostname.endsWith(`.${normalized}`);
  });
  if (!allowed) {
    throw new CatalogManagementError(
      'This URL is outside the approved domain allowlist.',
      400,
      'SOURCE_DOMAIN_NOT_ALLOWED',
    );
  }
}

function normalizeEntryError(error: unknown, attempts: number, maxAttempts: number) {
  if (error instanceof WardrobeImportError) {
    const retryableCode = [
      'IMPORT_TIMEOUT',
      'NETWORK_ERROR',
      'RATE_LIMITED',
      'IMPORT_FAILED',
    ].includes(error.code);
    return {
      code: error.code,
      message: error.message,
      retryable: retryableCode && attempts < maxAttempts,
    };
  }
  if (error instanceof CatalogManagementError || error instanceof CatalogRestError) {
    return {
      code: error instanceof CatalogManagementError ? error.code : 'CATALOG_DATABASE_ERROR',
      message: safeMessage(error, 'The catalogue checkpoint failed.'),
      retryable: error instanceof CatalogRestError && error.status >= 500 && attempts < maxAttempts,
    };
  }
  return { code: 'IMPORT_FAILED', message: 'The catalogue checkpoint failed.', retryable: false };
}

async function authenticateCatalogDeveloper(
  request: Request,
  environment: ReturnType<typeof readEnvironment>,
): Promise<string> {
  const authorization = request.headers.get('authorization');
  if (!authorization?.startsWith('Bearer ')) {
    throw new CatalogManagementError('Sign in before using catalogue tools.', 401, 'ACCESS_DENIED');
  }
  const headers = { Authorization: authorization, apikey: environment.publicKey };
  const userResponse = await fetchWithTimeout(
    `${environment.supabaseUrl}/auth/v1/user`,
    { headers },
    5000,
  );
  if (!userResponse.ok)
    throw new CatalogManagementError('Your session is no longer valid.', 401, 'ACCESS_DENIED');
  const user = (await userResponse.json()) as { id?: unknown };
  if (typeof user.id !== 'string') {
    throw new CatalogManagementError('Your session is no longer valid.', 401, 'ACCESS_DENIED');
  }

  const developerResponse = await fetchWithTimeout(
    `${environment.supabaseUrl}/rest/v1/rpc/is_catalog_developer`,
    {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: '{}',
    },
    5000,
  );
  const isDeveloper = developerResponse.ok ? await developerResponse.json() : false;
  if (isDeveloper !== true) {
    throw new CatalogManagementError(
      'Catalogue developer access is required.',
      403,
      'ACCESS_DENIED',
    );
  }
  return user.id;
}

function readEnvironment() {
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const publicKey = Deno.env.get('SUPABASE_ANON_KEY') ?? Deno.env.get('SB_PUBLISHABLE_KEY');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!supabaseUrl || !publicKey || !serviceRoleKey) {
    throw new CatalogManagementError(
      'The catalogue function is not configured.',
      503,
      'FUNCTION_NOT_CONFIGURED',
    );
  }
  return { supabaseUrl, publicKey, serviceRoleKey };
}

function enforceRateLimit(userId: string) {
  const now = Date.now();
  const recent = (rateWindows.get(userId) ?? []).filter(
    (timestamp) => now - timestamp < RATE_WINDOW_MS,
  );
  if (recent.length >= RATE_LIMIT) {
    throw new CatalogManagementError(
      'Too many catalogue operations. Wait a minute and retry.',
      429,
      'RATE_LIMITED',
    );
  }
  recent.push(now);
  rateWindows.set(userId, recent);
}

async function fetchWithTimeout(url: string, init: RequestInit, timeoutMs: number) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

async function hashText(value: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

function appendCheckpointId(sourceUrl: string, productId: string): string {
  const url = new URL(sourceUrl);
  url.searchParams.set('mm_catalog_product_id', productId);
  return url.toString();
}

function appendManualCheckpoint(sourceUrl: string, index: number): string {
  const url = new URL(sourceUrl);
  url.searchParams.set('mm_manual_candidate', String(index));
  return url.toString();
}

function normalizeNullable(value: string | null, maxLength: number): string | null {
  const normalized = value?.trim();
  return normalized ? normalized.slice(0, maxLength) : null;
}

function readRecordProperty(value: unknown, key: string): Record<string, unknown> | null {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return null;
  const property = Reflect.get(value, key);
  return typeof property === 'object' && property !== null && !Array.isArray(property)
    ? (property as Record<string, unknown>)
    : null;
}

function readStringProperty(value: unknown, key: string): string {
  if (typeof value !== 'object' || value === null) return '';
  const property = Reflect.get(value, key);
  return typeof property === 'string' ? property : '';
}

function readNumberProperty(value: unknown, key: string): number {
  if (typeof value !== 'object' || value === null) return 0;
  const property = Reflect.get(value, key);
  return typeof property === 'number' && Number.isFinite(property) ? property : 0;
}

function safeMessage(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback;
}

function unique<T>(values: T[]): T[] {
  return [...new Set(values)];
}

function errorResponse(code: string, message: string, status: number) {
  return jsonResponse({ code, message }, status);
}

function jsonResponse(body: unknown, status: number) {
  return new Response(JSON.stringify(body), { status, headers: corsHeaders });
}

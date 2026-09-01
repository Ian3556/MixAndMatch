import type { CatalogManagementAction } from '@supabase/functions/_shared/catalog/management-actions';
import { getSupabaseClient } from '@supabase';

import type { CatalogDashboardData } from '@/catalog/types';
import type { CatalogJson } from '@/types/catalogDatabase';

export class CatalogAdminServiceError extends Error {
  constructor(
    readonly code: 'access-denied' | 'not-configured' | 'network' | 'invalid-response' | 'unknown',
    message: string,
    readonly cause?: unknown,
  ) {
    super(message);
    this.name = 'CatalogAdminServiceError';
  }
}

export async function loadCatalogDashboard(
  errorJobId: string | null,
): Promise<CatalogDashboardData> {
  const client = getSupabaseClient();
  const membership = await client.rpc('is_catalog_developer');
  if (membership.error) throw normalizeCatalogAdminError(membership.error);
  if (membership.data !== true) {
    throw new CatalogAdminServiceError(
      'access-denied',
      'This account is not in the server-managed catalogue developer allowlist.',
    );
  }

  const [overview, brands, reviewQueue, recentJobs, importErrors] = await Promise.all([
    client.rpc('catalog_admin_overview'),
    client.rpc('catalog_admin_brand_progress'),
    client.rpc('catalog_admin_review_queue', { p_limit: 50 }),
    client.rpc('catalog_admin_recent_jobs', { p_limit: 25 }),
    client.rpc('catalog_admin_import_errors', { p_job_id: errorJobId, p_limit: 50 }),
  ]);
  const error =
    overview.error ?? brands.error ?? reviewQueue.error ?? recentJobs.error ?? importErrors.error;
  if (error) throw normalizeCatalogAdminError(error);
  const overviewRow = overview.data?.[0];
  if (!overviewRow) {
    throw new CatalogAdminServiceError(
      'invalid-response',
      'The catalogue overview function returned no data.',
    );
  }

  return {
    overview: overviewRow,
    brands: (brands.data ?? []).map((brand) => ({
      ...brand,
      category_targets: toNumberRecord(brand.category_targets),
      category_distribution: toNumberRecord(brand.category_distribution),
    })),
    reviewQueue: reviewQueue.data ?? [],
    recentJobs: recentJobs.data ?? [],
    importErrors: importErrors.data ?? [],
  };
}

export async function invokeCatalogManagement(
  action: CatalogManagementAction,
): Promise<Record<string, unknown>> {
  const client = getSupabaseClient();
  const result = await client.functions.invoke('catalog-management', { body: action });
  if (result.error) throw await normalizeFunctionError(result.error);
  if (typeof result.data !== 'object' || result.data === null || Array.isArray(result.data)) {
    throw new CatalogAdminServiceError(
      'invalid-response',
      'The catalogue management function returned an invalid response.',
    );
  }
  return result.data as Record<string, unknown>;
}

async function normalizeFunctionError(error: unknown): Promise<CatalogAdminServiceError> {
  const context = readProperty(error, 'context');
  if (context instanceof Response) {
    try {
      const body = (await context.json()) as { code?: unknown; message?: unknown };
      if (typeof body.message === 'string') {
        return new CatalogAdminServiceError(
          body.code === 'ACCESS_DENIED' ? 'access-denied' : 'unknown',
          body.message,
          error,
        );
      }
    } catch {
      // Fall through to safe generic mapping.
    }
  }
  return normalizeCatalogAdminError(error);
}

function normalizeCatalogAdminError(error: unknown): CatalogAdminServiceError {
  const code = readString(error, 'code');
  const message = readString(error, 'message').toLowerCase();
  if (code === '42501' || code === 'PGRST301' || message.includes('developer access')) {
    return new CatalogAdminServiceError(
      'access-denied',
      'This account cannot access catalogue developer operations.',
      error,
    );
  }
  if (code === 'PGRST202' || code === 'PGRST205' || message.includes('schema cache')) {
    return new CatalogAdminServiceError(
      'not-configured',
      'Apply the catalogue migration and refresh the Supabase schema before opening this dashboard.',
      error,
    );
  }
  if (error instanceof TypeError || message.includes('network') || message.includes('fetch')) {
    return new CatalogAdminServiceError(
      'network',
      'The catalogue service could not be reached. Check Supabase connectivity and retry.',
      error,
    );
  }
  return new CatalogAdminServiceError(
    'unknown',
    readString(error, 'message') || 'The catalogue operation failed.',
    error,
  );
}

function toNumberRecord(value: CatalogJson): Record<string, number> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return {};
  return Object.fromEntries(
    Object.entries(value).flatMap(([key, item]) =>
      typeof item === 'number' && Number.isFinite(item) ? [[key, item]] : [],
    ),
  );
}

function readProperty(value: unknown, key: string): unknown {
  if (typeof value !== 'object' || value === null || !(key in value)) return undefined;
  return Reflect.get(value, key);
}

function readString(value: unknown, key: string): string {
  const property = readProperty(value, key);
  return typeof property === 'string' ? property : '';
}

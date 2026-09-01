import type { RawCatalogProductCandidate } from './types';

export type CatalogProductEditPatch = {
  name?: string | undefined;
  categorySlug?: string | undefined;
  subcategorySlug?: string | null | undefined;
  primaryColor?: string | null | undefined;
  colorFamily?: string | null | undefined;
  materialSummary?: string | null | undefined;
  currentPrice?: number | null | undefined;
  originalPrice?: number | null | undefined;
  currency?: string | null | undefined;
  priceUnavailable?: boolean | undefined;
};

export type CatalogManagementAction =
  | {
      action: 'start_import';
      brandSlug: string;
      sourceId?: string | undefined;
      urls?: string[] | undefined;
    }
  | { action: 'start_manual_import'; brandSlug: string; candidates: RawCatalogProductCandidate[] }
  | { action: 'continue_import'; jobId: string }
  | { action: 'retry_failed'; jobId: string }
  | { action: 'pause'; jobId: string }
  | { action: 'stop'; jobId: string }
  | { action: 'start_maintenance'; brandSlug: string; operation: 'revalidate' | 'reenrich' }
  | { action: 'start_product_maintenance'; productId: string; operation: 'revalidate' | 'reenrich' }
  | { action: 'review_product'; productId: string; decision: 'approve' | 'reject' }
  | { action: 'edit_product'; productId: string; patch: CatalogProductEditPatch };

export class CatalogManagementRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CatalogManagementRequestError';
  }
}

export function parseCatalogManagementAction(value: unknown): CatalogManagementAction {
  const body = readRecord(value);
  const action = readString(body.action, 'action');
  switch (action) {
    case 'start_import': {
      const urls = readOptionalStringArray(body.urls, 'urls', 50);
      const sourceId = readOptionalUuid(body.sourceId, 'sourceId');
      return compact({
        action,
        brandSlug: readSlug(body.brandSlug),
        sourceId,
        urls,
      });
    }
    case 'start_manual_import':
      return {
        action,
        brandSlug: readSlug(body.brandSlug),
        candidates: readManualCandidates(body.candidates),
      };
    case 'continue_import':
    case 'retry_failed':
    case 'pause':
    case 'stop':
      return { action, jobId: readUuid(body.jobId, 'jobId') };
    case 'start_maintenance': {
      const operation = readString(body.operation, 'operation');
      if (operation !== 'revalidate' && operation !== 'reenrich') {
        throw new CatalogManagementRequestError('operation must be revalidate or reenrich.');
      }
      return { action, brandSlug: readSlug(body.brandSlug), operation };
    }
    case 'start_product_maintenance': {
      const operation = readString(body.operation, 'operation');
      if (operation !== 'revalidate' && operation !== 'reenrich') {
        throw new CatalogManagementRequestError('operation must be revalidate or reenrich.');
      }
      return { action, productId: readUuid(body.productId, 'productId'), operation };
    }
    case 'review_product': {
      const decision = readString(body.decision, 'decision');
      if (decision !== 'approve' && decision !== 'reject') {
        throw new CatalogManagementRequestError('decision must be approve or reject.');
      }
      return { action, productId: readUuid(body.productId, 'productId'), decision };
    }
    case 'edit_product':
      return {
        action,
        productId: readUuid(body.productId, 'productId'),
        patch: parsePatch(body.patch),
      };
    default:
      throw new CatalogManagementRequestError('Unsupported catalogue management action.');
  }
}

function parsePatch(value: unknown): CatalogProductEditPatch {
  const source = readRecord(value);
  const patch: CatalogProductEditPatch = {};
  assignOptionalString(patch, 'name', source.name);
  assignOptionalString(patch, 'categorySlug', source.categorySlug);
  assignOptionalNullableString(patch, 'subcategorySlug', source.subcategorySlug);
  assignOptionalNullableString(patch, 'primaryColor', source.primaryColor);
  assignOptionalNullableString(patch, 'colorFamily', source.colorFamily);
  assignOptionalNullableString(patch, 'materialSummary', source.materialSummary);
  assignOptionalNullableNumber(patch, 'currentPrice', source.currentPrice);
  assignOptionalNullableNumber(patch, 'originalPrice', source.originalPrice);
  assignOptionalNullableString(patch, 'currency', source.currency);
  if (source.priceUnavailable !== undefined) {
    if (typeof source.priceUnavailable !== 'boolean') {
      throw new CatalogManagementRequestError('priceUnavailable must be a boolean.');
    }
    patch.priceUnavailable = source.priceUnavailable;
  }
  if (Object.keys(patch).length === 0) {
    throw new CatalogManagementRequestError('At least one editable product field is required.');
  }
  return patch;
}

function readManualCandidates(value: unknown): RawCatalogProductCandidate[] {
  if (!Array.isArray(value) || value.length === 0 || value.length > 50) {
    throw new CatalogManagementRequestError('candidates must contain 1 to 50 products.');
  }
  return value.map((item, index) => {
    const source = readRecord(item);
    const name = readString(source.name, `candidates[${index}].name`);
    const sourceUrl = readHttpUrl(source.sourceUrl, `candidates[${index}].sourceUrl`);
    const candidate: RawCatalogProductCandidate = {
      name,
      sourceUrl,
      extractionMethod: 'manual',
    };
    assignCandidateString(candidate, 'externalProductId', source.externalProductId);
    assignCandidateString(candidate, 'externalStyleId', source.externalStyleId);
    assignCandidateString(candidate, 'externalSku', source.externalSku);
    assignCandidateString(candidate, 'description', source.description);
    assignCandidateString(candidate, 'brand', source.brand);
    assignCandidateString(candidate, 'gender', source.gender);
    assignCandidateString(candidate, 'category', source.category);
    assignCandidateString(candidate, 'subcategory', source.subcategory);
    assignCandidateString(candidate, 'color', source.color);
    assignCandidateString(candidate, 'currency', source.currency);
    assignCandidateString(candidate, 'availability', source.availability);
    assignCandidateString(candidate, 'canonicalUrl', source.canonicalUrl);
    if (typeof source.materials === 'string') candidate.materials = source.materials;
    else if (Array.isArray(source.materials)) {
      candidate.materials = source.materials.map((material, materialIndex) =>
        readString(material, `candidates[${index}].materials[${materialIndex}]`),
      );
    }
    assignCandidatePrice(candidate, 'currentPrice', source.currentPrice);
    assignCandidatePrice(candidate, 'originalPrice', source.originalPrice);
    if (source.priceUnavailable !== undefined) {
      if (typeof source.priceUnavailable !== 'boolean') {
        throw new CatalogManagementRequestError(
          `candidates[${index}].priceUnavailable must be a boolean.`,
        );
      }
      candidate.priceUnavailable = source.priceUnavailable;
    }
    if (source.images !== undefined) {
      if (!Array.isArray(source.images) || source.images.length > 20) {
        throw new CatalogManagementRequestError(`candidates[${index}].images is invalid.`);
      }
      candidate.images = source.images.map((image, imageIndex) => {
        const record = readRecord(image);
        return {
          imageUrl: readHttpUrl(
            record.imageUrl,
            `candidates[${index}].images[${imageIndex}].imageUrl`,
          ),
        };
      });
    }
    if (source.styleHints !== undefined) {
      if (!Array.isArray(source.styleHints) || source.styleHints.length > 50) {
        throw new CatalogManagementRequestError(`candidates[${index}].styleHints is invalid.`);
      }
      candidate.styleHints = source.styleHints.map((hint, hintIndex) =>
        readString(hint, `candidates[${index}].styleHints[${hintIndex}]`),
      );
    }
    candidate.rawPayload = { manualSeed: true };
    return candidate;
  });
}

function readRecord(value: unknown): Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new CatalogManagementRequestError('Request body must be a JSON object.');
  }
  return value as Record<string, unknown>;
}

function readString(value: unknown, field: string): string {
  if (typeof value !== 'string' || !value.trim()) {
    throw new CatalogManagementRequestError(`${field} is required.`);
  }
  return value.trim();
}

function readOptionalUuid(value: unknown, field: string): string | undefined {
  if (value === undefined) return undefined;
  return readUuid(value, field);
}

function readUuid(value: unknown, field: string): string {
  const result = readString(value, field);
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(result)) {
    throw new CatalogManagementRequestError(`${field} must be a UUID.`);
  }
  return result;
}

function readSlug(value: unknown): string {
  const result = readString(value, 'brandSlug');
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(result)) {
    throw new CatalogManagementRequestError('brandSlug is invalid.');
  }
  return result;
}

function readHttpUrl(value: unknown, field: string): string {
  const result = readString(value, field);
  try {
    const url = new URL(result);
    if (
      (url.protocol !== 'http:' && url.protocol !== 'https:') ||
      url.username ||
      url.password ||
      !url.hostname.includes('.') ||
      ['localhost', '127.0.0.1', '::1'].includes(url.hostname.toLowerCase())
    ) {
      throw new Error('unsafe');
    }
    return url.toString();
  } catch {
    throw new CatalogManagementRequestError(`${field} must be a public HTTP or HTTPS URL.`);
  }
}

function readOptionalStringArray(
  value: unknown,
  field: string,
  maxItems: number,
): string[] | undefined {
  if (value === undefined) return undefined;
  if (!Array.isArray(value) || value.length === 0 || value.length > maxItems) {
    throw new CatalogManagementRequestError(`${field} must contain 1 to ${maxItems} values.`);
  }
  return value.map((item, index) => readString(item, `${field}[${index}]`));
}

function assignOptionalString<K extends 'name' | 'categorySlug'>(
  patch: CatalogProductEditPatch,
  key: K,
  value: unknown,
) {
  if (value !== undefined) Object.assign(patch, { [key]: readString(value, key) });
}

function assignOptionalNullableString<
  K extends 'subcategorySlug' | 'primaryColor' | 'colorFamily' | 'materialSummary' | 'currency',
>(patch: CatalogProductEditPatch, key: K, value: unknown) {
  if (value === undefined) return;
  if (value === null) Object.assign(patch, { [key]: null });
  else Object.assign(patch, { [key]: readString(value, key) });
}

function assignOptionalNullableNumber<K extends 'currentPrice' | 'originalPrice'>(
  patch: CatalogProductEditPatch,
  key: K,
  value: unknown,
) {
  if (value === undefined) return;
  if (value === null) Object.assign(patch, { [key]: null });
  else if (typeof value === 'number' && Number.isFinite(value) && value >= 0) {
    Object.assign(patch, { [key]: value });
  } else {
    throw new CatalogManagementRequestError(`${key} must be a non-negative number or null.`);
  }
}

function assignCandidateString<K extends keyof RawCatalogProductCandidate>(
  candidate: RawCatalogProductCandidate,
  key: K,
  value: unknown,
) {
  if (value !== undefined) Object.assign(candidate, { [key]: readString(value, String(key)) });
}

function assignCandidatePrice<K extends 'currentPrice' | 'originalPrice'>(
  candidate: RawCatalogProductCandidate,
  key: K,
  value: unknown,
) {
  if (value === undefined) return;
  if (typeof value !== 'number' && typeof value !== 'string') {
    throw new CatalogManagementRequestError(`${key} must be a number or price string.`);
  }
  Object.assign(candidate, { [key]: value });
}

function compact<T extends Record<string, unknown>>(value: T): T {
  return Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined)) as T;
}

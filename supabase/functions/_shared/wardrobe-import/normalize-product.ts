import { cleanText } from './html-utils.ts';
import {
  MAX_IMPORTED_PRODUCTS,
  MAX_RAW_PRODUCT_CANDIDATES,
  type ImportedProductCandidate,
  type RawProductCandidate,
} from './types.ts';

const TRACKING_PARAMETERS = new Set(['fbclid', 'gclid', 'mc_cid', 'mc_eid', 'ref', 'source']);

export function normalizeProducts(
  candidates: RawProductCandidate[],
  sourceUrl: string,
): ImportedProductCandidate[] {
  const output: ImportedProductCandidate[] = [];
  const identities = createIdentityIndex();
  const maximum = Math.min(candidates.length, MAX_RAW_PRODUCT_CANDIDATES);
  for (let index = 0; index < maximum && output.length < MAX_IMPORTED_PRODUCTS; index += 1) {
    const candidate = candidates[index];
    if (!candidate) continue;
    const normalized = normalizeProduct(candidate, sourceUrl);
    if (!normalized || isDuplicateProduct(identities, normalized)) continue;
    rememberProduct(identities, normalized);
    output.push(normalized);
  }
  return output;
}

export function normalizeProduct(
  candidate: RawProductCandidate,
  sourceUrl: string,
): ImportedProductCandidate | null {
  const name = cleanText(candidate.name, 180);
  const productUrl = normalizeUrl(
    candidate.productUrl ?? candidate.canonicalUrl ?? sourceUrl,
    sourceUrl,
  );
  if (!name || !productUrl) return null;

  const canonicalUrl = normalizeUrl(candidate.canonicalUrl ?? productUrl, sourceUrl, true);
  const imageUrl = normalizeImageUrl(candidate.imageUrl, sourceUrl);
  const result: ImportedProductCandidate = {
    name,
    productUrl,
    sourceDomain: new URL(productUrl).hostname.toLowerCase(),
    extractionMethod: candidate.extractionMethod,
    confidence: candidate.confidence,
  };

  assignText(result, 'externalId', candidate.externalId, 160);
  assignText(result, 'description', candidate.description, 1000);
  assignText(result, 'brand', readNamedValue(candidate.brand), 120);
  const category = normalizeCategory(candidate.category, name);
  if (category) result.category = category;
  assignText(result, 'subcategory', candidate.subcategory, 100);
  assignText(result, 'color', candidate.color, 100);
  assignText(result, 'material', candidate.material, 100);
  assignText(result, 'size', candidate.size, 100);
  assignText(result, 'availability', candidate.availability, 160);
  if (canonicalUrl) result.canonicalUrl = canonicalUrl;
  if (imageUrl) result.imageUrl = imageUrl;

  const price = parsePrice(candidate.price);
  if (price !== undefined) result.price = price;

  const currency = cleanText(candidate.currency, 8)?.toUpperCase();
  if (currency && /^[A-Z]{3}$/.test(currency)) result.currency = currency;

  return result;
}

export function normalizeUrl(
  value: unknown,
  baseUrl: string,
  removeTracking = false,
): string | undefined {
  if (typeof value !== 'string' || !value.trim()) return undefined;
  try {
    const url = new URL(value.trim(), baseUrl);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return undefined;
    url.hash = '';
    if (removeTracking) {
      for (const key of [...url.searchParams.keys()]) {
        if (key.toLowerCase().startsWith('utm_') || TRACKING_PARAMETERS.has(key.toLowerCase())) {
          url.searchParams.delete(key);
        }
      }
    }
    return url.toString();
  } catch {
    return undefined;
  }
}

export function parsePrice(value: unknown): number | undefined {
  if (typeof value === 'number') return Number.isFinite(value) && value >= 0 ? value : undefined;
  if (typeof value !== 'string') return undefined;
  const match = value.replace(/\s/g, '').match(/-?\d[\d,.]*/)?.[0];
  if (!match) return undefined;
  const lastComma = match.lastIndexOf(',');
  const lastDot = match.lastIndexOf('.');
  let normalized = match;
  if (lastComma > lastDot) {
    normalized = match.replace(/\./g, '').replace(',', '.');
  } else {
    normalized = match.replace(/,/g, '');
  }
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
}

function normalizeImageUrl(value: unknown, baseUrl: string): string | undefined {
  const candidate = Array.isArray(value) ? value[0] : value;
  if (typeof candidate !== 'string') return undefined;
  return normalizeUrl(candidate, baseUrl);
}

type IdentityIndex = {
  canonical: Map<string, Set<string | null>>;
  productUrl: Map<string, Set<string | null>>;
  external: Set<string>;
  imageAndName: Set<string>;
};

function createIdentityIndex(): IdentityIndex {
  return {
    canonical: new Map(),
    productUrl: new Map(),
    external: new Set(),
    imageAndName: new Set(),
  };
}

function isDuplicateProduct(index: IdentityIndex, product: ImportedProductCandidate): boolean {
  const variant = product.externalId?.toLowerCase() ?? null;
  const canonical = product.canonicalUrl?.toLowerCase();
  if (canonical && identityMatches(index.canonical.get(canonical), variant)) return true;
  const productUrl = normalizeUrl(product.productUrl, product.productUrl, true)?.toLowerCase();
  if (productUrl && identityMatches(index.productUrl.get(productUrl), variant)) return true;
  if (variant && index.external.has(`${product.sourceDomain}\0${variant}`)) return true;
  return Boolean(
    product.imageUrl &&
    index.imageAndName.has(`${product.name.toLowerCase()}\0${product.imageUrl.toLowerCase()}`),
  );
}

function rememberProduct(index: IdentityIndex, product: ImportedProductCandidate) {
  const variant = product.externalId?.toLowerCase() ?? null;
  const canonical = product.canonicalUrl?.toLowerCase();
  if (canonical) rememberIdentity(index.canonical, canonical, variant);
  const productUrl = normalizeUrl(product.productUrl, product.productUrl, true)?.toLowerCase();
  if (productUrl) rememberIdentity(index.productUrl, productUrl, variant);
  if (variant) index.external.add(`${product.sourceDomain}\0${variant}`);
  if (product.imageUrl) {
    index.imageAndName.add(`${product.name.toLowerCase()}\0${product.imageUrl.toLowerCase()}`);
  }
}

function identityMatches(variants: Set<string | null> | undefined, variant: string | null) {
  if (!variants) return false;
  return variant === null || variants.has(null) || variants.has(variant);
}

function rememberIdentity(
  index: Map<string, Set<string | null>>,
  key: string,
  variant: string | null,
) {
  const variants = index.get(key) ?? new Set<string | null>();
  variants.add(variant);
  index.set(key, variants);
}

function assignText<K extends keyof ImportedProductCandidate>(
  target: ImportedProductCandidate,
  key: K,
  value: unknown,
  maxLength: number,
) {
  const normalized = cleanText(value, maxLength);
  if (normalized) Object.assign(target, { [key]: normalized });
}

function readNamedValue(value: unknown): unknown {
  if (typeof value !== 'object' || value === null) return value;
  return Reflect.get(value, 'name');
}

function normalizeCategory(value: unknown, name: string): string | undefined {
  const supplied = cleanText(value, 100);
  const signal = `${supplied ?? ''} ${name}`.toLowerCase();
  if (/\b(shirt|blouse|tee|t-shirt|top|sweater|jumper|cardigan)\b/.test(signal)) return 'Tops';
  if (/\b(trouser|pants|jean|skirt|shorts|bottom)\b/.test(signal)) return 'Bottoms';
  if (/\b(jacket|coat|blazer|outerwear)\b/.test(signal)) return 'Outerwear';
  if (/\b(dress|gown|jumpsuit)\b/.test(signal)) return 'Dresses';
  if (/\b(shoe|boot|sneaker|loafer|sandal|heel|footwear)\b/.test(signal)) return 'Shoes';
  if (/\b(bag|belt|hat|scarf|jewellery|jewelry|accessor)\b/.test(signal)) return 'Accessories';
  return supplied;
}

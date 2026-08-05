import { getCanonicalUrl } from './html-utils';
import type { RawProductCandidate } from './types';

type JsonRecord = Record<string, unknown>;

export function extractJsonLdProducts(html: string, pageUrl: string): RawProductCandidate[] {
  const output: RawProductCandidate[] = [];
  const canonicalUrl = getCanonicalUrl(html);

  for (const match of html.matchAll(
    /<script\b[^>]*type\s*=\s*["']application\/ld\+json[^"']*["'][^>]*>([\s\S]*?)<\/script>/gi,
  )) {
    const source = match[1]?.trim();
    if (!source) continue;
    try {
      collectProducts(JSON.parse(source) as unknown, output, pageUrl, canonicalUrl);
    } catch {
      // A malformed block must not prevent other metadata layers from running.
    }
  }

  return output;
}

function collectProducts(
  value: unknown,
  output: RawProductCandidate[],
  pageUrl: string,
  canonicalUrl?: string,
) {
  if (Array.isArray(value)) {
    value.forEach((item) => collectProducts(item, output, pageUrl, canonicalUrl));
    return;
  }
  if (!isRecord(value)) return;

  const types = normalizeTypes(value['@type']);
  if (types.includes('product')) output.push(mapProduct(value, pageUrl, canonicalUrl));

  if (types.includes('itemlist') && Array.isArray(value.itemListElement)) {
    value.itemListElement.forEach((entry) => {
      if (!isRecord(entry)) return;
      const item = isRecord(entry.item) ? entry.item : entry;
      const itemTypes = normalizeTypes(item['@type']);
      if (itemTypes.includes('product') || (item.name && (item.url || entry.url))) {
        output.push(mapProduct({ ...item, url: item.url ?? entry.url }, pageUrl, canonicalUrl));
      }
    });
  }

  for (const nested of Object.values(value)) collectProducts(nested, output, pageUrl, canonicalUrl);
}

function mapProduct(
  product: JsonRecord,
  pageUrl: string,
  pageCanonical?: string,
): RawProductCandidate {
  const offers = firstRecord(product.offers);
  const image = readImage(product.image);
  const brand = isRecord(product.brand) ? product.brand.name : product.brand;
  const price = offers?.price ?? offers?.lowPrice ?? offers?.highPrice;
  const currency = offers?.priceCurrency;

  return compact({
    externalId: readString(product.sku ?? product.productID ?? product.mpn),
    name: readString(product.name),
    description: readString(product.description),
    brand: readString(brand),
    imageUrl: image,
    productUrl: readString(product.url ?? offers?.url) ?? pageUrl,
    canonicalUrl: pageCanonical ?? readString(product.url),
    category: readString(product.category),
    color: readString(product.color),
    price: typeof price === 'number' || typeof price === 'string' ? price : undefined,
    currency: readString(currency),
    availability: readString(offers?.availability),
    extractionMethod: 'json-ld',
    confidence: 'high',
  });
}

function readImage(value: unknown): string | undefined {
  const first = Array.isArray(value) ? value[0] : value;
  if (typeof first === 'string') return first;
  if (isRecord(first)) return readString(first.url ?? first.contentUrl);
  return undefined;
}

function firstRecord(value: unknown): JsonRecord | undefined {
  const first = Array.isArray(value) ? value[0] : value;
  return isRecord(first) ? first : undefined;
}

function normalizeTypes(value: unknown): string[] {
  const values = Array.isArray(value) ? value : [value];
  return values
    .filter((item): item is string => typeof item === 'string')
    .map((item) => item.toLowerCase());
}

function compact<T extends Record<string, unknown>>(value: T): T {
  return Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined)) as T;
}

function readString(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

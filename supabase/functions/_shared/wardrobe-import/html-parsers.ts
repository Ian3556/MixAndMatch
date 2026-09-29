import {
  cleanText,
  getCanonicalUrl,
  getMetaContent,
  readAttributes,
  stripTags,
} from './html-utils.ts';
import type { RawProductCandidate } from './types.ts';
import { MAX_RAW_PRODUCT_CANDIDATES } from './types.ts';

export function extractOpenGraphProduct(html: string, pageUrl: string): RawProductCandidate[] {
  const type = getMetaContent(html, 'og:type')?.toLowerCase();
  const title = getMetaContent(html, 'og:title', 'twitter:title');
  const image = getMetaContent(html, 'og:image', 'twitter:image');
  const price = getMetaContent(html, 'product:price:amount', 'og:price:amount');
  const hasProductSignal = type?.includes('product') || Boolean(price);
  if (!title || !hasProductSignal) return [];

  return [
    compact({
      name: title,
      description: getMetaContent(html, 'og:description', 'description'),
      brand: getMetaContent(html, 'product:brand'),
      imageUrl: image,
      productUrl: getMetaContent(html, 'og:url') ?? getCanonicalUrl(html) ?? pageUrl,
      canonicalUrl: getCanonicalUrl(html),
      color: getMetaContent(html, 'product:color'),
      size: getMetaContent(html, 'product:size'),
      price,
      currency: getMetaContent(html, 'product:price:currency', 'og:price:currency'),
      availability: getMetaContent(html, 'product:availability'),
      extractionMethod: 'open-graph',
      confidence: 'medium',
    }),
  ];
}

export function extractMarkupProducts(
  html: string,
  maximum = MAX_RAW_PRODUCT_CANDIDATES,
): RawProductCandidate[] {
  const output: RawProductCandidate[] = [];
  const isShopify = /cdn\.shopify\.com|Shopify\.theme|\/products\//i.test(html);
  const isWooCommerce = /woocommerce|wc-block-grid|products columns-/i.test(html);

  for (const anchor of readAnchors(html)) {
    const signal = `${anchor.className} ${anchor.href}`;
    const platformMatch = isShopify
      ? /\/products\//i.test(anchor.href)
      : isWooCommerce && /product|woocommerce-loop-product/i.test(signal);
    const genericMatch =
      /(?:product|product-card|catalog-item|collection-item|\/p\/|\/item\/)/i.test(signal);
    if (!platformMatch && !genericMatch) continue;
    const candidate = platformMatch
      ? mapAnchor(anchor, 'platform-adapter', 'medium')
      : mapAnchor(anchor, 'html-heuristic', 'low');
    if (candidate) output.push(candidate);
    if (output.length >= maximum) break;
  }

  return output;
}

type AnchorRecord = {
  href: string;
  className: string;
  body: string;
  attributes: Record<string, string>;
};

function* readAnchors(html: string): Generator<AnchorRecord> {
  for (const match of html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a\s*>/gi)) {
    const attributes = readAttributes(`<a ${match[1] ?? ''}>`);
    if (!attributes.href) continue;
    yield {
      href: attributes.href,
      className: attributes.class ?? '',
      body: match[2] ?? '',
      attributes,
    };
  }
}

function mapAnchor(
  anchor: AnchorRecord,
  extractionMethod: RawProductCandidate['extractionMethod'],
  confidence: RawProductCandidate['confidence'],
): RawProductCandidate | null {
  const imageTag = anchor.body.match(/<img\b[^>]*>/i)?.[0];
  if (!imageTag) return null;
  const image = readAttributes(imageTag);
  const imageUrl = image.src ?? image['data-src'] ?? image['data-lazy-src'];
  const heading = anchor.body.match(
    /<(?:h[1-6]|strong|span)\b[^>]*>([\s\S]*?)<\/(?:h[1-6]|strong|span)\s*>/i,
  )?.[1];
  const text = cleanText(stripTags(anchor.body), 180);
  const name =
    cleanText(anchor.attributes['data-product-title'], 180) ??
    cleanText(anchor.attributes['aria-label'], 180) ??
    cleanText(heading, 180) ??
    cleanText(image.alt, 180) ??
    text;
  if (!name || !imageUrl || isDecorative(name, imageUrl, anchor.className)) return null;

  const priceText = anchor.body.match(
    /(?:[$€£¥]\s*\d[\d,.]*|\d[\d,.]*\s*(?:USD|EUR|GBP|MYR|AUD|CAD))/i,
  )?.[0];
  return compact({
    name,
    imageUrl,
    productUrl: anchor.href,
    price: priceText,
    extractionMethod,
    confidence,
  });
}

function isDecorative(name: string, imageUrl: string, className: string): boolean {
  const value = `${name} ${imageUrl} ${className}`.toLowerCase();
  return /\b(logo|banner|icon|sprite|avatar|placeholder|navigation|advert|payment)\b/.test(value);
}

function compact<T extends Record<string, unknown>>(value: T): T {
  return Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined)) as T;
}

import { normalizeCatalogCategory } from './taxonomy';
import {
  CATALOG_NORMALIZATION_VERSION,
  type CatalogGender,
  type CatalogPipelineContext,
  type NormalizedCatalogImage,
  type NormalizedCatalogProduct,
  type NormalizedCatalogVariant,
  type NormalizedMaterial,
  type RawCatalogImage,
  type RawCatalogProductCandidate,
  type RawCatalogVariant,
} from './types';

const TRACKING_PARAMETERS = new Set([
  'fbclid',
  'gclid',
  'mc_cid',
  'mc_eid',
  'ref',
  'source',
  'campaign',
]);

const COLOR_RULES: readonly { canonical: string; family: string; patterns: readonly RegExp[] }[] = [
  { canonical: 'black', family: 'black', patterns: [/\bblack\b/, /\bjet\b/, /\bonyx\b/] },
  {
    canonical: 'white',
    family: 'white',
    patterns: [/\bwhite\b/, /\bivory\b/, /\bcream\b/, /\becru\b/],
  },
  { canonical: 'grey', family: 'grey', patterns: [/\bgr[ae]y\b/, /\bcharcoal\b/, /\bsilver\b/] },
  { canonical: 'navy', family: 'blue', patterns: [/\bnavy\b/] },
  {
    canonical: 'blue',
    family: 'blue',
    patterns: [/\bblue\b/, /\bindigo\b/, /\bcobalt\b/, /\bteal\b/],
  },
  {
    canonical: 'brown',
    family: 'brown',
    patterns: [/\bbrown\b/, /\bchocolate\b/, /\bchestnut\b/, /\btan\b/, /\bcamel\b/],
  },
  {
    canonical: 'beige',
    family: 'beige',
    patterns: [/\bbeige\b/, /\bkhaki\b/, /\bsand\b/, /\bstone\b/, /\btaupe\b/],
  },
  {
    canonical: 'green',
    family: 'green',
    patterns: [/\bgreen\b/, /\bolive\b/, /\bforest\b/, /\bsage\b/],
  },
  {
    canonical: 'red',
    family: 'red',
    patterns: [/\bred\b/, /\bcrimson\b/, /\bburgundy\b/, /\bmaroon\b/],
  },
  {
    canonical: 'pink',
    family: 'pink',
    patterns: [/\bpink\b/, /\bblush\b/, /\brose\b/, /\bfuchsia\b/],
  },
  {
    canonical: 'purple',
    family: 'purple',
    patterns: [/\bpurple\b/, /\bviolet\b/, /\blilac\b/, /\bplum\b/],
  },
  { canonical: 'yellow', family: 'yellow', patterns: [/\byellow\b/, /\bmustard\b/, /\bgold\b/] },
  { canonical: 'orange', family: 'orange', patterns: [/\borange\b/, /\brust\b/, /\bterracotta\b/] },
  {
    canonical: 'multi',
    family: 'multi',
    patterns: [/\bmulticolou?r\b/, /\bmulti[ -]?color\b/, /\bcolor block\b/],
  },
] as const;

const MATERIAL_RULES: readonly { canonical: string; patterns: readonly RegExp[] }[] = [
  { canonical: 'cotton', patterns: [/\bcotton\b/] },
  { canonical: 'organic cotton', patterns: [/\borganic cotton\b/] },
  { canonical: 'wool', patterns: [/\bwool\b/] },
  { canonical: 'merino wool', patterns: [/\bmerino\b/] },
  { canonical: 'cashmere', patterns: [/\bcashmere\b/] },
  { canonical: 'linen', patterns: [/\blinen\b/] },
  { canonical: 'silk', patterns: [/\bsilk\b/] },
  { canonical: 'leather', patterns: [/\bleather\b/] },
  { canonical: 'suede', patterns: [/\bsuede\b/] },
  { canonical: 'denim', patterns: [/\bdenim\b/] },
  { canonical: 'polyester', patterns: [/\bpolyester\b/] },
  { canonical: 'nylon', patterns: [/\bnylon\b/, /\bpolyamide\b/] },
  { canonical: 'viscose', patterns: [/\bviscose\b/, /\brayon\b/] },
  { canonical: 'elastane', patterns: [/\belastane\b/, /\bspandex\b/, /\blycra\b/] },
  { canonical: 'acrylic', patterns: [/\bacrylic\b/] },
  { canonical: 'rubber', patterns: [/\brubber\b/] },
] as const;

export function normalizeCatalogProduct(
  raw: RawCatalogProductCandidate,
  context: CatalogPipelineContext,
): NormalizedCatalogProduct {
  const warnings: string[] = [];
  const name = normalizeText(raw.name, 220) ?? '';
  const description = normalizeText(raw.description, 10000);
  const rawCategory = normalizeText(raw.category, 240);
  const rawSubcategory = normalizeText(raw.subcategory, 240);
  const category = normalizeCatalogCategory(rawCategory, rawSubcategory, name);
  warnings.push(...category.warnings);

  const sourceUrl = normalizeHttpUrl(raw.sourceUrl ?? raw.canonicalUrl ?? '') ?? '';
  const canonicalUrl =
    normalizeHttpUrl(raw.canonicalUrl ?? sourceUrl, sourceUrl || undefined, true) ?? sourceUrl;
  const sourceDomain = readDomain(sourceUrl) ?? normalizeDomain(raw.sourceDomain) ?? '';
  const color = normalizeColor(raw.color, `${name} ${description ?? ''}`);
  if (color.inferred) warnings.push('color_inferred_from_product_text');
  if (!color.primaryColor) warnings.push('color_not_determined');

  const materials = normalizeMaterials(raw.materials, description);
  if (materials.length === 0) warnings.push('material_not_determined');

  const currentPrice = normalizePrice(raw.currentPrice);
  const originalPrice = normalizePrice(raw.originalPrice);
  const currency = normalizeCurrency(raw.currency);
  const priceUnavailable = raw.priceUnavailable === true;
  if (currentPrice === null && !priceUnavailable) warnings.push('price_not_determined');

  const images = normalizeImages(raw.images ?? [], canonicalUrl || sourceUrl);
  const variants = normalizeVariants(raw.variants ?? [], color.primaryColor, currency);
  const externalProductId = normalizeText(raw.externalProductId, 200);
  const externalStyleId = normalizeText(raw.externalStyleId, 200);
  const externalSku = normalizeText(raw.externalSku, 200);
  const deduplicationKey = createCatalogDeduplicationKey({
    brandSlug: context.brandSlug,
    externalProductId,
    externalSku,
    canonicalUrl,
    name,
    colorFamily: color.colorFamily,
  });

  return {
    brandSlug: normalizeSlug(context.brandSlug) || 'unknown-brand',
    sourceBrand: normalizeText(raw.brand, 120),
    externalProductId,
    externalStyleId,
    externalSku,
    name,
    slug: normalizeSlug(name) || 'unnamed-product',
    description,
    categorySlug: category.categorySlug,
    subcategorySlug: category.subcategorySlug,
    rawCategory,
    rawSubcategory,
    categoryConfidence: category.confidence,
    gender: normalizeGender(raw.gender),
    primaryColor: color.primaryColor,
    colorFamily: color.colorFamily,
    colorConfidence: color.confidence,
    materialSummary:
      materials.length > 0 ? materials.map((item) => item.material).join(', ') : null,
    materials,
    currentPrice,
    originalPrice,
    currency,
    priceUnavailable,
    availability: normalizeText(raw.availability, 200),
    sourceUrl,
    canonicalUrl,
    sourceDomain,
    extractionMethod: raw.extractionMethod,
    deduplicationKey,
    images,
    variants,
    styleHints: normalizeStringList(raw.styleHints ?? [], 50, 100),
    rawPayload: raw.rawPayload ?? {},
    normalizationWarnings: unique(warnings),
    normalizationVersion: CATALOG_NORMALIZATION_VERSION,
  };
}

export function normalizeHttpUrl(
  value: string,
  baseUrl?: string,
  removeTracking = false,
): string | null {
  if (!value.trim()) return null;
  try {
    const url = baseUrl ? new URL(value.trim(), baseUrl) : new URL(value.trim());
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;
    url.username = '';
    url.password = '';
    url.hash = '';
    url.hostname = url.hostname.toLowerCase();
    if (removeTracking) {
      for (const key of [...url.searchParams.keys()]) {
        const normalizedKey = key.toLowerCase();
        if (normalizedKey.startsWith('utm_') || TRACKING_PARAMETERS.has(normalizedKey)) {
          url.searchParams.delete(key);
        }
      }
    }
    return url.toString();
  } catch {
    return null;
  }
}

export function normalizePrice(value: number | string | undefined): number | null {
  if (typeof value === 'number') return Number.isFinite(value) && value >= 0 ? value : null;
  if (typeof value !== 'string') return null;
  const match = value.replace(/\s/g, '').match(/-?\d[\d,.]*/)?.[0];
  if (!match) return null;
  const lastComma = match.lastIndexOf(',');
  const lastDot = match.lastIndexOf('.');
  let normalized = match;
  if (lastComma > lastDot) normalized = match.replace(/\./g, '').replace(',', '.');
  else normalized = match.replace(/,/g, '');
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

export function normalizeColor(
  rawColor: string | undefined,
  fallbackText: string,
): {
  primaryColor: string | null;
  colorFamily: string | null;
  confidence: number;
  inferred: boolean;
} {
  const supplied = normalizeSignal(rawColor);
  const direct = matchColor(supplied);
  if (direct) return { ...direct, confidence: 0.98, inferred: false };

  const inferred = matchColor(normalizeSignal(fallbackText));
  if (inferred) return { ...inferred, confidence: 0.68, inferred: true };
  return { primaryColor: null, colorFamily: null, confidence: 0, inferred: false };
}

export function createCatalogDeduplicationKey(input: {
  brandSlug: string;
  externalProductId: string | null;
  externalSku: string | null;
  canonicalUrl: string;
  name: string;
  colorFamily: string | null;
}): string {
  const brand = normalizeSlug(input.brandSlug) || 'unknown-brand';
  const color = normalizeSlug(input.colorFamily ?? 'unknown-color');
  if (input.externalSku)
    return `v1:${brand}:sku:${normalizeIdentity(input.externalSku)}:color:${color}`;
  if (input.externalProductId) {
    return `v1:${brand}:product:${normalizeIdentity(input.externalProductId)}:color:${color}`;
  }
  if (input.canonicalUrl) {
    return `v1:${brand}:url:${input.canonicalUrl.toLowerCase()}:color:${color}`.slice(0, 2048);
  }
  return `v1:${brand}:name:${normalizeIdentity(input.name)}:color:${color}`;
}

export function normalizeSlug(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
    .slice(0, 180);
}

function normalizeImages(images: RawCatalogImage[], baseUrl: string): NormalizedCatalogImage[] {
  const output: NormalizedCatalogImage[] = [];
  for (const image of images) {
    const imageUrl = normalizeHttpUrl(image.imageUrl, baseUrl || undefined);
    if (!imageUrl || output.some((candidate) => candidate.imageUrl === imageUrl)) continue;
    const sourceUrl = normalizeHttpUrl(image.sourceUrl ?? baseUrl, baseUrl || undefined) ?? baseUrl;
    output.push({
      imageUrl,
      sourceUrl,
      position: output.length,
      imageType: output.length === 0 ? 'primary' : (image.imageType ?? 'alternate'),
    });
    if (output.length === 20) break;
  }
  return output;
}

function normalizeVariants(
  variants: RawCatalogVariant[],
  productColor: string | null,
  productCurrency: string | null,
): NormalizedCatalogVariant[] {
  const output: NormalizedCatalogVariant[] = [];
  for (const raw of variants) {
    const externalVariantId = normalizeText(raw.externalVariantId, 200);
    const sku = normalizeText(raw.sku, 200);
    const size = normalizeText(raw.size, 100);
    const color = normalizeText(raw.color, 100) ?? productColor;
    const price = normalizePrice(raw.price);
    const currency = normalizeCurrency(raw.currency) ?? productCurrency;
    const availability = normalizeText(raw.availability, 200);
    if (!externalVariantId && !sku && !size && !color && price === null && !availability) continue;
    const variantKey =
      [
        externalVariantId ? `id:${normalizeIdentity(externalVariantId)}` : '',
        sku ? `sku:${normalizeIdentity(sku)}` : '',
        size ? `size:${normalizeIdentity(size)}` : '',
        color ? `color:${normalizeIdentity(color)}` : '',
      ]
        .filter(Boolean)
        .join('|') || `variant:${output.length}`;
    if (output.some((candidate) => candidate.variantKey === variantKey)) continue;
    output.push({
      externalVariantId,
      sku,
      variantKey,
      size,
      color,
      price,
      currency,
      availability,
    });
    if (output.length === 200) break;
  }
  return output;
}

function normalizeMaterials(
  rawMaterials: string | string[] | undefined,
  description: string | null,
): NormalizedMaterial[] {
  const supplied = Array.isArray(rawMaterials) ? rawMaterials.join(', ') : (rawMaterials ?? '');
  const source = supplied || description || '';
  const signal = normalizeSignal(source);
  const output: NormalizedMaterial[] = [];
  for (const rule of MATERIAL_RULES) {
    if (!rule.patterns.some((pattern) => pattern.test(signal))) continue;
    if (output.some((candidate) => candidate.material === rule.canonical)) continue;
    const percentageMatch = source.match(
      new RegExp(`(\\d{1,3}(?:\\.\\d+)?)%?\\s*${rule.canonical.replace(/ /g, '\\s+')}`, 'i'),
    );
    const percentage = percentageMatch?.[1] ? Number.parseFloat(percentageMatch[1]) : null;
    output.push({
      material: rule.canonical,
      percentage: percentage !== null && percentage <= 100 ? percentage : null,
      confidence: supplied ? 0.96 : 0.65,
    });
  }
  return output;
}

function matchColor(signal: string): { primaryColor: string; colorFamily: string } | null {
  for (const rule of COLOR_RULES) {
    if (rule.patterns.some((pattern) => pattern.test(signal))) {
      return { primaryColor: rule.canonical, colorFamily: rule.family };
    }
  }
  return null;
}

function normalizeGender(value: string | undefined): CatalogGender {
  const signal = normalizeSignal(value);
  if (/\b(women|woman|female|ladies)\b/.test(signal)) return 'women';
  if (/\b(men|man|male|gentlemen)\b/.test(signal)) return 'men';
  if (/\b(kids?|children|boys?|girls?)\b/.test(signal)) return 'kids';
  if (/\b(unisex|all gender|gender neutral)\b/.test(signal)) return 'unisex';
  return 'unknown';
}

function normalizeCurrency(value: string | undefined): string | null {
  const currency = value?.trim().toUpperCase();
  return currency && /^[A-Z]{3}$/.test(currency) ? currency : null;
}

function normalizeText(value: unknown, maxLength: number): string | null {
  if (typeof value !== 'string') return null;
  const normalized = value.replace(/\s+/g, ' ').trim();
  return normalized ? normalized.slice(0, maxLength) : null;
}

function normalizeSignal(value: string | undefined): string {
  return (value ?? '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9% -]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeDomain(value: string | undefined): string | null {
  const normalized = value
    ?.trim()
    .toLowerCase()
    .replace(/^www\./, '');
  return normalized && normalized.length <= 253 ? normalized : null;
}

function readDomain(url: string): string | null {
  try {
    return new URL(url).hostname.toLowerCase().replace(/^www\./, '');
  } catch {
    return null;
  }
}

function normalizeIdentity(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9.:/_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 500);
}

function normalizeStringList(values: string[], limit: number, maxLength: number): string[] {
  return unique(
    values.map((value) => normalizeText(value, maxLength)?.toLowerCase() ?? '').filter(Boolean),
  ).slice(0, limit);
}

function unique(values: string[]): string[] {
  return [...new Set(values)];
}

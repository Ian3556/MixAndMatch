export type MetadataValue = 'brand' | 'color' | 'subcategory' | 'material' | 'season' | 'occasion';
export type MetadataSource = 'source' | 'domain' | 'inferred' | 'user';

type MetadataInput = {
  name: string;
  category: string;
  brand?: string | null;
  color?: string | null;
  subcategory?: string | null;
  material?: string | null;
  season?: string | null;
  occasion?: string | null;
  description?: string | null;
  sourceDomain?: string | null;
  sourceUrl?: string | null;
  suppressed?: readonly MetadataValue[];
};

const OFFICIAL_BRAND_DOMAINS: Record<string, string> = {
  'nike.com': 'Nike',
  'uniqlo.com': 'UNIQLO',
  'cos.com': 'COS',
};

export const TOP_SUBCATEGORIES = [
  'T-Shirt',
  'Shirt',
  'Polo',
  'Tank Top',
  'Sweatshirt',
  'Hoodie',
  'Knitwear',
  'Performance Top',
  'Other',
] as const;

export function knownBrandFromDomain(domainOrUrl: string | null | undefined): string | null {
  if (!domainOrUrl) return null;
  let hostname: string;
  try {
    hostname = new URL(
      domainOrUrl.includes('://') ? domainOrUrl : `https://${domainOrUrl}`,
    ).hostname.toLowerCase();
  } catch {
    return null;
  }
  for (const [domain, brand] of Object.entries(OFFICIAL_BRAND_DOMAINS)) {
    if (hostname === domain || hostname.endsWith(`.${domain}`)) return brand;
  }
  return null;
}

export function normalizeColour(value: string | null | undefined): string | null {
  const parts =
    value
      ?.split('/')
      .map((part) => part.trim())
      .filter(Boolean) ?? [];
  const seen = new Set<string>();
  const unique = parts.filter((part) => {
    const key = part.toLocaleLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  return unique.join(' / ') || null;
}

export function resolveWardrobeMetadata(input: MetadataInput) {
  const sources: Partial<Record<MetadataValue, MetadataSource>> = {};
  const supplied = (key: MetadataValue, value: string | null | undefined) => {
    const text = value?.trim() || null;
    if (text) sources[key] = 'source';
    return text;
  };
  const brand =
    supplied('brand', input.brand) ??
    (input.suppressed?.includes('brand')
      ? null
      : (knownBrandFromDomain(input.sourceDomain) ?? knownBrandFromDomain(input.sourceUrl)));
  if (brand && !sources.brand) sources.brand = 'domain';

  const color = normalizeColour(supplied('color', input.color));
  const subcategory =
    supplied('subcategory', input.subcategory) ??
    (input.suppressed?.includes('subcategory') ? null : inferSubcategory(input));
  if (subcategory && !sources.subcategory) sources.subcategory = 'inferred';

  const material =
    supplied('material', input.material) ??
    (input.suppressed?.includes('material') ? null : extractMaterialComposition(input.description));
  if (material && !sources.material) sources.material = 'source';

  const season =
    supplied('season', input.season) ??
    (input.suppressed?.includes('season') ? null : inferSeason(input.name, input.description));
  if (season && !sources.season) sources.season = 'inferred';

  const occasion =
    supplied('occasion', input.occasion) ??
    (input.suppressed?.includes('occasion') ? null : inferOccasion(input.name));
  if (occasion && !sources.occasion) sources.occasion = 'inferred';

  return { brand, color, subcategory, material, season, occasion, sources };
}

export function displayProductName(
  name: string,
  color: string | null,
  size: string | null,
): string {
  let title = name.trim();
  if (size && title.toLowerCase().endsWith(` - size ${size.toLowerCase()}`)) {
    title = title.slice(0, -` - Size ${size}`.length);
  }
  const lastSeparator = title.lastIndexOf(' - ');
  if (lastSeparator >= 0 && color) {
    const suffix = title.slice(lastSeparator + 3);
    if (normalizeColour(suffix)?.toLowerCase() === normalizeColour(color)?.toLowerCase()) {
      title = title.slice(0, lastSeparator);
    }
  }
  return title;
}

function inferSubcategory(input: MetadataInput): string | null {
  if (input.category.trim().toLowerCase() !== 'tops') return null;
  const name = input.name.toLowerCase();
  if (/\b(tennis|running|training|performance|dri-fit)\b/.test(name)) return 'Performance Top';
  if (/\b(polo)\b/.test(name)) return 'Polo';
  if (/\b(t-shirt|tee)\b/.test(name)) return 'T-Shirt';
  if (/\b(hoodie)\b/.test(name)) return 'Hoodie';
  if (/\b(sweatshirt)\b/.test(name)) return 'Sweatshirt';
  if (/\b(tank top|tank)\b/.test(name)) return 'Tank Top';
  if (/\b(cardigan|knitwear|sweater|jumper)\b/.test(name)) return 'Knitwear';
  if (/\b(shirt|blouse)\b/.test(name)) return 'Shirt';
  return null;
}

function inferOccasion(name: string): string | null {
  const lower = name.toLowerCase();
  if (/\btennis\b/.test(lower)) return 'Sport, Tennis';
  if (/\brunning\b/.test(lower)) return 'Sport, Running';
  if (/\b(gym|training)\b/.test(lower)) return 'Sport, Gym';
  return null;
}

function inferSeason(name: string, description: string | null | undefined): string | null {
  const text = `${name} ${description ?? ''}`.toLowerCase();
  if (/\ball[- ]season\b/.test(text)) return 'All Season';
  const matches = ['Spring', 'Summer', 'Autumn', 'Winter'].filter((season) =>
    new RegExp(`\\b${season.toLowerCase()}\\b`).test(text),
  );
  return matches.length === 1 ? matches[0]! : null;
}

function extractMaterialComposition(description: string | null | undefined): string | null {
  if (!description) return null;
  const matches = [
    ...description.matchAll(
      /(\d{1,3})\s*%\s*((?:recycled\s+)?(?:cotton|polyester|elastane|nylon|wool|linen|silk|viscose|rayon|spandex))/gi,
    ),
  ];
  if (matches.length === 0 || matches.length > 4) return null;
  const total = matches.reduce((sum, match) => sum + Number(match[1]), 0);
  if (total !== 100) return null;
  return matches.map((match) => `${match[1]}% ${match[2]!.toLowerCase()}`).join(' / ');
}

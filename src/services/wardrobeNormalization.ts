import type {
  ClothingSource,
  CreateWardrobeItemInput,
  NormalizedClothingItem,
} from '@/types/wardrobe';

export class WardrobeNormalizationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'WardrobeNormalizationError';
  }
}

export function normalizeClothingItem(input: NormalizedClothingItem): NormalizedClothingItem {
  const name = input.name.trim();
  const category = input.category.trim();
  if (!name) throw new WardrobeNormalizationError('A clothing item name is required.');
  if (!category) throw new WardrobeNormalizationError('A clothing category is required.');

  const primaryImageUrl = nullable(input.primaryImageUrl);
  const imageUrls = uniqueStrings([primaryImageUrl, ...(input.imageUrls ?? [])]);

  return {
    sourceType: input.sourceType,
    name,
    category,
    catalogProductId: nullable(input.catalogProductId),
    sourceUrl: nullable(input.sourceUrl),
    sourceDomain: nullable(input.sourceDomain),
    externalProductId: nullable(input.externalProductId),
    brand: nullable(input.brand),
    subcategory: nullable(input.subcategory),
    color: nullable(input.color),
    secondaryColor: nullable(input.secondaryColor),
    size: nullable(input.size),
    pattern: nullable(input.pattern),
    material: nullable(input.material),
    season: nullable(input.season),
    occasion: nullable(input.occasion),
    notes: nullable(input.notes),
    primaryImageUrl: primaryImageUrl ?? imageUrls[0] ?? null,
    imageUrls,
    price: normalizePrice(input.price),
    currency: normalizeCurrency(input.currency),
    metadata: input.metadata ?? {},
  };
}

export function buildWardrobeInput(
  item: NormalizedClothingItem,
  deduplicationKey: string,
  isFavorite = false,
): CreateWardrobeItemInput {
  const normalized = normalizeClothingItem(item);
  return {
    catalogProductId: normalized.catalogProductId ?? null,
    name: normalized.name,
    category: normalized.category,
    subcategory: normalized.subcategory ?? null,
    primaryColor: normalized.color ?? null,
    secondaryColor: normalized.secondaryColor ?? null,
    size: normalized.size ?? null,
    pattern: normalized.pattern ?? null,
    material: normalized.material ?? null,
    brand: normalized.brand ?? null,
    season: normalized.season ?? null,
    occasion: normalized.occasion ?? null,
    notes: normalized.notes ?? null,
    isFavorite,
    imageUrl: normalized.primaryImageUrl ?? null,
    imageUrls: normalized.imageUrls ?? [],
    sourceUrl: normalized.sourceUrl ?? null,
    sourceDomain: normalized.sourceDomain ?? null,
    externalProductId: normalized.externalProductId ?? null,
    price: normalized.price ?? null,
    currency: normalized.currency ?? null,
    importMethod: importMethodFor(normalized.sourceType),
    sourceType: normalized.sourceType,
    metadata: normalized.metadata ?? {},
    deduplicationKey: deduplicationKey.trim(),
  };
}

function importMethodFor(sourceType: ClothingSource): CreateWardrobeItemInput['importMethod'] {
  if (sourceType === 'catalog') return 'catalog';
  if (sourceType === 'url_import') return 'website-url';
  return 'manual';
}

function nullable(value: string | null | undefined): string | null {
  const normalized = value?.trim();
  return normalized ? normalized : null;
}

function uniqueStrings(values: (string | null | undefined)[]): string[] {
  return [...new Set(values.map((value) => nullable(value)).filter(isString))];
}

function normalizePrice(value: number | null | undefined): number | null {
  if (value === null || value === undefined) return null;
  if (!Number.isFinite(value) || value < 0) {
    throw new WardrobeNormalizationError('The clothing item price must be non-negative.');
  }
  return value;
}

function normalizeCurrency(value: string | null | undefined): string | null {
  const currency = nullable(value)?.toUpperCase() ?? null;
  if (currency && !/^[A-Z]{3}$/.test(currency)) {
    throw new WardrobeNormalizationError('The currency must use a three-letter code.');
  }
  return currency;
}

function isString(value: string | null): value is string {
  return value !== null;
}

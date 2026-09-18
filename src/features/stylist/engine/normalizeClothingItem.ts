import { normalizeCategory } from '../data/categoryRules';
import { normalizeColor, normalizeToken } from '../data/colorRules';
import { STYLE_INFERENCE_RULES } from '../data/styleRules';
import type { ClothingItem } from '../types';
import type { Json } from '@/types/database';
import type { WardrobeItem } from '@/types/wardrobe';

export function normalizeClothingItem(item: WardrobeItem): ClothingItem {
  const metadata = item.metadata;
  const subcategory = clean(item.subcategory);
  const pattern = clean(item.pattern);
  const material = clean(item.material);
  const primaryColor = normalizeColor(item.primaryColor);
  const secondaryColors = unique([
    ...splitValues(item.secondaryColor),
    ...readStringArray(metadata, 'secondaryColors'),
  ])
    .map(normalizeColor)
    .filter((value): value is string => Boolean(value));
  const explicitStyles = readStringArray(metadata, 'styles', 'style')
    .map(normalizeToken)
    .filter(isText);
  const inferredStyles = inferStyles([item.name, item.category, item.subcategory, item.material]);
  const occasions = unique([
    ...splitValues(item.occasion),
    ...readStringArray(metadata, 'occasions', 'occasion'),
  ])
    .map(normalizeToken)
    .filter(isText);
  const seasons = unique([
    ...splitValues(item.season),
    ...readStringArray(metadata, 'seasons', 'season'),
  ])
    .map(normalizeToken)
    .filter(isText);
  const fit = normalizeToken(readString(metadata, 'fit') ?? inferFit(item));
  const silhouette = normalizeToken(readString(metadata, 'silhouette'));
  const formality =
    readBoundedNumber(metadata, 'formality', 0, 10) ?? inferFormality(item, occasions);
  const warmth = readBoundedNumber(metadata, 'warmth', 0, 10) ?? inferWarmth(item);
  const imageUrl = clean(item.imageUrl);
  const brand = clean(item.brand);

  return {
    id: item.id,
    name: item.name.trim() || 'Unnamed item',
    category: normalizeCategory(item.category, item.subcategory, item.name),
    ...(subcategory ? { subcategory } : {}),
    ...(primaryColor ? { primaryColor } : {}),
    ...(secondaryColors.length > 0 ? { secondaryColors } : {}),
    ...(pattern ? { pattern: pattern.toLowerCase() } : {}),
    ...(material ? { material: material.toLowerCase() } : {}),
    ...(fit ? { fit } : {}),
    ...(silhouette ? { silhouette } : {}),
    ...(explicitStyles.length > 0 || inferredStyles.length > 0
      ? { styles: unique([...explicitStyles, ...inferredStyles]) }
      : {}),
    ...(occasions.length > 0 ? { occasions } : {}),
    ...(seasons.length > 0 ? { seasons } : {}),
    ...(formality === undefined ? {} : { formality }),
    ...(warmth === undefined ? {} : { warmth }),
    ...(imageUrl ? { imageUrl } : {}),
    ...(brand ? { brand } : {}),
  };
}

export function normalizeWardrobe(items: readonly WardrobeItem[]): ClothingItem[] {
  return items.map(normalizeClothingItem);
}

function inferStyles(values: (string | null | undefined)[]): string[] {
  const haystack = values.filter(isText).join(' ').toLowerCase();
  if (!haystack) return [];
  return unique(
    STYLE_INFERENCE_RULES.filter((rule) =>
      rule.terms.some((term) => haystack.includes(term)),
    ).flatMap((rule) => rule.styles),
  );
}

function inferFit(item: WardrobeItem): string | undefined {
  const haystack = `${item.name} ${item.subcategory ?? ''} ${item.notes ?? ''}`.toLowerCase();
  return ['slim', 'regular', 'relaxed', 'oversized', 'wide', 'straight', 'cropped', 'fitted'].find(
    (fit) => haystack.includes(fit),
  );
}

function inferFormality(item: WardrobeItem, occasions: readonly string[]): number | undefined {
  const haystack = `${item.name} ${item.category} ${item.subcategory ?? ''}`.toLowerCase();
  if (/(gym|running|athletic|sport)/.test(haystack)) return 1;
  if (/(suit|tuxedo|formal|evening gown)/.test(haystack)) return 10;
  if (/(blazer|dress shirt|oxford|loafer|tailored)/.test(haystack)) return 7;
  if (occasions.includes('formal')) return 9;
  if (occasions.some((occasion) => ['work', 'business-casual'].includes(occasion))) return 7;
  return undefined;
}

function inferWarmth(item: WardrobeItem): number | undefined {
  const haystack =
    `${item.name} ${item.category} ${item.subcategory ?? ''} ${item.material ?? ''}`.toLowerCase();
  if (/(heavy|puffer|down|thermal|winter|wool overcoat|parka)/.test(haystack)) return 9;
  if (/(coat|thick wool|fleece)/.test(haystack)) return 8;
  if (/(linen|mesh|lightweight|tank|shorts)/.test(haystack)) return 2;
  return undefined;
}

function splitValues(value: string | null | undefined): string[] {
  return (
    value
      ?.split(/[,/|;]+/)
      .map((part) => part.trim())
      .filter(Boolean) ?? []
  );
}

function readString(metadata: Record<string, Json>, ...keys: string[]): string | undefined {
  for (const key of keys) {
    const value = metadata[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return undefined;
}

function readStringArray(metadata: Record<string, Json>, ...keys: string[]): string[] {
  for (const key of keys) {
    const value = metadata[key];
    if (typeof value === 'string') return splitValues(value);
    if (Array.isArray(value)) {
      return value.filter(
        (entry): entry is string => typeof entry === 'string' && Boolean(entry.trim()),
      );
    }
  }
  return [];
}

function readBoundedNumber(
  metadata: Record<string, Json>,
  key: string,
  minimum: number,
  maximum: number,
): number | undefined {
  const value = metadata[key];
  if (typeof value !== 'number' || !Number.isFinite(value)) return undefined;
  return Math.min(maximum, Math.max(minimum, value));
}

function clean(value: string | null | undefined): string | undefined {
  const normalized = value?.trim();
  return normalized || undefined;
}

function unique<T>(values: readonly T[]): T[] {
  return Array.from(new Set(values));
}

function isText(value: string | null | undefined): value is string {
  return Boolean(value);
}

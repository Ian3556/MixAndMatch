import type { WardrobeUpdate } from '@/services/wardrobeService';
import { normalizeColour, type MetadataValue } from '@/services/wardrobeMetadata';
import type { WardrobeItem } from '@/types/wardrobe';

export type WardrobeEditDraft = {
  brand: string;
  name: string;
  category: string;
  subcategory: string;
  color: string;
  material: string;
  season: string;
  occasion: string;
  size: string;
  imageUrl: string;
  notes: string;
};

export function draftFromWardrobeItem(item: WardrobeItem): WardrobeEditDraft {
  return {
    brand: item.brand ?? '',
    name: item.name,
    category: item.category,
    subcategory: item.subcategory ?? '',
    color: item.primaryColor ?? '',
    material: item.material ?? '',
    season: item.season ?? '',
    occasion: item.occasion ?? '',
    size: item.size ?? '',
    imageUrl: item.imageUrl ?? '',
    notes: item.notes ?? '',
  };
}

export function validateWardrobeEdit(draft: WardrobeEditDraft): string | null {
  if (!draft.name.trim() || draft.name.trim().length > 180) {
    return 'Enter an item name of 180 characters or fewer.';
  }
  if (!draft.category.trim()) return 'Select a category.';
  if (draft.brand.trim().length > 120) return 'Use 120 characters or fewer for the brand.';
  if (draft.notes.trim().length > 2000) return 'Use 2000 characters or fewer for notes.';
  if (draft.imageUrl.trim()) {
    try {
      const url = new URL(draft.imageUrl.trim());
      if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Invalid protocol');
    } catch {
      return 'Enter a valid HTTP or HTTPS image URL.';
    }
  }
  return null;
}

export function toWardrobeEditUpdate(item: WardrobeItem, draft: WardrobeEditDraft): WardrobeUpdate {
  const nullable = (value: string) => value.trim() || null;
  const imageUrl = nullable(draft.imageUrl);
  const fields: Partial<Record<MetadataValue, string | null>> = {
    brand: nullable(draft.brand),
    color: normalizeColour(draft.color),
    subcategory: nullable(draft.subcategory),
    material: nullable(draft.material),
    season: nullable(draft.season),
    occasion: nullable(draft.occasion),
  };
  const originalFields: Record<MetadataValue, string | null> = {
    brand: item.brand,
    color: item.primaryColor,
    subcategory: item.subcategory,
    material: item.material,
    season: item.season,
    occasion: item.occasion,
  };
  const suppressed = new Set(
    Array.isArray(item.metadata.metadataSuppressed)
      ? item.metadata.metadataSuppressed.filter(
          (value): value is MetadataValue => typeof value === 'string',
        )
      : [],
  );
  const sources =
    typeof item.metadata.metadataSources === 'object' &&
    item.metadata.metadataSources !== null &&
    !Array.isArray(item.metadata.metadataSources)
      ? { ...item.metadata.metadataSources }
      : {};
  for (const [key, value] of Object.entries(fields) as [MetadataValue, string | null][]) {
    if (value) {
      suppressed.delete(key);
      if (value !== originalFields[key]) sources[key] = 'user';
    } else {
      if (originalFields[key]) suppressed.add(key);
      delete sources[key];
    }
  }

  return {
    name: draft.name.trim(),
    category: draft.category.trim(),
    brand: fields.brand ?? null,
    subcategory: fields.subcategory ?? null,
    primary_color: fields.color ?? null,
    material: fields.material ?? null,
    season: fields.season ?? null,
    occasion: fields.occasion ?? null,
    size: nullable(draft.size),
    image_url: imageUrl,
    image_urls: imageUrl
      ? [imageUrl, ...item.imageUrls.filter((url) => url !== imageUrl)].slice(0, 24)
      : [],
    notes: nullable(draft.notes),
    metadata: {
      ...item.metadata,
      ...(item.description ? { productDescription: item.description } : {}),
      metadataSources: sources,
      metadataSuppressed: [...suppressed],
    },
  };
}

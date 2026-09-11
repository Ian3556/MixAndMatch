import type { CreateWardrobeItemInput, DraftWardrobeItem } from '@/types/wardrobe';
import { buildWardrobeInput } from '@/services/wardrobeNormalization';

export type ManualWardrobeItemErrors = Partial<
  Record<'category' | 'currency' | 'imageUrl' | 'name' | 'price', string>
>;

export function validateManualWardrobeItem(draft: DraftWardrobeItem): ManualWardrobeItemErrors {
  const errors: ManualWardrobeItemErrors = {};
  const name = draft.name.trim();
  const category = draft.category.trim();
  const imageUrl = draft.imageUrl.trim();
  const price = draft.price.trim();
  const currency = draft.currency.trim();

  if (!name) errors.name = 'Enter an item name.';
  else if (name.length > 180) errors.name = 'Use 180 characters or fewer.';

  if (!category) errors.category = 'Select a category.';

  if (imageUrl && !isPublicImageUrl(imageUrl)) {
    errors.imageUrl = 'Enter a valid HTTP or HTTPS image URL.';
  }

  if (price) {
    const parsedPrice = Number(price);
    if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
      errors.price = 'Enter a valid non-negative price.';
    }
  }

  if (currency && !/^[a-z]{3}$/i.test(currency)) {
    errors.currency = 'Use a three-letter currency code, such as MYR.';
  }

  return errors;
}

export function buildManualWardrobeInput(draft: DraftWardrobeItem): CreateWardrobeItemInput {
  return buildWardrobeInput(
    {
      sourceType: draft.sourceType,
      sourceUrl: optional(draft.sourceUrl),
      sourceDomain: hostname(draft.sourceUrl),
      externalProductId: null,
      catalogProductId: null,
      name: draft.name,
      category: draft.category,
      subcategory: optional(draft.subcategory),
      color: optional(draft.primaryColor),
      secondaryColor: optional(draft.secondaryColor),
      size: optional(draft.size),
      pattern: optional(draft.pattern),
      material: optional(draft.material),
      brand: optional(draft.brand),
      season: optional(draft.season),
      occasion: optional(draft.occasion),
      notes: optional(draft.notes),
      primaryImageUrl: optional(draft.imageUrl),
      price: draft.price.trim() ? Number(draft.price) : null,
      currency: optional(draft.currency),
      metadata: { entryMode: draft.sourceType === 'url_import' ? 'manual_fallback' : 'manual' },
    },
    draft.deduplicationKey,
    draft.isFavorite,
  );
}

export function createManualDeduplicationKey(): string {
  return `manual:${Date.now().toString(36)}:${Math.random().toString(36).slice(2)}`;
}

function isPublicImageUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return (url.protocol === 'http:' || url.protocol === 'https:') && Boolean(url.hostname);
  } catch {
    return false;
  }
}

function optional(value: string): string | null {
  const normalized = value.trim();
  return normalized || null;
}

function hostname(value: string): string | null {
  if (!value.trim()) return null;
  try {
    return new URL(value).hostname.toLowerCase();
  } catch {
    return null;
  }
}

import { OCCASION_FORMALITY } from '../data/occasionRules';
import type { Outfit, RejectedCandidate, StyleProfile, StylingRequest } from '../types';
import { getOutfitItems } from '../types';
import type { PreferenceModel } from '../personalization/preferenceModel';

export type ConstraintResult = { valid: true } | { valid: false; rejection: RejectedCandidate };

export function validateOutfitConstraints(
  outfit: Outfit,
  request: StylingRequest,
  profile: StyleProfile,
  preferenceModel: PreferenceModel,
): ConstraintResult {
  const items = getOutfitItems(outfit);
  const itemIds = new Set(items.map((item) => item.id));
  const excluded = new Set(request.excludedItems ?? []);
  const dislikedItems = new Set(profile.dislikedItems ?? []);
  const dislikedCategories = new Set(profile.dislikedCategories ?? []);
  const neverRecommend = new Set(preferenceModel.neverRecommendItemIds);

  for (const selectedId of request.selectedItems ?? []) {
    if (!itemIds.has(selectedId)) {
      return reject(
        outfit,
        'SELECTED_ITEM_MISSING',
        selectedId,
        'A selected wardrobe item is absent.',
      );
    }
  }
  for (const item of items) {
    if (excluded.has(item.id)) return reject(outfit, 'EXCLUDED_ITEM', item.id);
    if (dislikedItems.has(item.id) || neverRecommend.has(item.id)) {
      return reject(outfit, 'NEVER_RECOMMEND', item.id);
    }
    if (dislikedCategories.has(item.category)) {
      return reject(outfit, 'AVOIDED_CATEGORY', item.id, item.category);
    }
    if (item.primaryColor && profile.avoidedColors.includes(item.primaryColor)) {
      return reject(outfit, 'AVOIDED_COLOR', item.id, item.primaryColor);
    }
  }

  const hot =
    (request.temperature !== undefined && request.temperature >= 28) || request.weather === 'hot';
  if (hot && outfit.outerwear && (outfit.outerwear.warmth ?? 0) >= 8) {
    return reject(
      outfit,
      'OUTERWEAR_TOO_WARM',
      outfit.outerwear.id,
      request.temperature === undefined ? 'Hot weather' : `${request.temperature}°C`,
    );
  }

  const requestedFormality =
    request.formality ?? (request.occasion ? OCCASION_FORMALITY[request.occasion] : undefined);
  if (requestedFormality !== undefined && requestedFormality >= 8) {
    const unsuitable = items.find((item) => item.formality !== undefined && item.formality <= 2);
    if (unsuitable) {
      return reject(outfit, 'FORMALITY_MISMATCH', unsuitable.id, unsuitable.name);
    }
  }

  return { valid: true };
}

function reject(
  outfit: Outfit,
  reason: RejectedCandidate['reason'],
  itemId?: string,
  detail?: string,
): ConstraintResult {
  return {
    valid: false,
    rejection: {
      outfitId: outfit.id,
      reason,
      ...(itemId ? { itemId } : {}),
      ...(detail ? { detail } : {}),
    },
  };
}

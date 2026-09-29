import { normalizeWardrobe } from '../engine/normalizeClothingItem';
import {
  getStylingRecommendations,
  type StylingRecommendationInput,
} from '../engine/recommendationEngine';
import type { StylistUserState } from '@/services/stylistPersistence';
import type { StylingRequest } from '../types';

export const FIRST_OUTFIT_REQUEST: StylingRequest = { occasion: 'Everyday' };

export type FirstOutfitProgress =
  | { stage: 'complete' }
  | { stage: 'add'; category: 'Tops' | 'Bottoms'; title: string; message: string }
  | { stage: 'blocked'; title: string; message: string }
  | { stage: 'ready'; title: string; message: string };

export function getFirstOutfitProgress(
  input: Omit<StylingRecommendationInput, 'request'>,
  activity: Pick<StylistUserState, 'savedLooks' | 'feedbackByOutfit'>,
): FirstOutfitProgress {
  if (
    activity.savedLooks.length ||
    Object.values(activity.feedbackByOutfit).some((entry) => entry.woreAt)
  ) {
    return { stage: 'complete' };
  }
  const categories = new Set(normalizeWardrobe(input.wardrobe).map((item) => item.category));
  if (!categories.has('dress') && (!categories.has('top') || !categories.has('bottom'))) {
    const category = categories.has('top') ? 'Bottoms' : 'Tops';
    return {
      stage: 'add',
      category,
      title: input.wardrobe.length
        ? `Add ${category === 'Tops' ? 'a top' : 'a bottom'} to make a look.`
        : 'Your first outfit starts here.',
      message:
        'Use clothes you own. Start with a top and a bottom, or one dress. Shoes and accessories are optional. A name and category are enough to begin.',
    };
  }
  const result = getStylingRecommendations({ ...input, request: FIRST_OUTFIT_REQUEST, limit: 1 });
  if (!result.recommendations.length)
    return {
      stage: 'blocked',
      title: 'Add another combination.',
      message:
        'Your current pieces do not form a look that meets your colour preferences and item exclusions. Add another top, bottom, or dress, or review your colour preferences.',
    };
  return {
    stage: 'ready',
    title: 'Ready for your first look.',
    message:
      'Create an everyday outfit from your wardrobe, then save a look you would wear or mark it as worn. You can refine the brief afterwards.',
  };
}

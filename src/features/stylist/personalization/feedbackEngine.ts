import type { Outfit } from '../types';
import {
  getOutfitPreferenceSignals,
  setNeverRecommendItem,
  updateLearnedPreferences,
  type PreferenceModel,
} from './preferenceModel';

export type StylingFeedbackAction =
  'like' | 'dislike' | 'save' | 'wore' | 'regenerate' | 'never-recommend';

const FEEDBACK_DELTAS: Record<Exclude<StylingFeedbackAction, 'never-recommend'>, number> = {
  like: 0.18,
  dislike: -0.14,
  save: 0.12,
  wore: 0.24,
  regenerate: -0.04,
};

export function applyOutfitFeedback(
  model: PreferenceModel,
  outfit: Outfit,
  action: Exclude<StylingFeedbackAction, 'never-recommend'>,
  scale = 1,
): PreferenceModel {
  return updateLearnedPreferences(
    model,
    getOutfitPreferenceSignals(outfit),
    FEEDBACK_DELTAS[action] * scale,
  );
}

export function applyNeverRecommendFeedback(
  model: PreferenceModel,
  itemId: string,
): PreferenceModel {
  return setNeverRecommendItem(
    updateLearnedPreferences(model, [{ type: 'item', value: itemId }], -1),
    itemId,
  );
}

import { DEFAULT_MAX_CANDIDATES, DEFAULT_RECOMMENDATION_COUNT } from '../data/stylingWeights';
import { explainOutfit } from '../explanations/outfitExplanation';
import { EMPTY_PREFERENCE_MODEL, type PreferenceModel } from '../personalization/preferenceModel';
import { EMPTY_WARDROBE_HISTORY, type WardrobeHistory } from '../personalization/wardrobeHistory';
import type {
  ClothingItem,
  RejectedCandidate,
  StyleProfile,
  StylingEngineResult,
  StylingRecommendation,
  StylingRequest,
} from '../types';
import type { StyleProfile as AccountStyleProfile } from '@/types/profile';
import type { WardrobeItem } from '@/types/wardrobe';
import { generateOutfitCandidates } from './candidateGenerator';
import { validateOutfitConstraints } from './compatibilityEngine';
import { selectDiverseRecommendations } from './diversityEngine';
import { normalizeWardrobe } from './normalizeClothingItem';
import { normalizeStyleProfile } from './normalizeStyleProfile';
import { normalizeStylingRequest } from './normalizeStylingRequest';
import { scoreOutfit } from './scoringEngine';

export type StylingRecommendationInput = {
  wardrobe: readonly WardrobeItem[];
  styleProfile?: AccountStyleProfile | null;
  request?: StylingRequest;
  history?: WardrobeHistory;
  preferenceModel?: PreferenceModel;
  limit?: number;
  maxCandidates?: number;
  now?: Date;
};

export type NormalizedStylingRecommendationInput = Omit<
  StylingRecommendationInput,
  'wardrobe' | 'styleProfile'
> & {
  wardrobe: readonly ClothingItem[];
  styleProfile?: StyleProfile;
};

export function getStylingRecommendations(input: StylingRecommendationInput): StylingEngineResult {
  return getNormalizedStylingRecommendations({
    ...input,
    wardrobe: normalizeWardrobe(input.wardrobe),
    styleProfile: normalizeStyleProfile(input.styleProfile),
  });
}

export function getNormalizedStylingRecommendations({
  wardrobe,
  styleProfile = {
    preferredStyles: [],
    favoriteColors: [],
    avoidedColors: [],
    preferredFits: [],
    preferredOccasions: [],
    dislikedCategories: [],
    dislikedItems: [],
  },
  request: rawRequest = {},
  history = EMPTY_WARDROBE_HISTORY,
  preferenceModel = EMPTY_PREFERENCE_MODEL,
  limit = DEFAULT_RECOMMENDATION_COUNT,
  maxCandidates = DEFAULT_MAX_CANDIDATES,
  now = new Date(),
}: NormalizedStylingRecommendationInput): StylingEngineResult {
  const request = normalizeStylingRequest({
    ...rawRequest,
    excludedItems: Array.from(
      new Set([...(rawRequest.excludedItems ?? []), ...preferenceModel.neverRecommendItemIds]),
    ),
  });
  const candidates = generateOutfitCandidates({
    wardrobe,
    request,
    styleProfile,
    maxCandidates: Math.min(DEFAULT_MAX_CANDIDATES, Math.max(1, maxCandidates)),
  });
  const rejectedCandidates: RejectedCandidate[] = [];
  for (const itemId of rawRequest.excludedItems ?? []) {
    if (wardrobe.some((item) => item.id === itemId)) {
      rejectedCandidates.push({ outfitId: 'prefilter', itemId, reason: 'EXCLUDED_ITEM' });
    }
  }
  for (const itemId of preferenceModel.neverRecommendItemIds) {
    if (wardrobe.some((item) => item.id === itemId)) {
      rejectedCandidates.push({ outfitId: 'prefilter', itemId, reason: 'NEVER_RECOMMEND' });
    }
  }
  for (const category of styleProfile.dislikedCategories ?? []) {
    for (const item of wardrobe.filter((candidate) => candidate.category === category)) {
      rejectedCandidates.push({
        outfitId: 'prefilter',
        itemId: item.id,
        reason: 'AVOIDED_CATEGORY',
        detail: category,
      });
    }
  }
  const validCandidates = candidates.filter((candidate) => {
    const result = validateOutfitConstraints(candidate, request, styleProfile, preferenceModel);
    if (!result.valid) rejectedCandidates.push(result.rejection);
    return result.valid;
  });
  if (candidates.length === 0) {
    for (const selectedId of request.selectedItems ?? []) {
      if (!wardrobe.some((item) => item.id === selectedId)) {
        rejectedCandidates.push({
          outfitId: 'request',
          itemId: selectedId,
          reason: 'SELECTED_ITEM_MISSING',
          detail: 'The selected item is not available in the current wardrobe.',
        });
      }
    }
  }

  const ranked = validCandidates
    .map((candidate) =>
      scoreOutfit(candidate, { request, styleProfile, preferenceModel, history, now }),
    )
    .sort((left, right) => right.score - left.score || left.id.localeCompare(right.id));
  const explained: StylingRecommendation[] = ranked.map((outfit) => {
    const explanation = explainOutfit(outfit, request, styleProfile);
    return {
      outfit: { ...outfit, explanation },
      score: outfit.score,
      explanation,
      scoreBreakdown: outfit.scoreBreakdown,
    };
  });
  const recommendations = selectDiverseRecommendations(explained, Math.min(12, Math.max(1, limit)));

  return {
    recommendations,
    diagnostics: {
      normalizedItemCount: wardrobe.length,
      candidateCount: candidates.length,
      validCandidateCount: validCandidates.length,
      rejectedCandidates: rejectedCandidates.slice(0, 100),
      rankedCandidates: ranked.slice(0, 100).map((outfit) => ({
        outfitId: outfit.id,
        score: outfit.score,
        scoreBreakdown: outfit.scoreBreakdown,
      })),
    },
  };
}

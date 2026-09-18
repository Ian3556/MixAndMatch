import { STYLING_WEIGHTS } from '../data/stylingWeights';
import type { Outfit, OutfitScoreBreakdown, StyleProfile, StylingRequest } from '../types';
import type { PreferenceModel } from '../personalization/preferenceModel';
import { scoreUserPreference } from '../personalization/preferenceModel';
import type { WardrobeHistory } from '../personalization/wardrobeHistory';
import { scoreOutfitNovelty, scoreWardrobeRotation } from '../personalization/wardrobeHistory';
import { colorCompatibility } from './colorEngine';
import { occasionCompatibility } from './occasionEngine';
import { silhouetteCompatibility } from './silhouetteEngine';
import { styleCompatibility } from './styleCompatibilityEngine';
import { weatherCompatibility } from './weatherEngine';

export type ScoringContext = {
  request: StylingRequest;
  styleProfile: StyleProfile;
  preferenceModel: PreferenceModel;
  history: WardrobeHistory;
  now: Date;
};

export function scoreOutfit(outfit: Outfit, context: ScoringContext): Outfit {
  const scoreBreakdown: OutfitScoreBreakdown = {
    style: roundScore(styleCompatibility(outfit, context.request, context.styleProfile)),
    color: roundScore(colorCompatibility(outfit)),
    occasion: roundScore(occasionCompatibility(outfit, context.request)),
    silhouette: roundScore(silhouetteCompatibility(outfit)),
    weather: roundScore(weatherCompatibility(outfit, context.request)),
    preference: roundScore(
      scoreUserPreference(outfit, context.styleProfile, context.preferenceModel),
    ),
    rotation: roundScore(scoreWardrobeRotation(outfit, context.history, context.now)),
    novelty: roundScore(scoreOutfitNovelty(outfit, context.history, context.now)),
  };
  const score = (Object.keys(STYLING_WEIGHTS) as (keyof OutfitScoreBreakdown)[]).reduce(
    (total, key) => total + scoreBreakdown[key] * STYLING_WEIGHTS[key],
    0,
  );
  return { ...outfit, score: Math.round(score * 10) / 10, scoreBreakdown };
}

function roundScore(score: number): number {
  return Math.round(Math.min(100, Math.max(0, score)) * 10) / 10;
}

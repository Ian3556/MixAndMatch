import type { OutfitScoreBreakdown } from '../types';

export const STYLING_WEIGHTS: Record<keyof OutfitScoreBreakdown, number> = {
  style: 0.25,
  color: 0.2,
  occasion: 0.15,
  silhouette: 0.1,
  weather: 0.1,
  preference: 0.1,
  rotation: 0.05,
  novelty: 0.05,
};

export const DEFAULT_MAX_CANDIDATES = 240;
export const DEFAULT_RECOMMENDATION_COUNT = 3;

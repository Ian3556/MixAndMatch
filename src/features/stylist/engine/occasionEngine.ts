import { areOccasionsRelated, OCCASION_FORMALITY } from '../data/occasionRules';
import type { Outfit, StylingRequest } from '../types';
import { getOutfitItems } from '../types';

export function occasionCompatibility(outfit: Outfit, request: StylingRequest): number {
  const requestedOccasion = request.occasion;
  const requestedFormality =
    request.formality ?? (requestedOccasion ? OCCASION_FORMALITY[requestedOccasion] : undefined);
  if (!requestedOccasion && requestedFormality === undefined) return 70;

  const items = getOutfitItems(outfit);
  const occasionScores = requestedOccasion
    ? items
        .filter((item) => (item.occasions?.length ?? 0) > 0)
        .map((item) => {
          if (item.occasions?.includes(requestedOccasion)) return 100;
          if (
            item.occasions?.some((occasion) => areOccasionsRelated(occasion, requestedOccasion))
          ) {
            return 82;
          }
          return 48;
        })
    : [];
  const formalityScores =
    requestedFormality === undefined
      ? []
      : items
          .filter((item) => item.formality !== undefined)
          .map((item) =>
            Math.max(20, 100 - Math.abs((item.formality ?? 5) - requestedFormality) * 11),
          );

  if (occasionScores.length === 0 && formalityScores.length === 0) return 60;
  if (occasionScores.length === 0) return average(formalityScores);
  if (formalityScores.length === 0) return average(occasionScores);
  return average(occasionScores) * 0.65 + average(formalityScores) * 0.35;
}

function average(values: readonly number[]): number {
  return values.reduce((total, value) => total + value, 0) / values.length;
}

import type { StylingRecommendation } from '../types';
import { getOutfitItems } from '../types';

export function selectDiverseRecommendations(
  rankedCandidates: readonly StylingRecommendation[],
  count = 3,
  maximumSimilarity = 0.49,
): StylingRecommendation[] {
  if (count <= 0) return [];
  const selected: StylingRecommendation[] = [];
  const deferred: StylingRecommendation[] = [];
  for (const candidate of rankedCandidates) {
    const candidateItems = new Set(getOutfitItems(candidate.outfit).map((item) => item.id));
    const isDistinct = selected.every((current) => {
      const currentItems = new Set(getOutfitItems(current.outfit).map((item) => item.id));
      return jaccard(candidateItems, currentItems) <= maximumSimilarity;
    });
    if (isDistinct) selected.push(candidate);
    else deferred.push(candidate);
    if (selected.length >= count) return selected;
  }

  for (const candidate of deferred) {
    if (selected.length >= count) break;
    selected.push(candidate);
  }
  return selected;
}

function jaccard(left: ReadonlySet<string>, right: ReadonlySet<string>): number {
  const intersection = [...left].filter((value) => right.has(value)).length;
  const union = new Set([...left, ...right]).size;
  return union === 0 ? 0 : intersection / union;
}

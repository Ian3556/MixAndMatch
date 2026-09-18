export { generateOutfitCandidates } from './candidateGenerator';
export { validateOutfitConstraints } from './compatibilityEngine';
export { formatRejection, formatStylingDiagnostics } from './debugDiagnostics';
export { selectDiverseRecommendations } from './diversityEngine';
export { normalizeClothingItem, normalizeWardrobe } from './normalizeClothingItem';
export { normalizeStyleProfile } from './normalizeStyleProfile';
export { normalizeStylingRequest } from './normalizeStylingRequest';
export {
  getNormalizedStylingRecommendations,
  getStylingRecommendations,
} from './recommendationEngine';
export { scoreOutfit } from './scoringEngine';

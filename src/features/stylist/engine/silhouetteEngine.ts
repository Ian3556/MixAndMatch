import { FIT_COMPATIBILITY } from '../data/silhouetteRules';
import type { Outfit } from '../types';

export function silhouetteCompatibility(outfit: Outfit): number {
  if (outfit.dress) {
    const dressFit = outfit.dress.fit ?? outfit.dress.silhouette;
    const outerFit = outfit.outerwear?.fit ?? outfit.outerwear?.silhouette;
    return dressFit && outerFit ? scoreFitPair(dressFit, outerFit) : 70;
  }
  const topFit = outfit.top?.fit ?? outfit.top?.silhouette;
  const bottomFit = outfit.bottom?.fit ?? outfit.bottom?.silhouette;
  if (!topFit || !bottomFit) return 65;
  return scoreFitPair(topFit, bottomFit);
}

function scoreFitPair(top: string, bottom: string): number {
  if (top === bottom) return ['oversized', 'wide', 'loose'].includes(top) ? 74 : 86;
  if (FIT_COMPATIBILITY[top]?.includes(bottom) || FIT_COMPATIBILITY[bottom]?.includes(top))
    return 92;
  return 62;
}

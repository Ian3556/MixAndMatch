import type { Outfit, StylingRequest } from '../types';
import { getOutfitItems } from '../types';

export function weatherCompatibility(outfit: Outfit, request: StylingRequest): number {
  const items = getOutfitItems(outfit);
  const scores: number[] = [];
  const targetWarmth = getTargetWarmth(request.temperature, request.weather);

  if (targetWarmth !== undefined) {
    for (const item of items) {
      if (item.warmth === undefined) continue;
      scores.push(Math.max(10, 100 - Math.abs(item.warmth - targetWarmth) * 15));
    }
  }

  if (request.season) {
    const seasonal = items.filter((item) => (item.seasons?.length ?? 0) > 0);
    for (const item of seasonal) scores.push(item.seasons?.includes(request.season) ? 100 : 55);
  }

  if (request.weather === 'rain' || request.weather === 'rainy') {
    scores.push(outfit.outerwear ? 82 : 60);
  }

  return scores.length > 0 ? average(scores) : 65;
}

export function getTargetWarmth(
  temperature: number | undefined,
  weather: string | undefined,
): number | undefined {
  if (temperature !== undefined) {
    if (temperature >= 30) return 1.5;
    if (temperature >= 25) return 3;
    if (temperature >= 19) return 4.5;
    if (temperature >= 13) return 6;
    if (temperature >= 6) return 7.5;
    return 9;
  }
  if (weather === 'hot') return 2;
  if (weather === 'warm') return 3.5;
  if (weather === 'mild') return 5;
  if (weather === 'cool') return 6.5;
  if (weather === 'cold') return 8.5;
  return undefined;
}

function average(values: readonly number[]): number {
  return values.reduce((total, value) => total + value, 0) / values.length;
}

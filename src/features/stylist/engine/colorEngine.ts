import { COLOR_WHEEL, NEUTRAL_COLORS, type ColorFamily } from '../data/colorRules';
import type { Outfit } from '../types';
import { getOutfitItems } from '../types';

export type ColorRelationship =
  'neutral' | 'monochromatic' | 'analogous' | 'complementary' | 'balanced';

export function colorCompatibility(outfit: Outfit): number {
  const colors = getOutfitItems(outfit)
    .flatMap((item) => [item.primaryColor, ...(item.secondaryColors ?? [])])
    .filter((color): color is string => Boolean(color));
  if (colors.length < 2) return 65;

  const scores: number[] = [];
  for (let left = 0; left < colors.length; left += 1) {
    for (let right = left + 1; right < colors.length; right += 1) {
      const first = colors[left];
      const second = colors[right];
      if (first && second) scores.push(scoreColorPair(first, second));
    }
  }
  return average(scores, 65);
}

export function describeColorRelationship(outfit: Outfit): ColorRelationship {
  const colors = Array.from(
    new Set(
      getOutfitItems(outfit)
        .map((item) => item.primaryColor)
        .filter((color): color is string => Boolean(color)),
    ),
  );
  if (colors.length <= 1) return 'monochromatic';
  if (colors.every((color) => NEUTRAL_COLORS.has(color as ColorFamily))) return 'neutral';
  if (colors.some((color) => NEUTRAL_COLORS.has(color as ColorFamily))) return 'balanced';
  const distances = pairDistances(colors);
  if (distances.some((distance) => distance === 1 || distance === COLOR_WHEEL.length - 1))
    return 'analogous';
  if (distances.some((distance) => distance === COLOR_WHEEL.length / 2)) return 'complementary';
  return 'balanced';
}

function scoreColorPair(left: string, right: string): number {
  if (left === right) return 94;
  const leftNeutral = NEUTRAL_COLORS.has(left as ColorFamily);
  const rightNeutral = NEUTRAL_COLORS.has(right as ColorFamily);
  if (leftNeutral && rightNeutral) return 90;
  if (leftNeutral || rightNeutral) return 87;
  const leftIndex = COLOR_WHEEL.indexOf(left as ColorFamily);
  const rightIndex = COLOR_WHEEL.indexOf(right as ColorFamily);
  if (leftIndex < 0 || rightIndex < 0) return 65;
  const distance = Math.abs(leftIndex - rightIndex);
  if (distance === 1 || distance === COLOR_WHEEL.length - 1) return 84;
  if (distance === COLOR_WHEEL.length / 2) return 80;
  return 68;
}

function pairDistances(colors: readonly string[]): number[] {
  const distances: number[] = [];
  for (let left = 0; left < colors.length; left += 1) {
    for (let right = left + 1; right < colors.length; right += 1) {
      const leftIndex = COLOR_WHEEL.indexOf(colors[left] as ColorFamily);
      const rightIndex = COLOR_WHEEL.indexOf(colors[right] as ColorFamily);
      if (leftIndex >= 0 && rightIndex >= 0) distances.push(Math.abs(leftIndex - rightIndex));
    }
  }
  return distances;
}

function average(values: readonly number[], fallback: number): number {
  return values.length > 0
    ? values.reduce((total, value) => total + value, 0) / values.length
    : fallback;
}

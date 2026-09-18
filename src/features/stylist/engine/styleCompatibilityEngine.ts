import { areStylesRelated } from '../data/styleRules';
import type { Outfit, StyleProfile, StylingRequest } from '../types';
import { getOutfitItems } from '../types';

export function styleCompatibility(
  outfit: Outfit,
  request: StylingRequest,
  profile: StyleProfile,
): number {
  const itemStyleGroups = getOutfitItems(outfit)
    .map((item) => item.styles ?? [])
    .filter((styles) => styles.length > 0);
  const desired = Array.from(
    new Set([...(request.desiredStyle ?? []), ...profile.preferredStyles]),
  );
  const allStyles = Array.from(new Set(itemStyleGroups.flat()));
  if (allStyles.length === 0) return 60;

  const pairScores: number[] = [];
  for (let left = 0; left < itemStyleGroups.length; left += 1) {
    for (let right = left + 1; right < itemStyleGroups.length; right += 1) {
      const first = itemStyleGroups[left] ?? [];
      const second = itemStyleGroups[right] ?? [];
      const exact = first.some((style) => second.includes(style));
      const related = first.some((style) =>
        second.some((candidate) => areStylesRelated(style, candidate)),
      );
      pairScores.push(exact ? 95 : related ? 82 : 58);
    }
  }
  const cohesion = pairScores.length > 0 ? average(pairScores) : 70;
  if (desired.length === 0) return cohesion;
  const requestMatch = desired.some((style) => allStyles.includes(style))
    ? 100
    : desired.some((style) => allStyles.some((candidate) => areStylesRelated(style, candidate)))
      ? 82
      : 48;
  return cohesion * 0.55 + requestMatch * 0.45;
}

function average(values: readonly number[]): number {
  return values.reduce((total, value) => total + value, 0) / values.length;
}

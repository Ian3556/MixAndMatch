import { normalizeColor, normalizeToken } from '../data/colorRules';
import type { StyleProfile } from '../types';
import type { StyleProfile as AccountStyleProfile } from '@/types/profile';

export function normalizeStyleProfile(
  profile: AccountStyleProfile | null | undefined,
): StyleProfile {
  if (!profile) {
    return {
      preferredStyles: [],
      favoriteColors: [],
      avoidedColors: [],
      preferredFits: [],
      preferredOccasions: [],
      dislikedCategories: [],
      dislikedItems: [],
    };
  }

  return {
    preferredStyles: normalizeTokens(profile.preferredStyles),
    favoriteColors: profile.favoriteColors.map(normalizeColor).filter(isText),
    avoidedColors: profile.avoidColors.map(normalizeColor).filter(isText),
    preferredFits: normalizeTokens(profile.fitPreferences),
    preferredOccasions: normalizeTokens(profile.occasions),
    dislikedCategories: [],
    dislikedItems: [],
  };
}

function normalizeTokens(values: readonly string[]): string[] {
  return Array.from(new Set(values.map(normalizeToken).filter(isText)));
}

function isText(value: string | undefined): value is string {
  return Boolean(value);
}

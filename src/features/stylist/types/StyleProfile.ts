export type StyleProfile = {
  preferredStyles: string[];
  favoriteColors: string[];
  avoidedColors: string[];
  preferredFits: string[];
  preferredOccasions?: string[];
  dislikedCategories?: string[];
  dislikedItems?: string[];
};

export const EMPTY_STYLE_PROFILE: StyleProfile = {
  preferredStyles: [],
  favoriteColors: [],
  avoidedColors: [],
  preferredFits: [],
  preferredOccasions: [],
  dislikedCategories: [],
  dislikedItems: [],
};

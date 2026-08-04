/** Deterministic Phase 2 UI fixtures. Replace with product taxonomy data in a later phase. */
export type CategoryFixture = {
  id: string;
  label: string;
  symbol: string;
  tone: string;
};

export const wardrobeCategories: readonly CategoryFixture[] = [
  { id: 'all', label: 'All', symbol: 'All', tone: '#DDD8FF' },
  { id: 'tops', label: 'Tops', symbol: 'T', tone: '#DCEBFF' },
  { id: 'bottoms', label: 'Bottoms', symbol: 'B', tone: '#E7E0D8' },
  { id: 'dresses', label: 'Dresses', symbol: 'D', tone: '#FFE0E8' },
  { id: 'outerwear', label: 'Outerwear', symbol: 'O', tone: '#E3E7DC' },
  { id: 'shoes', label: 'Shoes', symbol: 'S', tone: '#F1E2CF' },
  { id: 'bags', label: 'Bags', symbol: 'Bg', tone: '#E1E9DF' },
  { id: 'accessories', label: 'Accessories', symbol: 'A', tone: '#F4E2F3' },
] as const;

export const styleCategories = [
  'Casual',
  'Smart Casual',
  'Formal',
  'Streetwear',
  'Minimal',
  'Vintage',
  'Business',
  'Travel',
] as const;

export const exploreStyles = [
  'Minimalist',
  'Classic',
  'Streetwear',
  'Old Money',
  'Y2K',
  'Business Casual',
  'Korean Inspired',
  'Japanese Minimal',
  'Travel',
  'Evening',
] as const;

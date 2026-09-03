import type { EditorialImageSource } from '@/features/home/types/editorial';

export const EXPLORE_CATEGORY_OPTIONS = [
  { id: 'tops', label: 'Tops' },
  { id: 'bottoms', label: 'Bottoms' },
  { id: 'outerwear', label: 'Outerwear' },
  { id: 'dresses', label: 'Dresses' },
  { id: 'footwear', label: 'Footwear' },
  { id: 'accessories', label: 'Accessories' },
] as const;

export const EXPLORE_STYLE_OPTIONS = [
  'Old Money',
  'Streetwear',
  'Minimalist',
  'Smart Casual',
  'City Walk',
  'Vintage',
  'Casual',
  'Formal',
] as const;

export type ExploreCategoryId = (typeof EXPLORE_CATEGORY_OPTIONS)[number]['id'];
export type ExploreStyle = (typeof EXPLORE_STYLE_OPTIONS)[number];

export type ExploreDiscoveryItem = {
  id: string;
  title: string;
  aesthetic: string;
  style: ExploreStyle;
  categoryIds: readonly ExploreCategoryId[];
  tags: readonly string[];
  image: EditorialImageSource;
  imageAlt: string;
  imageAspectRatio: number;
  inspirationId: string;
};

export type ExploreFilterCriteria = {
  query: string;
  categoryIds: readonly ExploreCategoryId[];
  styles: readonly ExploreStyle[];
};

import type { ClothingItem } from './ClothingItem';

export type OutfitScoreBreakdown = {
  style: number;
  color: number;
  occasion: number;
  silhouette: number;
  weather: number;
  preference: number;
  rotation: number;
  novelty: number;
};

export type Outfit = {
  id: string;
  top?: ClothingItem;
  bottom?: ClothingItem;
  dress?: ClothingItem;
  shoes?: ClothingItem;
  outerwear?: ClothingItem;
  accessories?: ClothingItem[];
  score: number;
  scoreBreakdown: OutfitScoreBreakdown;
  explanation?: string;
};

export function getOutfitItems(outfit: Outfit): ClothingItem[] {
  return [
    outfit.top,
    outfit.bottom,
    outfit.dress,
    outfit.shoes,
    outfit.outerwear,
    ...(outfit.accessories ?? []),
  ].filter((item): item is ClothingItem => Boolean(item));
}

export function getOutfitSignature(outfit: Outfit): string {
  return getOutfitItems(outfit)
    .map((item) => item.id)
    .sort()
    .join('|');
}

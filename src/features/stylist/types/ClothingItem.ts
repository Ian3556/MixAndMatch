export type ClothingCategory =
  'top' | 'bottom' | 'shoes' | 'outerwear' | 'accessory' | 'dress' | 'other';

export type ClothingItem = {
  id: string;
  name: string;
  category: ClothingCategory;
  subcategory?: string;
  primaryColor?: string;
  secondaryColors?: string[];
  pattern?: string;
  material?: string;
  fit?: string;
  silhouette?: string;
  styles?: string[];
  occasions?: string[];
  seasons?: string[];
  formality?: number;
  warmth?: number;
  imageUrl?: string;
  brand?: string;
};

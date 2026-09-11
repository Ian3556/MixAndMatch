import type { Json } from '@/types/database';

export type ClothingSource = 'catalog' | 'url_import' | 'manual';

export type NormalizedClothingItem = {
  catalogProductId?: string | null;
  sourceType: ClothingSource;
  sourceUrl?: string | null;
  sourceDomain?: string | null;
  externalProductId?: string | null;
  brand?: string | null;
  name: string;
  category: string;
  subcategory?: string | null;
  color?: string | null;
  secondaryColor?: string | null;
  size?: string | null;
  pattern?: string | null;
  material?: string | null;
  season?: string | null;
  occasion?: string | null;
  notes?: string | null;
  primaryImageUrl?: string | null;
  imageUrls?: string[];
  price?: number | null;
  currency?: string | null;
  metadata?: Record<string, Json>;
};

export type DraftWardrobeItem = {
  deduplicationKey: string;
  imageKey: string;
  imageUrl: string;
  name: string;
  category: string;
  subcategory: string;
  primaryColor: string;
  secondaryColor: string;
  size: string;
  pattern: string;
  material: string;
  brand: string;
  season: string;
  occasion: string;
  notes: string;
  price: string;
  currency: string;
  isFavorite: boolean;
  sourceType: ClothingSource;
  sourceUrl: string;
};

export type ManualWardrobeItemPrefill = Partial<
  Omit<DraftWardrobeItem, 'deduplicationKey' | 'imageKey' | 'isFavorite'>
>;

export type WardrobeItem = {
  id: string;
  userId: string;
  catalogProductId: string | null;
  name: string;
  category: string;
  subcategory: string | null;
  primaryColor: string | null;
  secondaryColor: string | null;
  size: string | null;
  pattern: string | null;
  material: string | null;
  brand: string | null;
  season: string | null;
  occasion: string | null;
  notes: string | null;
  isFavorite: boolean;
  imageUrl: string | null;
  imageUrls: string[];
  sourceUrl: string | null;
  sourceDomain: string | null;
  externalProductId: string | null;
  price: number | null;
  currency: string | null;
  importMethod: 'catalog' | 'manual' | 'website-url';
  sourceType: ClothingSource;
  metadata: Record<string, Json>;
  deduplicationKey: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateWardrobeItemInput = {
  catalogProductId?: string | null;
  name: string;
  category: string;
  subcategory?: string | null;
  primaryColor?: string | null;
  secondaryColor?: string | null;
  size?: string | null;
  pattern?: string | null;
  material?: string | null;
  brand?: string | null;
  season?: string | null;
  occasion?: string | null;
  notes?: string | null;
  isFavorite?: boolean;
  imageUrl?: string | null;
  imageUrls?: string[];
  sourceUrl?: string | null;
  sourceDomain?: string | null;
  externalProductId?: string | null;
  price?: number | null;
  currency?: string | null;
  importMethod: 'catalog' | 'manual' | 'website-url';
  sourceType: ClothingSource;
  metadata?: Record<string, Json>;
  deduplicationKey: string;
};

export type WardrobeItemSaveResult =
  | { input: CreateWardrobeItemInput; status: 'added'; item: WardrobeItem }
  | { input: CreateWardrobeItemInput; status: 'duplicate' }
  | { input: CreateWardrobeItemInput; status: 'failed'; message: string };

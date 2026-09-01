export type DraftWardrobeItem = {
  imageKey: string;
  name: string;
  category: string;
  subcategory: string;
  primaryColor: string;
  secondaryColor: string;
  pattern: string;
  material: string;
  brand: string;
  season: string;
  occasion: string;
  notes: string;
  isFavorite: boolean;
};

export type WardrobeItem = {
  id: string;
  userId: string;
  catalogProductId: string | null;
  name: string;
  category: string;
  subcategory: string | null;
  primaryColor: string | null;
  secondaryColor: string | null;
  pattern: string | null;
  material: string | null;
  brand: string | null;
  season: string | null;
  occasion: string | null;
  notes: string | null;
  isFavorite: boolean;
  imageUrl: string | null;
  sourceUrl: string | null;
  sourceDomain: string | null;
  externalProductId: string | null;
  price: number | null;
  currency: string | null;
  importMethod: 'manual' | 'website-url';
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
  pattern?: string | null;
  material?: string | null;
  brand?: string | null;
  season?: string | null;
  occasion?: string | null;
  notes?: string | null;
  isFavorite?: boolean;
  imageUrl?: string | null;
  sourceUrl?: string | null;
  sourceDomain?: string | null;
  externalProductId?: string | null;
  price?: number | null;
  currency?: string | null;
  importMethod: 'manual' | 'website-url';
  deduplicationKey: string;
};

export type WardrobeItemSaveResult =
  | { input: CreateWardrobeItemInput; status: 'added'; item: WardrobeItem }
  | { input: CreateWardrobeItemInput; status: 'duplicate' }
  | { input: CreateWardrobeItemInput; status: 'failed'; message: string };

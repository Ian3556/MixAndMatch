/** Development-only wardrobe fixtures. Replace with a user-owned wardrobe repository. */
export type WardrobeItemFixture = {
  id: string;
  name: string;
  category: string;
  color: string;
  material: string;
  brand: string;
  season: string;
  occasion: string;
  notes: string;
  isFavorite: boolean;
  tone: string;
};

export const neutralGarmentArtworkColors = ['#DED8CA', '#8B927D', '#F2EBDD'] as const;

export const wardrobeItems: readonly WardrobeItemFixture[] = [
  {
    id: 'ivory-shirt',
    name: 'Ivory relaxed shirt',
    category: 'Tops',
    color: 'Ivory',
    material: 'Linen blend',
    brand: 'Not recorded',
    season: 'Warm weather',
    occasion: 'Everyday',
    notes: 'Fixture item for layout preview only.',
    isFavorite: true,
    tone: '#E9E0CF',
  },
  {
    id: 'charcoal-trouser',
    name: 'Charcoal wide trouser',
    category: 'Bottoms',
    color: 'Charcoal',
    material: 'Wool blend',
    brand: 'Not recorded',
    season: 'All season',
    occasion: 'Smart casual',
    notes: 'Fixture item for layout preview only.',
    isFavorite: false,
    tone: '#5C6064',
  },
  {
    id: 'olive-jacket',
    name: 'Olive field jacket',
    category: 'Outerwear',
    color: 'Olive',
    material: 'Cotton twill',
    brand: 'Not recorded',
    season: 'Transitional',
    occasion: 'Casual',
    notes: 'Fixture item for layout preview only.',
    isFavorite: true,
    tone: '#77806A',
  },
  {
    id: 'tan-loafer',
    name: 'Tan everyday loafer',
    category: 'Shoes',
    color: 'Tan',
    material: 'Leather',
    brand: 'Not recorded',
    season: 'All season',
    occasion: 'Smart casual',
    notes: 'Fixture item for layout preview only.',
    isFavorite: false,
    tone: '#9F7659',
  },
] as const;

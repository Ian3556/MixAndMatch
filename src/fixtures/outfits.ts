/** Development-only outfit concepts. Replace with the future styling service. */
export type OutfitFixture = {
  id: string;
  name: string;
  occasion: string;
  style: string;
  garments: readonly string[];
  instructions: readonly string[];
  colorRationale: string;
  layeringNotes: string;
  footwearNotes: string;
  accessories: string;
  colors: readonly [string, string, string];
};

export const outfitConcepts: readonly OutfitFixture[] = [
  {
    id: 'gallery-afternoon',
    name: 'Gallery afternoon',
    occasion: 'Weekend outing',
    style: 'Relaxed minimal',
    garments: ['Ivory relaxed shirt', 'Charcoal wide trouser', 'Tan everyday loafer'],
    instructions: [
      'Wear the shirt slightly open at the collar.',
      'Use a partial front tuck to define the waist.',
      'Keep the trouser break clean above the loafer.',
    ],
    colorRationale: 'Warm ivory softens charcoal while tan keeps the palette grounded.',
    layeringNotes: 'Add the olive field jacket only if the temperature drops.',
    footwearNotes: 'A low-profile loafer maintains the relaxed tailored line.',
    accessories: 'Simple watch and compact neutral bag.',
    colors: ['#E9E0CF', '#5C6064', '#9F7659'],
  },
  {
    id: 'easy-travel-day',
    name: 'Easy travel day',
    occasion: 'Travel',
    style: 'Comfort first',
    garments: ['Soft crew tee', 'Relaxed trouser', 'Olive field jacket'],
    instructions: ['Keep the base layer breathable.', 'Roll jacket sleeves once for proportion.'],
    colorRationale: 'Muted greens and stone neutrals stay cohesive across interchangeable layers.',
    layeringNotes: 'Carry the jacket rather than tying it around the waist.',
    footwearNotes: 'Choose a supportive neutral trainer.',
    accessories: 'Crossbody bag and lightweight scarf.',
    colors: ['#C9C2B5', '#7D786F', '#77806A'],
  },
] as const;

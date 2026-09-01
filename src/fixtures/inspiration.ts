/** Development-only presentation data. Replace with the future inspiration repository. */
export type InspirationFixture = {
  id: string;
  title: string;
  category: string;
  caption: string;
  colors: readonly [string, string];
};

export const featuredInspiration: readonly InspirationFixture[] = [
  {
    id: 'linen-season',
    title: 'Linen season',
    category: 'Seasonal',
    caption: 'Light layers for warm, unhurried days.',
    colors: ['#D8C7AE', '#7B8B73'],
  },
  {
    id: 'city-evening',
    title: 'City evening',
    category: 'Occasion',
    caption: 'Clean silhouettes after sunset.',
    colors: ['#252B3B', '#B17865'],
  },
  {
    id: 'quiet-tailoring',
    title: 'Quiet tailoring',
    category: 'Editorial',
    caption: 'Relaxed structure in a neutral palette.',
    colors: ['#B4AA9C', '#4E4A45'],
  },
] as const;

export const recommendedInspiration: readonly InspirationFixture[] = [
  {
    id: 'soft-utility',
    title: 'Soft utility',
    category: 'Smart Casual',
    caption: 'Practical layers with polished proportions.',
    colors: ['#8F9B7D', '#E8DDC8'],
  },
  {
    id: 'monochrome-morning',
    title: 'Monochrome morning',
    category: 'Minimal',
    caption: 'One tonal family, several useful textures.',
    colors: ['#CAC7C1', '#77736D'],
  },
  {
    id: 'weekend-stripes',
    title: 'Weekend stripes',
    category: 'Casual',
    caption: 'An easy graphic layer with relaxed denim.',
    colors: ['#C5D5E8', '#F6EEE1'],
  },
  {
    id: 'modern-vintage',
    title: 'Modern vintage',
    category: 'Vintage',
    caption: 'Familiar details balanced with clean basics.',
    colors: ['#9C674D', '#E2C99B'],
  },
] as const;

export const allInspiration = [...featuredInspiration, ...recommendedInspiration] as const;

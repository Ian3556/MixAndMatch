import type { ExploreDiscoveryItem } from '../types/discovery';

/**
 * Manually curated discovery content backed by the app's local editorial image library.
 * The async service boundary allows a catalogue repository to replace this data later.
 */
export const exploreDiscoveryContent: readonly ExploreDiscoveryItem[] = [
  {
    id: 'city-minimal-uniform',
    title: 'City Minimal',
    aesthetic: 'Quiet tailoring',
    description:
      'Balance an oversized blazer with a clean base layer and fluid trousers for a composed city uniform.',
    style: 'Minimalist',
    categoryIds: ['outerwear', 'tops', 'bottoms', 'footwear'],
    tags: ['neutral', 'tailoring', 'transitional', 'city'],
    image: { kind: 'asset', key: 'featured-outfit-city-minimal' },
    imageAlt: 'Woman in an oversized taupe blazer, white tee, and black wide-leg trousers',
    imageAspectRatio: 2 / 3,
    inspirationId: 'quiet-tailoring',
  },
  {
    id: 'riviera-whites',
    title: 'Riviera Whites',
    aesthetic: 'Resort tailoring',
    description:
      'Keep warm-weather tailoring light and tonal, then add one structured accessory for definition.',
    style: 'Old Money',
    categoryIds: ['outerwear', 'bottoms', 'footwear', 'accessories'],
    tags: ['summer', 'linen', 'monochrome', 'coastal'],
    image: { kind: 'asset', key: 'season-release-hero' },
    imageAlt: 'Woman in fluid ivory tailoring beside a modern coastal building',
    imageAspectRatio: 4 / 5,
    inspirationId: 'linen-season',
  },
  {
    id: 'soft-utility-walk',
    title: 'Soft Utility Walk',
    aesthetic: 'Weekend layers',
    description:
      'Soften practical outerwear with pale denim and a crisp shirt for an easy layered weekend look.',
    style: 'City Walk',
    categoryIds: ['outerwear', 'tops', 'bottoms', 'footwear'],
    tags: ['olive', 'utility', 'denim', 'weekend'],
    image: { kind: 'asset', key: 'featured-outfit-soft-utility' },
    imageAlt: 'Woman in an olive utility jacket, white shirt, and ecru denim',
    imageAspectRatio: 3 / 4,
    inspirationId: 'soft-utility',
  },
  {
    id: 'tonal-commute',
    title: 'Tonal Commute',
    aesthetic: 'Modern classic',
    description:
      'Layer sand, cream, and charcoal in clean proportions to make commuter staples feel intentional.',
    style: 'Smart Casual',
    categoryIds: ['outerwear', 'tops', 'bottoms', 'footwear'],
    tags: ['tonal', 'trench', 'knitwear', 'menswear'],
    image: { kind: 'asset', key: 'featured-outfit-tonal-layers' },
    imageAlt: 'Man in a sand trench coat, cream knit, and charcoal trousers',
    imageAspectRatio: 2 / 3,
    inspirationId: 'monochrome-morning',
  },
  {
    id: 'blue-hour-drape',
    title: 'Blue Hour Drape',
    aesthetic: 'After-dark resort',
    description:
      'Let a sculptural silhouette lead, keeping accessories restrained and the palette deep and focused.',
    style: 'Formal',
    categoryIds: ['dresses', 'footwear', 'accessories'],
    tags: ['evening', 'drape', 'ocean', 'occasion'],
    image: { kind: 'asset', key: 'season-release-resort' },
    imageAlt: 'Woman in a sculptural deep-blue evening dress overlooking the sea',
    imageAspectRatio: 2 / 3,
    inspirationId: 'city-evening',
  },
  {
    id: 'archive-burgundy',
    title: 'Archive Burgundy',
    aesthetic: 'Runway layers',
    description:
      'Pair oxblood leather with charcoal wool and simple foundations to modernise archival references.',
    style: 'Vintage',
    categoryIds: ['outerwear', 'tops', 'bottoms', 'footwear', 'accessories'],
    tags: ['oxblood', 'leather', 'wool', 'runway'],
    image: { kind: 'asset', key: 'season-release-secondary' },
    imageAlt: 'Models in charcoal wool and oxblood leather tailoring',
    imageAspectRatio: 3 / 4,
    inspirationId: 'modern-vintage',
  },
  {
    id: 'street-line',
    title: 'Street Line',
    aesthetic: 'Relaxed proportions',
    description:
      'Use one tailored layer over generous separates, grounding the volume with clean everyday sneakers.',
    style: 'Streetwear',
    categoryIds: ['outerwear', 'tops', 'bottoms', 'footwear'],
    tags: ['oversized', 'street', 'sneakers', 'layering'],
    image: { kind: 'asset', key: 'featured-outfit-city-minimal' },
    imageAlt: 'Relaxed oversized blazer styled with wide trousers and white sneakers',
    imageAspectRatio: 5 / 6,
    inspirationId: 'weekend-stripes',
  },
  {
    id: 'off-duty-olive',
    title: 'Off-Duty Olive',
    aesthetic: 'Easy separates',
    description:
      'Build an everyday palette around olive, white, and cream with uncomplicated cotton separates.',
    style: 'Casual',
    categoryIds: ['outerwear', 'tops', 'bottoms', 'footwear'],
    tags: ['casual', 'cotton', 'cream', 'everyday'],
    image: { kind: 'asset', key: 'featured-outfit-soft-utility' },
    imageAlt: 'Olive cropped jacket styled with a white shirt and cream jeans',
    imageAspectRatio: 4 / 5,
    inspirationId: 'soft-utility',
  },
] as const;

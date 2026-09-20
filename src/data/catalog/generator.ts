import { createHash } from 'node:crypto';

import { BODY_TYPE_TAGS_BY_FIT, COLORS, STOCK_STATUSES } from './attributes.ts';
import { BRAND_PROFILES } from './brandProfiles.ts';
import {
  CATALOG_BRANDS,
  CATALOG_SEED,
  DEFAULT_PRODUCT_COUNT,
  SYNTHETIC_CATALOG_TIMESTAMP,
  SYNTHETIC_SOURCE_DOMAIN,
} from './brands.ts';
import { CATEGORIES_BY_SLUG } from './categories.ts';
import { isDemoCatalogImageKey } from './demoImages.ts';
import type {
  BrandProfile,
  CatalogCategoryDefinition,
  GeneratedCatalog,
  SyntheticMaterial,
  SyntheticProduct,
  SyntheticStyleProfile,
  SyntheticVariant,
} from './types.ts';

type GenerateCatalogOptions = {
  seed?: number;
  productCount?: number;
};

type RandomSource = {
  next: () => number;
  integer: (minimum: number, maximum: number) => number;
  pick: <T>(values: readonly T[]) => T;
  chance: (probability: number) => boolean;
};

export function generateCatalog(options: GenerateCatalogOptions = {}): GeneratedCatalog {
  const seed = options.seed ?? CATALOG_SEED;
  const productCount = options.productCount ?? DEFAULT_PRODUCT_COUNT;
  if (!Number.isInteger(seed)) throw new Error('Catalog seed must be an integer.');
  if (!Number.isInteger(productCount) || productCount < CATALOG_BRANDS.length) {
    throw new Error(`Product count must be an integer of at least ${CATALOG_BRANDS.length}.`);
  }

  const random = createRandom(seed);
  const baseCount = Math.floor(productCount / CATALOG_BRANDS.length);
  const remainder = productCount % CATALOG_BRANDS.length;
  const brands = CATALOG_BRANDS.map((brand, index) => ({
    id: stableUuid(`brand:${brand.slug}`),
    ...brand,
    targetProductCount: baseCount + (index < remainder ? 1 : 0),
    sourceType: 'synthetic' as const,
    isDemo: true as const,
  }));

  const products: SyntheticProduct[] = [];
  const variants: SyntheticVariant[] = [];
  const styleProfiles: SyntheticStyleProfile[] = [];
  const sourceRecords: GeneratedCatalog['sourceRecords'] = [];

  for (const brand of brands) {
    const profile = BRAND_PROFILES[brand.slug];
    if (!profile) throw new Error(`Missing brand profile for ${brand.slug}.`);

    for (let index = 0; index < brand.targetProductCount; index += 1) {
      const product = buildProduct({ brand, profile, index, seed, random });
      const productVariants = buildVariants(product, random);
      products.push(product);
      variants.push(...productVariants);
      styleProfiles.push(buildStyleProfile(product));
      sourceRecords.push({
        id: stableUuid(`source:${product.id}`),
        productId: product.id,
        sourceDomain: product.sourceDomain,
        sourceUrl: product.sourceUrl,
        contentHash: createHash('sha256').update(JSON.stringify(product)).digest('hex'),
        rawPayload: { seed, is_demo: true, source_type: 'synthetic' },
      });
    }
  }

  return {
    seed,
    generatedAt: SYNTHETIC_CATALOG_TIMESTAMP,
    currency: 'MYR',
    brands,
    products,
    variants,
    styleProfiles,
    sourceRecords,
  };
}

function buildProduct({
  brand,
  profile,
  index,
  seed,
  random,
}: {
  brand: GeneratedCatalog['brands'][number];
  profile: BrandProfile;
  index: number;
  seed: number;
  random: RandomSource;
}): SyntheticProduct {
  const category = getCategory(weightedChoice(profile.categoryWeights, random));
  const color = random.pick(COLORS);
  const secondColor = random.chance(0.22)
    ? random.pick(COLORS.filter((candidate) => candidate.name !== color.name))
    : null;
  const fit = random.pick(category.fits);
  const materialNames = unique([
    random.pick(category.materials),
    ...(random.chance(0.3) ? [random.pick(category.materials)] : []),
  ]);
  const materials = allocateMaterials(materialNames, random);
  const modifier = random.pick(category.modifiers);
  const materialLabel = materials[0]?.material.replace(/ Blend$/, '') ?? 'Everyday';
  const noun = random.pick(category.nouns);
  const name = unique([modifier, materialLabel, noun]).join(' ');
  const productId = stableUuid(`catalog:${seed}:${brand.slug}:${index}`);
  const slug = `${brand.slug}-${slugify(name)}-${String(index + 1).padStart(3, '0')}`;
  const gender =
    category.genderBias === 'women'
      ? 'women'
      : category.genderBias === 'unisex'
        ? 'unisex'
        : random.pick(profile.genders);
  const pattern = random.pick(category.patterns);
  const silhouette = random.pick(category.silhouettes);
  const length = random.pick(category.lengths);
  const formalityLevel = random.integer(...category.formalityRange);
  const warmthLevel = random.integer(...category.warmthRange);
  const styleTags = unique([
    random.pick(profile.styles),
    random.pick(category.styleTags),
    ...(random.chance(0.55) ? [random.pick(profile.styles)] : []),
  ]).slice(0, 4);
  const occasionTags = takeRandom(
    category.occasions,
    random,
    random.integer(2, Math.min(4, category.occasions.length)),
  );
  const seasonTags = [...category.seasons];
  const price = roundToFive(
    randomBetween(category.basePriceRange, random) * profile.priceMultiplier,
  );
  const bodyTypeTags = BODY_TYPE_TAGS_BY_FIT[fit] ?? BODY_TYPE_TAGS_BY_FIT.regular ?? ['balanced'];
  const sourceUrl = `https://${SYNTHETIC_SOURCE_DOMAIN}/${brand.slug}/${slug}`;
  if (!isDemoCatalogImageKey(category.slug)) {
    throw new Error(`Missing demo image asset for synthetic category: ${category.slug}.`);
  }

  return {
    id: productId,
    brandId: brand.id,
    brandSlug: brand.slug,
    externalProductId: `DEMO-${brand.slug.toUpperCase()}-${String(index + 1).padStart(4, '0')}`,
    name,
    slug,
    description: `A fictional ${fit} ${category.name.toLowerCase()} style in ${color.name.toLowerCase()}, generated for MixAndMatch development and styling tests. It uses ${materials.map((entry) => entry.material.toLowerCase()).join(' and ')} with a ${pattern.replaceAll('_', ' ')} finish.`,
    gender,
    categorySlug: category.parentSlug,
    categoryName: category.parentName,
    subcategorySlug: category.slug,
    subcategoryName: category.name,
    colors: [color.name, ...(secondColor ? [secondColor.name] : [])],
    dominantColor: color.name,
    colorFamily: color.family,
    materials,
    pattern,
    fit,
    silhouette,
    length,
    styleTags,
    occasionTags,
    seasonTags,
    formalityLevel,
    warmthLevel,
    layerType: category.layerType,
    layerPosition: category.layerPosition,
    bodyTypeTags: [...bodyTypeTags],
    skinToneTags: [...color.skinTones],
    price,
    currency: 'MYR',
    imageUrl: null,
    imageAssetKey: category.slug,
    imageSourceType: 'generated',
    sourceUrl,
    sourceDomain: SYNTHETIC_SOURCE_DOMAIN,
    sourceType: 'synthetic',
    isDemo: true,
    createdAt: SYNTHETIC_CATALOG_TIMESTAMP,
    updatedAt: SYNTHETIC_CATALOG_TIMESTAMP,
  };
}

function buildVariants(product: SyntheticProduct, random: RandomSource): SyntheticVariant[] {
  const category = getCategory(product.subcategorySlug);
  const requestedCount =
    category.sizes.length === 1
      ? 1
      : random.integer(Math.min(3, category.sizes.length), Math.min(6, category.sizes.length));
  const start =
    category.sizes.length === requestedCount
      ? 0
      : random.integer(0, category.sizes.length - requestedCount);
  return category.sizes.slice(start, start + requestedCount).map((size, index) => {
    const id = stableUuid(`variant:${product.id}:${size}`);
    const stockStatus = random.pick(STOCK_STATUSES);
    return {
      id,
      productId: product.id,
      externalVariantId: `DEMO-V-${id.slice(0, 12).toUpperCase()}`,
      sku: `DEMO-${product.brandSlug.toUpperCase()}-${product.id.slice(0, 8).toUpperCase()}-${String(index + 1).padStart(2, '0')}`,
      variantKey: `${slugify(product.dominantColor)}:${slugify(size)}`,
      size,
      color: product.dominantColor,
      price: product.price,
      currency: 'MYR',
      stockStatus,
      sourceType: 'synthetic',
      isDemo: true,
    };
  });
}

function buildStyleProfile(product: SyntheticProduct): SyntheticStyleProfile {
  return {
    productId: product.id,
    fit: product.fit,
    silhouette: product.silhouette,
    pattern: product.pattern,
    texture: textureFor(product),
    length: product.length,
    layerType: product.layerType,
    layerPosition: product.layerPosition,
    formalityLevel: product.formalityLevel,
    warmthLevel: product.warmthLevel,
    seasonTags: product.seasonTags,
    occasionTags: product.occasionTags,
    bodyTypeTags: product.bodyTypeTags,
    skinToneTags: product.skinToneTags,
    dominantColor: product.dominantColor,
    secondaryColors: product.colors.slice(1),
    styleTags: product.styleTags,
    sourceType: 'synthetic',
    isDemo: true,
  };
}

function textureFor(product: SyntheticProduct): string {
  const category = getCategory(product.subcategorySlug);
  const index = hashNumber(`${product.id}:texture`) % category.textures.length;
  return category.textures[index] ?? 'smooth';
}

function allocateMaterials(materialNames: string[], random: RandomSource): SyntheticMaterial[] {
  if (materialNames.length === 1) {
    return [{ material: materialNames[0] ?? 'Cotton', percentage: 100, confidence: 1 }];
  }
  const primary = random.integer(65, 90);
  return [
    { material: materialNames[0] ?? 'Cotton', percentage: primary, confidence: 1 },
    {
      material: materialNames[1] ?? 'Recycled Polyester',
      percentage: 100 - primary,
      confidence: 1,
    },
  ];
}

function getCategory(slug: string): CatalogCategoryDefinition {
  const category = CATEGORIES_BY_SLUG.get(slug);
  if (!category) throw new Error(`Unknown synthetic category: ${slug}.`);
  return category;
}

function createRandom(seed: number): RandomSource {
  let state = seed >>> 0;
  const next = () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4_294_967_296;
  };
  return {
    next,
    integer: (minimum, maximum) => Math.floor(next() * (maximum - minimum + 1)) + minimum,
    pick: <T>(values: readonly T[]) => {
      if (values.length === 0) throw new Error('Cannot choose from an empty list.');
      const value = values[Math.floor(next() * values.length)];
      if (value === undefined) throw new Error('Seeded selection failed.');
      return value;
    },
    chance: (probability) => next() < probability,
  };
}

function weightedChoice(weights: Record<string, number>, random: RandomSource): string {
  const entries = Object.entries(weights).filter(([, weight]) => weight > 0);
  const total = entries.reduce((sum, [, weight]) => sum + weight, 0);
  let cursor = random.next() * total;
  for (const [value, weight] of entries) {
    cursor -= weight;
    if (cursor <= 0) return value;
  }
  const fallback = entries.at(-1)?.[0];
  if (!fallback) throw new Error('Weighted choice requires at least one positive weight.');
  return fallback;
}

function takeRandom<T>(values: readonly T[], random: RandomSource, count: number): T[] {
  const pool = [...values];
  const selected: T[] = [];
  while (selected.length < count && pool.length > 0) {
    const index = random.integer(0, pool.length - 1);
    const [value] = pool.splice(index, 1);
    if (value !== undefined) selected.push(value);
  }
  return selected;
}

function randomBetween(range: readonly [number, number], random: RandomSource): number {
  return range[0] + random.next() * (range[1] - range[0]);
}

function roundToFive(value: number): number {
  return Math.max(5, Math.round(value / 5) * 5);
}

function stableUuid(input: string): string {
  const bytes = createHash('sha256').update(input).digest().subarray(0, 16);
  bytes[6] = ((bytes[6] ?? 0) & 0x0f) | 0x50;
  bytes[8] = ((bytes[8] ?? 0) & 0x3f) | 0x80;
  const hex = bytes.toString('hex');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function hashNumber(input: string): number {
  return Number.parseInt(createHash('sha256').update(input).digest('hex').slice(0, 8), 16);
}

function slugify(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function unique<T>(values: T[]): T[] {
  return [...new Set(values)];
}

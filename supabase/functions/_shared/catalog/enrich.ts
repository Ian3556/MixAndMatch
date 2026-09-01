import {
  CATALOG_ENRICHMENT_VERSION,
  type CatalogStyleProfile,
  type CatalogStyleTag,
  type EnrichedCatalogProduct,
  type NormalizedCatalogProduct,
} from './types';

const EXTRACTION_CONFIDENCE: Record<NormalizedCatalogProduct['extractionMethod'], number> = {
  json_ld: 0.96,
  open_graph: 0.82,
  html_meta: 0.72,
  public_embedded_state: 0.85,
  domain_adapter: 0.9,
  csv: 0.88,
  feed: 0.94,
  api: 0.96,
  pim: 0.98,
  manual: 0.9,
};

export function enrichCatalogProduct(product: NormalizedCatalogProduct): EnrichedCatalogProduct {
  const signal = normalizeSignal(
    [
      product.name,
      product.description ?? '',
      product.rawCategory ?? '',
      product.rawSubcategory ?? '',
      ...product.styleHints,
    ].join(' '),
  );
  const warnings: string[] = [];
  const styleTags = inferStyleTags(product, signal);
  if (styleTags.length === 0) warnings.push('style_classification_not_determined');

  const profile: CatalogStyleProfile = {
    fit: inferFit(signal),
    silhouette: inferSilhouette(product, signal),
    pattern: inferPattern(signal),
    texture: inferTexture(product, signal),
    layerRole: inferLayerRole(product.categorySlug, product.subcategorySlug),
    formalityScore: inferFormality(product, styleTags),
    warmthScore: inferWarmth(product, signal),
    seasonTags: inferSeasons(product, signal),
    occasionTags: inferOccasions(styleTags),
    dominantColor: product.primaryColor,
    secondaryColors: [],
    confidence: styleTags.length > 0 ? 0.78 : 0.42,
    enrichmentVersion: CATALOG_ENRICHMENT_VERSION,
    reviewed: false,
  };

  if (!profile.fit) warnings.push('fit_not_determined');
  if (!profile.pattern) warnings.push('pattern_not_determined');

  return {
    ...product,
    styleTags,
    styleProfile: profile,
    overallConfidence: calculateOverallConfidence(product, profile, styleTags),
    enrichmentWarnings: warnings,
  };
}

function inferStyleTags(product: NormalizedCatalogProduct, signal: string): CatalogStyleTag[] {
  const tags = new Map<string, number>();
  const add = (slug: string, confidence: number) => {
    tags.set(slug, Math.max(tags.get(slug) ?? 0, confidence));
  };

  if (/\b(streetwear|street style|skate|logo|graphic|oversized)\b/.test(signal))
    add('streetwear', 0.88);
  if (/\b(minimal|minimalist|clean lines?|understated|tonal|monochrome)\b/.test(signal))
    add('minimal', 0.9);
  if (/\b(vintage|retro|heritage|archive|washed)\b/.test(signal)) add('vintage', 0.82);
  if (/\b(technical|gore[ -]?tex|waterproof|windproof|performance shell)\b/.test(signal))
    add('technical', 0.94);
  if (/\b(hiking|trail|outdoor|mountain|alpine|trek)\b/.test(signal)) add('outdoor', 0.92);
  if (/\b(sport|running|training|athletic|performance|court)\b/.test(signal)) add('sporty', 0.9);
  if (/\b(utility|workwear|work jacket|carpenter|double knee)\b/.test(signal)) add('workwear', 0.9);
  if (/\b(luxury|luxurious|couture|atelier)\b/.test(signal)) add('luxury', 0.78);
  if (/\b(preppy|collegiate|varsity|ivy)\b/.test(signal)) add('preppy', 0.86);

  if (
    ['t_shirt', 'hoodie', 'sweatshirt', 'joggers', 'shorts', 'sneakers', 'slides'].includes(
      product.subcategorySlug ?? '',
    )
  ) {
    add('casual', 0.9);
  }
  if (
    ['shirt', 'polo', 'trousers', 'chinos', 'cardigan', 'loafers', 'blazer'].includes(
      product.subcategorySlug ?? '',
    )
  ) {
    add('smart_casual', 0.84);
  }
  if (['formal_shoes', 'gown'].includes(product.subcategorySlug ?? '')) add('formal', 0.94);
  if (
    ['polo', 'chinos', 'cardigan', 'trench', 'loafers', 'blazer'].includes(
      product.subcategorySlug ?? '',
    )
  ) {
    add('classic', 0.82);
  }
  if (['cargo_pants', 'overshirt', 'vest'].includes(product.subcategorySlug ?? ''))
    add('workwear', 0.74);
  if (product.categorySlug === 'footwear' && /\b(run|trail|court|training|sport)\b/.test(signal))
    add('sporty', 0.88);
  if (product.categorySlug !== 'other' && tags.size === 0) add('contemporary', 0.58);

  return [...tags.entries()]
    .map(([slug, confidence]) => ({ slug, confidence }))
    .sort(
      (left, right) => right.confidence - left.confidence || left.slug.localeCompare(right.slug),
    );
}

function inferFit(signal: string): string | null {
  if (/\b(oversized|extra oversized)\b/.test(signal)) return 'oversized';
  if (/\b(relaxed|loose fit)\b/.test(signal)) return 'relaxed';
  if (/\b(slim|slim fit|skinny)\b/.test(signal)) return 'slim';
  if (/\b(tailored|fitted)\b/.test(signal)) return 'tailored';
  if (/\b(regular|classic fit|standard fit)\b/.test(signal)) return 'regular';
  return null;
}

function inferSilhouette(product: NormalizedCatalogProduct, signal: string): string | null {
  if (/\bbox(?:y| cut)\b/.test(signal)) return 'boxy';
  if (/\bwide[ -]?leg\b/.test(signal)) return 'wide';
  if (/\bstraight[ -]?(?:leg|cut)\b/.test(signal)) return 'straight';
  if (/\btapered\b/.test(signal)) return 'tapered';
  if (/\bcropped\b/.test(signal)) return 'cropped';
  if (/\bflowy|fluid\b/.test(signal)) return 'fluid';
  if (product.subcategorySlug === 't_shirt' && /\boversized\b/.test(signal)) return 'boxy';
  return null;
}

function inferPattern(signal: string): string | null {
  if (/\b(striped?|pinstripe)\b/.test(signal)) return 'stripe';
  if (/\b(check(?:ed)?|plaid|tartan|gingham)\b/.test(signal)) return 'check';
  if (/\bfloral\b/.test(signal)) return 'floral';
  if (/\bgraphic|printed|all[ -]?over print\b/.test(signal)) return 'graphic';
  if (/\blogo|monogram\b/.test(signal)) return 'logo';
  if (/\bpolka dot|dotted\b/.test(signal)) return 'dot';
  if (/\bsolid|plain|single colo(?:u)?r\b/.test(signal)) return 'solid';
  return null;
}

function inferTexture(product: NormalizedCatalogProduct, signal: string): string | null {
  if (/\bribbed\b/.test(signal)) return 'ribbed';
  if (/\bquilted\b/.test(signal)) return 'quilted';
  if (/\bbrushed\b/.test(signal)) return 'brushed';
  if (/\bpebbled\b/.test(signal)) return 'pebbled';
  if (/\bmesh\b/.test(signal)) return 'mesh';
  if (/\bfleece\b/.test(signal)) return 'fleece';
  if (product.materials.some((material) => material.material === 'denim')) return 'denim';
  if (product.materials.some((material) => material.material === 'suede')) return 'suede';
  return null;
}

function inferLayerRole(category: string, subcategory: string | null): string | null {
  if (category === 'outerwear') return 'outer';
  if (category === 'knitwear' || ['hoodie', 'sweatshirt', 'overshirt'].includes(subcategory ?? ''))
    return 'mid';
  if (category === 'tops' || category === 'dresses_one_pieces') return 'base';
  if (category === 'bottoms') return 'bottom';
  if (category === 'footwear') return 'footwear';
  if (category === 'accessories') return 'accessory';
  return null;
}

function inferFormality(product: NormalizedCatalogProduct, tags: CatalogStyleTag[]): number | null {
  const slugs = new Set(tags.map((tag) => tag.slug));
  if (slugs.has('formal')) return 5;
  if (product.subcategorySlug === 'blazer' || slugs.has('smart_casual')) return 4;
  if (slugs.has('classic') || slugs.has('preppy')) return 3;
  if (slugs.has('casual') || slugs.has('streetwear') || slugs.has('sporty')) return 2;
  if (product.categorySlug === 'other') return null;
  return 3;
}

function inferWarmth(product: NormalizedCatalogProduct, signal: string): number | null {
  if (/\b(insulated|down filled|heavyweight|thermal)\b/.test(signal)) return 5;
  if (product.subcategorySlug === 'puffer' || product.subcategorySlug === 'parka') return 5;
  if (product.categorySlug === 'outerwear') return 4;
  if (product.categorySlug === 'knitwear' || /\b(fleece|wool|cashmere)\b/.test(signal)) return 3;
  if (
    ['t_shirt', 'tank_top', 'shorts', 'sandals', 'slides'].includes(product.subcategorySlug ?? '')
  )
    return 1;
  return 2;
}

function inferSeasons(product: NormalizedCatalogProduct, signal: string): string[] {
  if (/\b(winter|thermal|down filled|insulated)\b/.test(signal)) return ['autumn', 'winter'];
  if (/\b(summer|lightweight|linen|breathable)\b/.test(signal)) return ['spring', 'summer'];
  if (['puffer', 'parka', 'coat'].includes(product.subcategorySlug ?? ''))
    return ['autumn', 'winter'];
  if (['tank_top', 'shorts', 'sandals', 'slides'].includes(product.subcategorySlug ?? ''))
    return ['spring', 'summer'];
  return ['spring', 'summer', 'autumn'];
}

function inferOccasions(tags: CatalogStyleTag[]): string[] {
  const slugs = new Set(tags.map((tag) => tag.slug));
  const occasions = new Set<string>();
  if (slugs.has('formal')) occasions.add('formal');
  if (slugs.has('smart_casual') || slugs.has('preppy')) occasions.add('work');
  if (slugs.has('sporty') || slugs.has('outdoor') || slugs.has('technical'))
    occasions.add('active');
  if (slugs.has('casual') || slugs.has('streetwear') || occasions.size === 0)
    occasions.add('casual');
  occasions.add('daily');
  return [...occasions];
}

function calculateOverallConfidence(
  product: NormalizedCatalogProduct,
  profile: CatalogStyleProfile,
  styleTags: CatalogStyleTag[],
): number {
  const priceConfidence = product.currentPrice !== null ? 1 : product.priceUnavailable ? 0.85 : 0;
  const materialConfidence =
    product.materials.length > 0
      ? product.materials.reduce((sum, material) => sum + material.confidence, 0) /
        product.materials.length
      : 0.35;
  const components = [
    product.categoryConfidence,
    product.colorConfidence,
    materialConfidence,
    priceConfidence,
    product.images.length > 0 ? 1 : 0,
    EXTRACTION_CONFIDENCE[product.extractionMethod],
    styleTags.length > 0 ? profile.confidence : 0,
  ];
  const average = components.reduce((sum, value) => sum + value, 0) / components.length;
  return Math.round(average * 1000) / 1000;
}

function normalizeSignal(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

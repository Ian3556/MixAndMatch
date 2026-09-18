export type CatalogSourceType = 'synthetic';

export type CatalogImageSourceType =
  'placeholder' | 'manual_upload' | 'generated' | 'affiliate' | 'brand_api' | 'url_import';

export type SyntheticBrand = {
  id: string;
  name: string;
  slug: string;
  brandGroup: string;
  featured: boolean;
  targetProductCount: number;
  sourceType: CatalogSourceType;
  isDemo: true;
};

export type SyntheticMaterial = {
  material: string;
  percentage: number;
  confidence: number;
};

export type SyntheticVariant = {
  id: string;
  productId: string;
  externalVariantId: string;
  sku: string;
  variantKey: string;
  size: string;
  color: string;
  price: number;
  currency: 'MYR';
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock';
  sourceType: CatalogSourceType;
  isDemo: true;
};

export type SyntheticStyleProfile = {
  productId: string;
  fit: string;
  silhouette: string;
  pattern: string;
  texture: string;
  length: string;
  layerType: string;
  layerPosition: string;
  formalityLevel: number;
  warmthLevel: number;
  seasonTags: string[];
  occasionTags: string[];
  bodyTypeTags: string[];
  skinToneTags: string[];
  dominantColor: string;
  secondaryColors: string[];
  styleTags: string[];
  sourceType: CatalogSourceType;
  isDemo: true;
};

export type SyntheticProduct = {
  id: string;
  brandId: string;
  brandSlug: string;
  externalProductId: string;
  name: string;
  slug: string;
  description: string;
  gender: 'men' | 'women' | 'unisex';
  categorySlug: string;
  categoryName: string;
  subcategorySlug: string;
  subcategoryName: string;
  colors: string[];
  dominantColor: string;
  colorFamily: string;
  materials: SyntheticMaterial[];
  pattern: string;
  fit: string;
  silhouette: string;
  length: string;
  styleTags: string[];
  occasionTags: string[];
  seasonTags: string[];
  formalityLevel: number;
  warmthLevel: number;
  layerType: string;
  layerPosition: string;
  bodyTypeTags: string[];
  skinToneTags: string[];
  price: number;
  currency: 'MYR';
  imageUrl: null;
  imageSourceType: CatalogImageSourceType;
  sourceUrl: string;
  sourceDomain: string;
  sourceType: CatalogSourceType;
  isDemo: true;
  createdAt: string;
  updatedAt: string;
};

export type SyntheticSourceRecord = {
  id: string;
  productId: string;
  sourceDomain: string;
  sourceUrl: string;
  contentHash: string;
  rawPayload: {
    seed: number;
    is_demo: true;
    source_type: CatalogSourceType;
  };
};

export type GeneratedCatalog = {
  seed: number;
  generatedAt: string;
  currency: 'MYR';
  brands: SyntheticBrand[];
  products: SyntheticProduct[];
  variants: SyntheticVariant[];
  styleProfiles: SyntheticStyleProfile[];
  sourceRecords: SyntheticSourceRecord[];
};

export type CatalogValidationIssue = {
  code: string;
  message: string;
  productId?: string;
};

export type CatalogValidationReport = {
  passed: boolean;
  brands: number;
  products: number;
  variants: number;
  categories: number;
  demoProducts: number;
  missingRemoteImages: number;
  placeholderImages: number;
  productsPerBrand: Record<string, number>;
  productsPerCategory: Record<string, number>;
  errors: CatalogValidationIssue[];
  warnings: CatalogValidationIssue[];
};

export type CatalogCategoryDefinition = {
  parentSlug: string;
  parentName: string;
  slug: string;
  name: string;
  nouns: string[];
  modifiers: string[];
  materials: string[];
  fits: string[];
  silhouettes: string[];
  lengths: string[];
  patterns: string[];
  textures: string[];
  layerType: string;
  layerPosition: string;
  formalityRange: readonly [number, number];
  warmthRange: readonly [number, number];
  seasons: string[];
  occasions: string[];
  sizes: string[];
  basePriceRange: readonly [number, number];
  styleTags: string[];
  genderBias?: 'women' | 'unisex';
};

export type BrandProfile = {
  segment: string;
  priceMultiplier: number;
  styles: string[];
  genders: ('men' | 'women' | 'unisex')[];
  categoryWeights: Record<string, number>;
};

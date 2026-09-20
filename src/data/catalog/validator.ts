import { CATALOG_CATEGORIES } from './categories.ts';
import { isDemoCatalogImageKey } from './demoImages.ts';
import type {
  CatalogValidationIssue,
  CatalogValidationReport,
  GeneratedCatalog,
  SyntheticProduct,
} from './types.ts';

export function validateCatalog(catalog: GeneratedCatalog): CatalogValidationReport {
  const errors: CatalogValidationIssue[] = [];
  const warnings: CatalogValidationIssue[] = [];
  const productIds = new Set<string>();
  const productSlugs = new Set<string>();
  const variantIds = new Set<string>();
  const variantKeys = new Set<string>();
  const productIdSet = new Set(catalog.products.map((product) => product.id));
  const validCategorySlugs = new Set(CATALOG_CATEGORIES.map((category) => category.slug));
  const productsPerBrand = countBy(catalog.products, (product) => product.brandSlug);
  const productsPerCategory = countBy(
    catalog.products,
    (product) => `${product.categoryName} / ${product.subcategoryName}`,
  );
  const variantsByProduct = countBy(catalog.variants, (variant) => variant.productId);
  const stylesByProduct = new Map(
    catalog.styleProfiles.map((profile) => [profile.productId, profile]),
  );

  if (catalog.brands.length < 25 || catalog.brands.length > 30) {
    errors.push({
      code: 'BRAND_COUNT',
      message: `Expected 25-30 brands; received ${catalog.brands.length}.`,
    });
  }

  for (const product of catalog.products) {
    checkUnique(productIds, product.id, 'DUPLICATE_PRODUCT_ID', 'product ID', errors, product.id);
    checkUnique(
      productSlugs,
      product.slug,
      'DUPLICATE_PRODUCT_SLUG',
      'product slug',
      errors,
      product.id,
    );
    validateProduct(product, validCategorySlugs, errors);
    if (!stylesByProduct.has(product.id)) {
      errors.push({
        code: 'MISSING_STYLE_PROFILE',
        message: 'Product has no styling profile.',
        productId: product.id,
      });
    }
    if ((variantsByProduct[product.id] ?? 0) === 0) {
      errors.push({
        code: 'MISSING_VARIANTS',
        message: 'Product has no variants.',
        productId: product.id,
      });
    }
  }

  for (const variant of catalog.variants) {
    checkUnique(
      variantIds,
      variant.id,
      'DUPLICATE_VARIANT_ID',
      'variant ID',
      errors,
      variant.productId,
    );
    checkUnique(
      variantKeys,
      `${variant.productId}:${variant.variantKey}`,
      'DUPLICATE_VARIANT_KEY',
      'variant key',
      errors,
      variant.productId,
    );
    if (
      !productIdSet.has(variant.productId) ||
      !variant.size ||
      !variant.color ||
      variant.price < 0
    ) {
      errors.push({
        code: 'INVALID_VARIANT',
        message: `Variant ${variant.id} has invalid product, size, color, or price data.`,
        productId: variant.productId,
      });
    }
  }

  for (const profile of catalog.styleProfiles) {
    if (profile.warmthLevel >= 4 && profile.seasonTags.includes('summer')) {
      errors.push({
        code: 'IMPOSSIBLE_SEASON_WARMTH',
        message: 'Warmth 4-5 product cannot be summer-tagged.',
        productId: profile.productId,
      });
    }
    if (
      profile.formalityLevel < 0 ||
      profile.formalityLevel > 5 ||
      profile.warmthLevel < 0 ||
      profile.warmthLevel > 5
    ) {
      errors.push({
        code: 'INVALID_STYLE_SCORE',
        message: 'Styling scores must be between 0 and 5.',
        productId: profile.productId,
      });
    }
  }

  for (const brand of catalog.brands) {
    const actual = productsPerBrand[brand.slug] ?? 0;
    if (actual !== brand.targetProductCount) {
      errors.push({
        code: 'BRAND_PRODUCT_COUNT',
        message: `${brand.name} expected ${brand.targetProductCount} products but received ${actual}.`,
      });
    }
  }

  const missingRemoteImages = catalog.products.filter(
    (product) => product.imageUrl === null,
  ).length;
  const placeholderImages = catalog.products.filter(
    (product) => product.imageSourceType === 'placeholder',
  ).length;
  const generatedImages = catalog.products.filter(
    (product) =>
      product.imageSourceType === 'generated' &&
      isDemoCatalogImageKey(product.imageAssetKey) &&
      product.imageAssetKey === product.subcategorySlug,
  ).length;
  const missingImageConfiguration = catalog.products.filter(
    (product) =>
      product.imageUrl === null &&
      product.imageSourceType !== 'placeholder' &&
      !(
        product.imageSourceType === 'generated' &&
        isDemoCatalogImageKey(product.imageAssetKey) &&
        product.imageAssetKey === product.subcategorySlug
      ),
  ).length;
  if (missingImageConfiguration > 0) {
    errors.push({
      code: 'IMAGE_FALLBACK_MISSING',
      message: `${missingImageConfiguration} products have neither a remote image, a placeholder, nor a matching generated asset.`,
    });
  }
  if (placeholderImages > 0) {
    warnings.push({
      code: 'PLACEHOLDER_IMAGES',
      message: `${placeholderImages} products intentionally use application-owned placeholder artwork.`,
    });
  }
  if (generatedImages > 0 && missingRemoteImages > 0) {
    warnings.push({
      code: 'GENERATED_IMAGE_UPLOAD_REQUIRED',
      message: `${generatedImages} products have app-owned generated assets that the seed command uploads to Supabase Storage.`,
    });
  }

  return {
    passed: errors.length === 0,
    brands: catalog.brands.length,
    products: catalog.products.length,
    variants: catalog.variants.length,
    categories: CATALOG_CATEGORIES.length,
    demoProducts: catalog.products.filter((product) => product.isDemo).length,
    missingRemoteImages,
    placeholderImages,
    generatedImages,
    productsPerBrand,
    productsPerCategory,
    errors,
    warnings,
  };
}

export function formatCatalogValidation(report: CatalogValidationReport): string {
  const brandLines = Object.entries(report.productsPerBrand)
    .map(([brand, count]) => `  ${brand}: ${count}`)
    .join('\n');
  const categoryLines = Object.entries(report.productsPerCategory)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([category, count]) => `  ${category}: ${count}`)
    .join('\n');
  const issueLines = report.errors
    .map((issue) => `  ERROR ${issue.code}: ${issue.message}`)
    .join('\n');
  return [
    `Brands: ${report.brands}`,
    `Products: ${report.products}`,
    `Variants: ${report.variants}`,
    `Categories: ${report.categories}`,
    `Demo products: ${report.demoProducts}`,
    `Images pending remote upload: ${report.missingRemoteImages}`,
    `Placeholder fallbacks: ${report.placeholderImages}`,
    `Generated image assets: ${report.generatedImages}`,
    '',
    'Products per brand:',
    brandLines,
    '',
    'Products per category:',
    categoryLines,
    '',
    `Validation: ${report.passed ? 'PASS' : 'FAIL'}`,
    ...(issueLines ? [issueLines] : []),
  ].join('\n');
}

function validateProduct(
  product: SyntheticProduct,
  validCategorySlugs: Set<string>,
  errors: CatalogValidationIssue[],
) {
  const requiredText = [
    product.brandSlug,
    product.name,
    product.slug,
    product.description,
    product.categorySlug,
    product.subcategorySlug,
    product.dominantColor,
    product.colorFamily,
    product.fit,
    product.silhouette,
    product.length,
    product.layerType,
    product.layerPosition,
  ];
  if (requiredText.some((value) => value.trim().length === 0) || product.materials.length === 0) {
    errors.push({
      code: 'MISSING_REQUIRED_ATTRIBUTE',
      message: 'Product is missing a required catalog attribute.',
      productId: product.id,
    });
  }
  if (!validCategorySlugs.has(product.subcategorySlug)) {
    errors.push({
      code: 'INVALID_CATEGORY',
      message: `Unknown subcategory ${product.subcategorySlug}.`,
      productId: product.id,
    });
  }
  if (product.sourceType !== 'synthetic' || !product.isDemo) {
    errors.push({
      code: 'DEMO_MARKER',
      message: 'Synthetic product is not explicitly marked as demo data.',
      productId: product.id,
    });
  }
  if (product.currency !== 'MYR' || product.price <= 0) {
    errors.push({
      code: 'INVALID_PRICE',
      message: 'Synthetic price must be a positive MYR amount.',
      productId: product.id,
    });
  }
  if (
    product.styleTags.length === 0 ||
    product.occasionTags.length === 0 ||
    product.seasonTags.length === 0
  ) {
    errors.push({
      code: 'MISSING_STYLING_METADATA',
      message: 'Product is missing style, occasion, or season tags.',
      productId: product.id,
    });
  }
  const materialTotal = product.materials.reduce((sum, material) => sum + material.percentage, 0);
  if (materialTotal !== 100) {
    errors.push({
      code: 'INVALID_MATERIAL_TOTAL',
      message: `Material percentages total ${materialTotal}, not 100.`,
      productId: product.id,
    });
  }
}

function checkUnique(
  values: Set<string>,
  value: string,
  code: string,
  label: string,
  errors: CatalogValidationIssue[],
  productId?: string,
) {
  if (values.has(value))
    errors.push({
      code,
      message: `Duplicate ${label}: ${value}.`,
      ...(productId ? { productId } : {}),
    });
  values.add(value);
}

function countBy<T>(items: T[], key: (item: T) => string): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const item of items) {
    const value = key(item);
    counts[value] = (counts[value] ?? 0) + 1;
  }
  return counts;
}

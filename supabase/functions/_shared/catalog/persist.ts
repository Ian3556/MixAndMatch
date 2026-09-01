import type { CatalogRestClient } from './rest-client';
import {
  CATALOG_IMPORTER_VERSION,
  type CatalogPipelineProduct,
  type RawCatalogProductCandidate,
} from './types';

export type CatalogPersistenceLookup = {
  categoryIds: Map<string, string>;
  styleTagIds: Map<string, string>;
};

export type CatalogPersistenceContext = {
  brandId: string;
  rawCandidate: RawCatalogProductCandidate;
  fetchedAt: string;
  contentHash: string | null;
  targetProductId?: string | undefined;
};

type IdRow = { id: string };

export async function persistCatalogProduct(
  client: CatalogRestClient,
  product: CatalogPipelineProduct,
  lookup: CatalogPersistenceLookup,
  context: CatalogPersistenceContext,
): Promise<{ productId: string; duplicate: boolean }> {
  const categoryId = lookup.categoryIds.get(product.categorySlug);
  const subcategoryId = product.subcategorySlug
    ? lookup.categoryIds.get(product.subcategorySlug)
    : undefined;
  if (!categoryId || (product.subcategorySlug && !subcategoryId)) {
    throw new Error('The canonical catalogue taxonomy is missing a required category row.');
  }

  const existing = context.targetProductId
    ? [{ id: context.targetProductId }]
    : await client.select<IdRow>(
        'catalog_products',
        `select=id&brand_id=eq.${context.brandId}&deduplication_key=eq.${encodeURIComponent(product.deduplicationKey)}&limit=1`,
      );
  const row = {
    brand_id: context.brandId,
    external_product_id: product.externalProductId,
    external_style_id: product.externalStyleId,
    external_sku: product.externalSku,
    name: product.name,
    slug: product.slug,
    description: product.description,
    category_id: categoryId,
    subcategory_id: subcategoryId ?? null,
    raw_category: product.rawCategory,
    raw_subcategory: product.rawSubcategory,
    gender: product.gender,
    primary_color: product.primaryColor,
    color_family: product.colorFamily,
    material_summary: product.materialSummary,
    current_price: product.currentPrice,
    original_price: product.originalPrice,
    currency: product.currency,
    price_unavailable: product.priceUnavailable,
    availability: product.availability,
    source_url: product.sourceUrl,
    canonical_url: product.canonicalUrl,
    source_domain: product.sourceDomain,
    deduplication_key: product.deduplicationKey,
    status: product.validation.decision,
    validation_errors: product.validation.errors,
    validation_warnings: product.validation.warnings,
    overall_confidence: product.overallConfidence,
    normalization_version: product.normalizationVersion,
    last_checked_at: context.fetchedAt,
  };

  let persisted: IdRow[];
  if (context.targetProductId) {
    persisted = await client.update<IdRow>(
      'catalog_products',
      `id=eq.${context.targetProductId}&select=id`,
      row,
    );
  } else {
    persisted = await client.upsert<IdRow>('catalog_products', 'brand_id,deduplication_key', row);
  }
  const productId = persisted[0]?.id;
  if (!productId) throw new Error('The catalogue product was not returned after persistence.');

  await replaceProductDetails(client, productId, product, lookup);
  await client.upsert('catalog_product_sources', 'product_id,source_url', {
    product_id: productId,
    source_domain: product.sourceDomain,
    source_url: product.sourceUrl,
    extraction_method: product.extractionMethod,
    fetched_at: context.fetchedAt,
    content_hash: context.contentHash,
    importer_version: CATALOG_IMPORTER_VERSION,
    raw_payload: {
      candidate: context.rawCandidate,
      pipeline: {
        decision: product.validation.decision,
        confidence: product.overallConfidence,
        warnings: product.validation.warnings,
        errors: product.validation.errors,
      },
    },
  });

  return { productId, duplicate: !context.targetProductId && existing.length > 0 };
}

async function replaceProductDetails(
  client: CatalogRestClient,
  productId: string,
  product: CatalogPipelineProduct,
  lookup: CatalogPersistenceLookup,
) {
  const productQuery = `product_id=eq.${productId}`;
  await Promise.all([
    client.delete('catalog_product_variants', productQuery),
    client.delete('catalog_product_images', productQuery),
    client.delete('catalog_product_style_tags', productQuery),
    client.delete('catalog_product_materials', productQuery),
  ]);

  if (product.variants.length > 0) {
    await client.insert(
      'catalog_product_variants',
      product.variants.map((variant) => ({
        product_id: productId,
        external_variant_id: variant.externalVariantId,
        sku: variant.sku,
        variant_key: variant.variantKey,
        size: variant.size,
        color: variant.color,
        price: variant.price,
        currency: variant.currency,
        availability: variant.availability,
      })),
    );
  }
  if (product.images.length > 0) {
    await client.insert(
      'catalog_product_images',
      product.images.map((image) => ({
        product_id: productId,
        image_url: image.imageUrl,
        source_url: image.sourceUrl,
        position: image.position,
        image_type: image.imageType,
      })),
    );
  }
  if (product.materials.length > 0) {
    await client.insert(
      'catalog_product_materials',
      product.materials.map((material) => ({
        product_id: productId,
        material: material.material,
        percentage: material.percentage,
        confidence: material.confidence,
      })),
    );
  }

  const productTags = product.styleTags.flatMap((tag) => {
    const styleTagId = lookup.styleTagIds.get(tag.slug);
    return styleTagId
      ? [{ product_id: productId, style_tag_id: styleTagId, confidence: tag.confidence }]
      : [];
  });
  if (productTags.length > 0) await client.insert('catalog_product_style_tags', productTags);

  await client.upsert('catalog_product_style_profiles', 'product_id', {
    product_id: productId,
    fit: product.styleProfile.fit,
    silhouette: product.styleProfile.silhouette,
    pattern: product.styleProfile.pattern,
    texture: product.styleProfile.texture,
    layer_role: product.styleProfile.layerRole,
    formality_score: product.styleProfile.formalityScore,
    warmth_score: product.styleProfile.warmthScore,
    season_tags: product.styleProfile.seasonTags,
    occasion_tags: product.styleProfile.occasionTags,
    dominant_color: product.styleProfile.dominantColor,
    secondary_colors: product.styleProfile.secondaryColors,
    ai_confidence: product.styleProfile.confidence,
    enrichment_version: product.styleProfile.enrichmentVersion,
    reviewed: product.styleProfile.reviewed,
  });
}

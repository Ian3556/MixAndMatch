import type { CatalogProductDetail, CatalogProductVariant } from '@/catalog/browseTypes';
import { buildWardrobeInput } from '@/services/wardrobeNormalization';
import type { CreateWardrobeItemInput } from '@/types/wardrobe';

export function buildCatalogWardrobeInput(
  product: CatalogProductDetail,
  variant: CatalogProductVariant | null,
  instanceKey?: string,
): CreateWardrobeItemInput {
  const variantKey = variant?.variant_key ?? 'default';
  const deduplicationKey = [
    'catalog',
    product.id,
    variantKey,
    ...(instanceKey ? ['instance', instanceKey] : []),
  ].join(':');
  return buildWardrobeInput(
    {
      catalogProductId: product.id,
      sourceType: 'catalog',
      sourceUrl: product.sourceUrl,
      sourceDomain: product.sourceDomain,
      externalProductId: variant?.external_variant_id ?? product.externalProductId,
      brand: product.brandName,
      name: product.name,
      category: product.categoryName,
      subcategory: product.subcategoryName,
      color: variant?.color ?? product.primaryColor,
      size: variant?.size ?? null,
      pattern: product.pattern,
      material: product.material,
      season: product.seasonTags[0] ?? null,
      occasion: product.occasionTags[0] ?? null,
      notes: product.description,
      primaryImageUrl: product.imageUrl,
      imageUrls: product.imageUrls,
      price: variant?.price ?? product.price,
      currency: variant?.currency ?? product.currency,
      metadata: {
        variantKey,
        ...(variant?.sku ? { sku: variant.sku } : {}),
        catalogAvailability: variant?.availability ?? product.availability,
        catalogSourceType: product.sourceType,
        catalogIsDemo: product.isDemo,
        styleTags: product.styleTags,
        seasonTags: product.seasonTags,
        occasionTags: product.occasionTags,
        fit: product.fit,
        silhouette: product.silhouette,
        length: product.length,
        formalityLevel: product.formalityLevel,
        warmthLevel: product.warmthLevel,
      },
    },
    deduplicationKey,
  );
}

export function createCatalogInstanceKey(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

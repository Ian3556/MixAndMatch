import { readFile } from 'node:fs/promises';

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import { STYLE_TAG_NAMES } from '../../src/data/catalog/attributes.ts';
import {
  DEMO_CATALOG_IMAGE_ASSETS,
  DEMO_CATALOG_IMAGE_BUCKET,
  type DemoCatalogImageKey,
} from '../../src/data/catalog/demoImages.ts';
import { generateCatalog } from '../../src/data/catalog/generator.ts';
import { formatCatalogValidation, validateCatalog } from '../../src/data/catalog/validator.ts';
import type { GeneratedCatalog } from '../../src/data/catalog/types.ts';
import { parseCatalogCli } from './cli.ts';

const options = parseCatalogCli(process.argv.slice(2));
const catalog = generateCatalog({
  ...(options.seed === undefined ? {} : { seed: options.seed }),
  ...(options.count === undefined ? {} : { productCount: options.count }),
});
const report = validateCatalog(catalog);
console.log(formatCatalogValidation(report));
if (!report.passed) process.exit(1);

if (!options.apply) {
  console.log(
    'Dry run only. Add --apply with the documented development safety variables to seed Supabase.',
  );
  process.exit(0);
}

assertDevelopmentSeedAllowed();
const supabaseUrl = process.env.SUPABASE_URL ?? process.env.EXPO_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !serviceRoleKey) {
  throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required for --apply.');
}

const client = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

if (options.resetExisting || options.resetOnly) {
  await deleteSyntheticProducts(client);
  console.log(
    'Removed existing synthetic products only. Non-demo catalogue and wardrobe rows were preserved.',
  );
}
if (options.resetOnly) process.exit(0);

await seedCatalog(client, catalog);
console.log(
  `Seeded ${catalog.products.length} synthetic products, ${catalog.variants.length} variants, and ${Object.keys(DEMO_CATALOG_IMAGE_ASSETS).length} shared generated category images.`,
);

function assertDevelopmentSeedAllowed() {
  if (process.env.MIXANDMATCH_CATALOG_ENV !== 'development') {
    throw new Error('Refusing to seed: MIXANDMATCH_CATALOG_ENV must equal development.');
  }
  if (process.env.CATALOG_ALLOW_SYNTHETIC_SEED !== 'true') {
    throw new Error('Refusing to seed: CATALOG_ALLOW_SYNTHETIC_SEED must equal true.');
  }
}

async function deleteSyntheticProducts(client: SupabaseClient) {
  const result = await client.from('catalog_products').delete().eq('is_demo', true);
  if (result.error) throw new Error(`Unable to reset synthetic products: ${result.error.message}`);
  const brandResult = await client
    .from('catalog_brands')
    .update({ has_demo_catalog: false })
    .eq('has_demo_catalog', true);
  if (brandResult.error) {
    throw new Error(`Unable to reset demo brand flags: ${brandResult.error.message}`);
  }
}

async function seedCatalog(client: SupabaseClient, generated: GeneratedCatalog) {
  const existingBrands = await client
    .from('catalog_brands')
    .select('id, slug, source_status, source_status_reason');
  if (existingBrands.error) throw new Error(existingBrands.error.message);
  const existingBrandsBySlug = new Map((existingBrands.data ?? []).map((row) => [row.slug, row]));
  const brandRows = generated.brands.map((brand) => {
    const existingBrand = existingBrandsBySlug.get(brand.slug);
    return {
      id: existingBrand?.id ?? brand.id,
      name: brand.name,
      slug: brand.slug,
      brand_group: brand.brandGroup,
      enabled: true,
      featured: brand.featured,
      has_demo_catalog: true,
      source_status: existingBrand?.source_status ?? 'manual_seed_required',
      source_status_reason: existingBrand
        ? existingBrand.source_status_reason
        : 'No live retailer source is connected. Synthetic development products are tracked separately.',
    };
  });
  await upsertBatches(client, 'catalog_brands', brandRows, 'slug');

  const brandResult = await client
    .from('catalog_brands')
    .select('id, slug')
    .in(
      'slug',
      generated.brands.map((brand) => brand.slug),
    );
  if (brandResult.error) throw new Error(brandResult.error.message);
  const brandIds = new Map((brandResult.data ?? []).map((row) => [row.slug, row.id]));

  const categoryResult = await client.from('catalog_categories').select('id, slug');
  if (categoryResult.error) throw new Error(categoryResult.error.message);
  const categoryIds = new Map((categoryResult.data ?? []).map((row) => [row.slug, row.id]));

  const styleTagRows = Object.entries(STYLE_TAG_NAMES).map(([slug, name]) => ({ slug, name }));
  await upsertBatches(client, 'catalog_style_tags', styleTagRows, 'slug');
  const styleResult = await client.from('catalog_style_tags').select('id, slug');
  if (styleResult.error) throw new Error(styleResult.error.message);
  const styleIds = new Map((styleResult.data ?? []).map((row) => [row.slug, row.id]));
  const imageUrls = await uploadDemoCatalogImages(client);

  const productRows = generated.products.map((product) => ({
    id: product.id,
    brand_id: requireLookup(brandIds, product.brandSlug, 'brand'),
    external_product_id: product.externalProductId,
    external_style_id: null,
    external_sku: null,
    name: product.name,
    slug: product.slug,
    description: product.description,
    category_id: requireLookup(categoryIds, product.categorySlug, 'category'),
    subcategory_id: requireLookup(categoryIds, product.subcategorySlug, 'subcategory'),
    raw_category: product.categoryName,
    raw_subcategory: product.subcategoryName,
    gender: product.gender,
    primary_color: product.dominantColor,
    color_family: product.colorFamily,
    material_summary: product.materials
      .map((material) => `${material.percentage}% ${material.material}`)
      .join(', '),
    current_price: product.price,
    original_price: null,
    currency: product.currency,
    price_unavailable: false,
    availability: 'in_stock',
    source_url: product.sourceUrl,
    canonical_url: product.sourceUrl,
    source_domain: product.sourceDomain,
    deduplication_key: `synthetic:${product.id}`,
    status: 'validated',
    validation_errors: [],
    validation_warnings: ['Synthetic development product; not a real retailer listing.'],
    overall_confidence: 1,
    normalization_version: `synthetic-${generated.seed}-v1`,
    source_type: product.sourceType,
    is_demo: product.isDemo,
    image_source_type: product.imageSourceType,
    imported_at: product.createdAt,
    last_checked_at: product.updatedAt,
    created_at: product.createdAt,
    updated_at: product.updatedAt,
  }));
  await upsertBatches(client, 'catalog_products', productRows, 'id');

  await upsertBatches(
    client,
    'catalog_product_images',
    generated.products.map((product) => {
      const imageUrl = requireLookup(imageUrls, product.imageAssetKey, 'generated image');
      return {
        product_id: product.id,
        image_url: imageUrl,
        source_url: imageUrl,
        position: 0,
        image_type: 'primary',
        source_type: 'generated',
        is_demo: true,
        created_at: generated.generatedAt,
      };
    }),
    'product_id,position',
  );

  await upsertBatches(
    client,
    'catalog_product_variants',
    generated.variants.map((variant) => ({
      id: variant.id,
      product_id: variant.productId,
      external_variant_id: variant.externalVariantId,
      sku: variant.sku,
      variant_key: variant.variantKey,
      size: variant.size,
      color: variant.color,
      price: variant.price,
      currency: variant.currency,
      availability: variant.stockStatus,
      is_demo: true,
      created_at: generated.generatedAt,
      updated_at: generated.generatedAt,
    })),
    'id',
  );

  await upsertBatches(
    client,
    'catalog_product_style_profiles',
    generated.styleProfiles.map((profile) => ({
      product_id: profile.productId,
      fit: profile.fit,
      silhouette: profile.silhouette,
      pattern: profile.pattern,
      texture: profile.texture,
      length: profile.length,
      layer_role: profile.layerType,
      layer_position: profile.layerPosition,
      formality_score: profile.formalityLevel,
      warmth_score: profile.warmthLevel,
      season_tags: profile.seasonTags,
      occasion_tags: profile.occasionTags,
      body_type_tags: profile.bodyTypeTags,
      skin_tone_tags: profile.skinToneTags,
      dominant_color: profile.dominantColor,
      secondary_colors: profile.secondaryColors,
      ai_confidence: 1,
      enrichment_version: `synthetic-${generated.seed}-v1`,
      reviewed: false,
      is_demo: true,
      created_at: generated.generatedAt,
      updated_at: generated.generatedAt,
    })),
    'product_id',
  );

  await upsertBatches(
    client,
    'catalog_product_materials',
    generated.products.flatMap((product) =>
      product.materials.map((material) => ({
        product_id: product.id,
        material: material.material,
        percentage: material.percentage,
        confidence: material.confidence,
        is_demo: true,
        created_at: generated.generatedAt,
      })),
    ),
    'product_id,material',
  );

  await upsertBatches(
    client,
    'catalog_product_style_tags',
    generated.styleProfiles.flatMap((profile) =>
      profile.styleTags.map((style) => ({
        product_id: profile.productId,
        style_tag_id: requireLookup(styleIds, style, 'style tag'),
        confidence: 1,
        is_demo: true,
        created_at: generated.generatedAt,
      })),
    ),
    'product_id,style_tag_id',
  );

  await upsertBatches(
    client,
    'catalog_product_sources',
    generated.sourceRecords.map((source) => ({
      id: source.id,
      product_id: source.productId,
      source_domain: source.sourceDomain,
      source_url: source.sourceUrl,
      extraction_method: 'synthetic',
      fetched_at: generated.generatedAt,
      content_hash: source.contentHash,
      importer_version: `synthetic-${generated.seed}-v1`,
      raw_payload: source.rawPayload,
      is_demo: true,
      created_at: generated.generatedAt,
    })),
    'id',
  );
}

async function uploadDemoCatalogImages(
  client: SupabaseClient,
): Promise<Map<DemoCatalogImageKey, string>> {
  await ensureDemoCatalogImageBucket(client);
  const urls = new Map<DemoCatalogImageKey, string>();
  const entries = Object.entries(DEMO_CATALOG_IMAGE_ASSETS) as [
    DemoCatalogImageKey,
    (typeof DEMO_CATALOG_IMAGE_ASSETS)[DemoCatalogImageKey],
  ][];

  for (const [key, asset] of entries) {
    const bytes = await readFile(new URL(`../../${asset.localPath}`, import.meta.url));
    const upload = await client.storage
      .from(DEMO_CATALOG_IMAGE_BUCKET)
      .upload(asset.storagePath, bytes, {
        cacheControl: '3600',
        contentType: 'image/png',
        upsert: true,
      });
    if (upload.error) {
      throw new Error(`Unable to upload demo image ${asset.localPath}: ${upload.error.message}`);
    }
    const publicUrl = client.storage.from(DEMO_CATALOG_IMAGE_BUCKET).getPublicUrl(asset.storagePath)
      .data.publicUrl;
    if (!publicUrl) throw new Error(`Unable to resolve public URL for ${asset.storagePath}.`);
    urls.set(key, publicUrl);
  }

  return urls;
}

async function ensureDemoCatalogImageBucket(client: SupabaseClient) {
  const buckets = await client.storage.listBuckets({
    limit: 100,
    search: DEMO_CATALOG_IMAGE_BUCKET,
  });
  if (buckets.error) {
    throw new Error(`Unable to list Storage buckets: ${buckets.error.message}`);
  }

  const bucketExists = buckets.data.some((bucket) => bucket.id === DEMO_CATALOG_IMAGE_BUCKET);
  const configuration = {
    public: true,
    fileSizeLimit: 5 * 1024 * 1024,
    allowedMimeTypes: ['image/png'],
  };

  if (!bucketExists) {
    const created = await client.storage.createBucket(DEMO_CATALOG_IMAGE_BUCKET, configuration);
    if (created.error) {
      throw new Error(`Unable to create demo image bucket: ${created.error.message}`);
    }
    return;
  }

  const updated = await client.storage.updateBucket(DEMO_CATALOG_IMAGE_BUCKET, configuration);
  if (updated.error) {
    throw new Error(`Unable to configure demo image bucket: ${updated.error.message}`);
  }
}

async function upsertBatches(
  client: SupabaseClient,
  table: string,
  rows: Record<string, unknown>[],
  onConflict: string,
) {
  const batchSize = 200;
  for (let index = 0; index < rows.length; index += batchSize) {
    const batch = rows.slice(index, index + batchSize);
    const result = await client.from(table).upsert(batch, { onConflict });
    if (result.error) throw new Error(`Unable to seed ${table}: ${result.error.message}`);
  }
}

function requireLookup(values: Map<string, string>, key: string, label: string): string {
  const value = values.get(key);
  if (!value)
    throw new Error(`Missing ${label} lookup for ${key}. Apply all catalogue migrations first.`);
  return value;
}

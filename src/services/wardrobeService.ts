import type { Database } from '@/types/database';
import type {
  CreateWardrobeItemInput,
  WardrobeItem,
  WardrobeItemSaveResult,
} from '@/types/wardrobe';
import { resolveWardrobeMetadata, type MetadataValue } from '@/services/wardrobeMetadata';

export type WardrobeRow = Database['public']['Tables']['wardrobe_items']['Row'];
export type WardrobeInsert = Database['public']['Tables']['wardrobe_items']['Insert'];
export type WardrobeUpdate = Database['public']['Tables']['wardrobe_items']['Update'];

export type WardrobeGatewayResult<T> = { data: T; error: unknown };
export type WardrobeGateway = {
  listByUser: (userId: string) => Promise<WardrobeGatewayResult<WardrobeRow[] | null>>;
  insert: (payload: WardrobeInsert) => Promise<WardrobeGatewayResult<WardrobeRow | null>>;
  update: (
    userId: string,
    itemId: string,
    payload: WardrobeUpdate,
  ) => Promise<WardrobeGatewayResult<WardrobeRow | null>>;
  delete: (userId: string, itemId: string) => Promise<WardrobeGatewayResult<null>>;
};

export class WardrobeServiceError extends Error {
  constructor(
    readonly code: 'duplicate' | 'unauthorized' | 'invalid' | 'network' | 'not-found' | 'unknown',
    message: string,
    readonly cause?: unknown,
  ) {
    super(message);
    this.name = 'WardrobeServiceError';
  }
}

export type WardrobeService = ReturnType<typeof createWardrobeService>;

export function createWardrobeService(gateway: WardrobeGateway) {
  return {
    async list(userId: string): Promise<WardrobeItem[]> {
      const result = await gateway.listByUser(userId);
      if (result.error) throw normalizeWardrobeError(result.error);
      return (result.data ?? []).map(mapWardrobeRow);
    },

    async create(userId: string, input: CreateWardrobeItemInput): Promise<WardrobeItem> {
      const result = await gateway.insert(toWardrobeInsert(userId, input));
      if (result.error) throw normalizeWardrobeError(result.error);
      if (!result.data)
        throw new WardrobeServiceError('unknown', 'The wardrobe item was not returned.');
      return mapWardrobeRow(result.data);
    },

    async saveMany(
      userId: string,
      inputs: CreateWardrobeItemInput[],
    ): Promise<WardrobeItemSaveResult[]> {
      const results: WardrobeItemSaveResult[] = [];
      for (const input of inputs) {
        try {
          results.push({ input, status: 'added', item: await this.create(userId, input) });
        } catch (error) {
          if (error instanceof WardrobeServiceError && error.code === 'duplicate') {
            results.push({ input, status: 'duplicate' });
          } else {
            results.push({
              input,
              status: 'failed',
              message:
                error instanceof WardrobeServiceError
                  ? error.message
                  : 'This item could not be saved. Try again.',
            });
          }
        }
      }
      return results;
    },

    async update(userId: string, itemId: string, payload: WardrobeUpdate): Promise<WardrobeItem> {
      const result = await gateway.update(userId, itemId, payload);
      if (result.error) throw normalizeWardrobeError(result.error);
      if (!result.data)
        throw new WardrobeServiceError('not-found', 'The wardrobe item no longer exists.');
      return mapWardrobeRow(result.data);
    },

    async delete(userId: string, itemId: string): Promise<void> {
      const result = await gateway.delete(userId, itemId);
      if (result.error) throw normalizeWardrobeError(result.error);
    },
  };
}

export function mapWardrobeRow(row: WardrobeRow): WardrobeItem {
  const metadata = asMetadata(row.metadata);
  const storedDescription =
    typeof metadata.productDescription === 'string' ? metadata.productDescription : null;
  const legacyDescription =
    !storedDescription &&
    row.notes &&
    (row.source_type === 'catalog' ||
      (row.source_type === 'url_import' && typeof metadata.extractionMethod === 'string'))
      ? row.notes
      : null;
  const description = storedDescription ?? legacyDescription;
  const suppressed = Array.isArray(metadata.metadataSuppressed)
    ? metadata.metadataSuppressed.filter(
        (value): value is MetadataValue => typeof value === 'string',
      )
    : [];
  const resolved = resolveWardrobeMetadata({
    name: row.name,
    category: row.category,
    brand: row.brand,
    color: row.primary_color,
    subcategory: row.subcategory,
    material: row.material,
    season: row.season,
    occasion: row.occasion,
    description,
    sourceDomain: row.source_domain,
    sourceUrl: row.source_url,
    suppressed,
  });
  return {
    id: row.id,
    userId: row.user_id,
    catalogProductId: row.catalog_product_id,
    name: row.name,
    category: row.category,
    subcategory: resolved.subcategory,
    primaryColor: resolved.color,
    secondaryColor: row.secondary_color,
    size: row.size,
    pattern: row.pattern,
    material: resolved.material,
    brand: resolved.brand,
    season: resolved.season,
    occasion: resolved.occasion,
    notes: legacyDescription ? null : row.notes,
    description,
    isFavorite: row.is_favorite,
    imageUrl: row.image_url,
    imageUrls: row.image_urls,
    sourceUrl: row.source_url,
    sourceDomain: row.source_domain,
    externalProductId: row.external_product_id,
    price: row.price,
    currency: row.currency,
    importMethod: row.import_method,
    sourceType: row.source_type,
    metadata: {
      ...metadata,
      ...(description ? { productDescription: description } : {}),
      metadataSources:
        typeof metadata.metadataSources === 'object' && metadata.metadataSources !== null
          ? metadata.metadataSources
          : resolved.sources,
    },
    deduplicationKey: row.deduplication_key,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function toWardrobeInsert(userId: string, input: CreateWardrobeItemInput): WardrobeInsert {
  return {
    user_id: userId,
    catalog_product_id: input.catalogProductId ?? null,
    name: input.name.trim(),
    category: input.category.trim(),
    subcategory: nullable(input.subcategory),
    primary_color: nullable(input.primaryColor),
    secondary_color: nullable(input.secondaryColor),
    size: nullable(input.size),
    pattern: nullable(input.pattern),
    material: nullable(input.material),
    brand: nullable(input.brand),
    season: nullable(input.season),
    occasion: nullable(input.occasion),
    notes: nullable(input.notes),
    is_favorite: input.isFavorite ?? false,
    image_url: nullable(input.imageUrl),
    image_urls: input.imageUrls ?? [],
    source_url: nullable(input.sourceUrl),
    source_domain: nullable(input.sourceDomain),
    external_product_id: nullable(input.externalProductId),
    price: input.price ?? null,
    currency: nullable(input.currency)?.toUpperCase() ?? null,
    import_method: input.importMethod,
    source_type: input.sourceType,
    metadata: input.metadata ?? {},
    deduplication_key: input.deduplicationKey,
  };
}

export function normalizeWardrobeError(error: unknown): WardrobeServiceError {
  const code = readStringProperty(error, 'code');
  const message = readStringProperty(error, 'message').toLowerCase();
  if (code === '23505') {
    return new WardrobeServiceError('duplicate', 'This item is already in your wardrobe.', error);
  }
  if (code === '42501' || code === 'PGRST301') {
    return new WardrobeServiceError('unauthorized', 'You cannot access this wardrobe item.', error);
  }
  if (code === '23514' || code === '23502' || code === '22001') {
    return new WardrobeServiceError('invalid', 'Review this item and correct its details.', error);
  }
  if (error instanceof TypeError || message.includes('network') || message.includes('fetch')) {
    return new WardrobeServiceError(
      'network',
      'We could not reach the wardrobe service. Check your connection and try again.',
      error,
    );
  }
  return new WardrobeServiceError('unknown', 'The wardrobe item could not be saved.', error);
}

function nullable(value: string | null | undefined): string | null {
  const normalized = value?.trim();
  return normalized ? normalized : null;
}

function readStringProperty(value: unknown, key: string): string {
  if (typeof value !== 'object' || value === null || !(key in value)) return '';
  const property = Reflect.get(value, key);
  return typeof property === 'string' ? property : '';
}

function asMetadata(value: WardrobeRow['metadata']): WardrobeItem['metadata'] {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return {};
  return Object.fromEntries(
    Object.entries(value).filter((entry) => entry[1] !== undefined),
  ) as WardrobeItem['metadata'];
}

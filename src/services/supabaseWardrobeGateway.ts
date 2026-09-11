import type {
  WardrobeGateway,
  WardrobeInsert,
  WardrobeRow,
  WardrobeUpdate,
} from '@/services/wardrobeService';
import { getSupabaseClient } from '@supabase';
import { withTimeout } from '@/utils/promise/withTimeout';

const WARDROBE_COLUMNS =
  'id, user_id, catalog_product_id, name, category, subcategory, primary_color, secondary_color, size, pattern, material, brand, season, occasion, notes, is_favorite, image_url, image_urls, source_url, source_domain, external_product_id, price, currency, import_method, source_type, metadata, deduplication_key, created_at, updated_at';
const LEGACY_WARDROBE_COLUMNS =
  'id, user_id, catalog_product_id, name, category, subcategory, primary_color, secondary_color, pattern, material, brand, season, occasion, notes, is_favorite, image_url, source_url, source_domain, external_product_id, price, currency, import_method, deduplication_key, created_at, updated_at';

export function createSupabaseWardrobeGateway(): WardrobeGateway {
  const client = getSupabaseClient();
  return {
    async listByUser(userId) {
      const result = await withTimeout(
        client
          .from('wardrobe_items')
          .select(WARDROBE_COLUMNS)
          .eq('user_id', userId)
          .order('created_at', { ascending: false }),
      );
      if (!isExtendedSchemaMissing(result.error)) return result;
      const legacy = await withTimeout(
        client
          .from('wardrobe_items')
          .select(LEGACY_WARDROBE_COLUMNS)
          .eq('user_id', userId)
          .order('created_at', { ascending: false }),
      );
      return {
        data: legacy.data?.map((row) => extendLegacyRow(row as LegacyWardrobeRow)) ?? null,
        error: legacy.error,
      };
    },

    async insert(payload) {
      const result = await withTimeout(
        client.from('wardrobe_items').insert(payload).select(WARDROBE_COLUMNS).single(),
      );
      if (!isExtendedSchemaMissing(result.error) || payload.source_type === 'catalog')
        return result;
      const legacy = await withTimeout(
        client
          .from('wardrobe_items')
          .insert(toLegacyInsert(payload) as WardrobeInsert)
          .select(LEGACY_WARDROBE_COLUMNS)
          .single(),
      );
      return {
        data: legacy.data ? extendLegacyRow(legacy.data as LegacyWardrobeRow) : null,
        error: legacy.error,
      };
    },

    async update(userId: string, itemId: string, payload: WardrobeUpdate) {
      const result = await withTimeout(
        client
          .from('wardrobe_items')
          .update(payload)
          .eq('user_id', userId)
          .eq('id', itemId)
          .select(WARDROBE_COLUMNS)
          .maybeSingle(),
      );
      if (!isExtendedSchemaMissing(result.error)) return result;
      const legacy = await withTimeout(
        client
          .from('wardrobe_items')
          .update(toLegacyUpdate(payload))
          .eq('user_id', userId)
          .eq('id', itemId)
          .select(LEGACY_WARDROBE_COLUMNS)
          .maybeSingle(),
      );
      return {
        data: legacy.data ? extendLegacyRow(legacy.data as LegacyWardrobeRow) : null,
        error: legacy.error,
      };
    },

    async delete(userId: string, itemId: string) {
      const result = await withTimeout(
        client.from('wardrobe_items').delete().eq('user_id', userId).eq('id', itemId),
      );
      return { data: null, error: result.error };
    },
  };
}

type LegacyWardrobeRow = Omit<WardrobeRow, 'image_urls' | 'metadata' | 'size' | 'source_type'>;

function extendLegacyRow(row: LegacyWardrobeRow): WardrobeRow {
  return {
    ...row,
    image_urls: row.image_url ? [row.image_url] : [],
    metadata: {},
    size: null,
    source_type: row.import_method === 'website-url' ? 'url_import' : 'manual',
  };
}

function toLegacyInsert(
  payload: WardrobeInsert,
): Omit<WardrobeInsert, 'image_urls' | 'metadata' | 'size' | 'source_type'> {
  const copy = { ...payload };
  Reflect.deleteProperty(copy, 'image_urls');
  Reflect.deleteProperty(copy, 'metadata');
  Reflect.deleteProperty(copy, 'size');
  Reflect.deleteProperty(copy, 'source_type');
  return copy;
}

function toLegacyUpdate(payload: WardrobeUpdate): WardrobeUpdate {
  const copy = { ...payload };
  Reflect.deleteProperty(copy, 'image_urls');
  Reflect.deleteProperty(copy, 'metadata');
  Reflect.deleteProperty(copy, 'size');
  Reflect.deleteProperty(copy, 'source_type');
  return copy;
}

function isExtendedSchemaMissing(error: unknown): boolean {
  if (typeof error !== 'object' || error === null) return false;
  const code = 'code' in error ? Reflect.get(error, 'code') : undefined;
  const message = 'message' in error ? String(Reflect.get(error, 'message')).toLowerCase() : '';
  return code === 'PGRST204' || message.includes('source_type') || message.includes('image_urls');
}

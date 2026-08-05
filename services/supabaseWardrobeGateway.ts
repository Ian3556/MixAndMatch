import type { WardrobeGateway, WardrobeUpdate } from '@/services/wardrobeService';
import { getSupabaseClient } from '@/supabase';
import { withTimeout } from '@/utils/promise/withTimeout';

const WARDROBE_COLUMNS =
  'id, user_id, name, category, subcategory, primary_color, secondary_color, pattern, material, brand, season, occasion, notes, is_favorite, image_url, source_url, source_domain, external_product_id, price, currency, import_method, deduplication_key, created_at, updated_at';

export function createSupabaseWardrobeGateway(): WardrobeGateway {
  const client = getSupabaseClient();
  return {
    async listByUser(userId) {
      return withTimeout(
        client
          .from('wardrobe_items')
          .select(WARDROBE_COLUMNS)
          .eq('user_id', userId)
          .order('created_at', { ascending: false }),
      );
    },

    async insert(payload) {
      return withTimeout(
        client.from('wardrobe_items').insert(payload).select(WARDROBE_COLUMNS).single(),
      );
    },

    async update(userId: string, itemId: string, payload: WardrobeUpdate) {
      return withTimeout(
        client
          .from('wardrobe_items')
          .update(payload)
          .eq('user_id', userId)
          .eq('id', itemId)
          .select(WARDROBE_COLUMNS)
          .maybeSingle(),
      );
    },

    async delete(userId: string, itemId: string) {
      const result = await withTimeout(
        client.from('wardrobe_items').delete().eq('user_id', userId).eq('id', itemId),
      );
      return { data: null, error: result.error };
    },
  };
}

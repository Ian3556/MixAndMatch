import { getSupabaseClient } from '@supabase';

export type SavedInspiration = { inspirationId: string; createdAt: string };
export type SavedInspirationService = {
  list: (userId: string) => Promise<SavedInspiration[]>;
  setSaved: (userId: string, inspirationId: string, saved: boolean) => Promise<void>;
};

export const savedInspirationService: SavedInspirationService = {
  async list(userId) {
    const items: SavedInspiration[] = [];
    const pageSize = 500;
    for (let offset = 0; ; offset += pageSize) {
      const { data, error } = await getSupabaseClient()
        .from('saved_inspirations')
        .select('inspiration_id, created_at')
        .eq('user_id', userId)
        .order('inspiration_id')
        .range(offset, offset + pageSize - 1);
      if (error) throw saveError(error);
      items.push(
        ...(data ?? []).map((row) => ({
          inspirationId: row.inspiration_id,
          createdAt: row.created_at,
        })),
      );
      if (!data || data.length < pageSize) return items;
    }
  },
  async setSaved(userId, inspirationId, saved) {
    const table = getSupabaseClient().from('saved_inspirations');
    const { error } = saved
      ? await table.upsert(
          { user_id: userId, inspiration_id: inspirationId },
          { onConflict: 'user_id,inspiration_id', ignoreDuplicates: true },
        )
      : await table.delete().eq('user_id', userId).eq('inspiration_id', inspirationId);
    if (error) throw saveError(error);
  },
};

function saveError(error: { code?: string }) {
  if (error.code === '42P01' || error.code === 'PGRST205') {
    return new Error('Saved inspiration is temporarily unavailable. Please try again later.');
  }
  return new Error(
    'Your saved inspirations could not be updated. Check your connection and retry.',
  );
}

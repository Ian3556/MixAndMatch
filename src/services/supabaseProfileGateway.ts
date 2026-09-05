import type { ProfileGateway } from '@/services/profileService';
import { getSupabaseClient } from '@supabase';
import type { ProfileInsert, ProfileUpdate } from '@/types/profile';
import { withTimeout } from '@/utils/promise/withTimeout';

const PROFILE_COLUMNS =
  'id, display_name, avatar_url, style_profile, onboarding_completed, created_at, updated_at';

export function createSupabaseProfileGateway(): ProfileGateway {
  const client = getSupabaseClient();

  return {
    async fetchById(userId) {
      return withTimeout(
        client.from('profiles').select(PROFILE_COLUMNS).eq('id', userId).maybeSingle(),
      );
    },

    async upsert(payload: ProfileInsert) {
      return withTimeout(
        client
          .from('profiles')
          .upsert(payload, { onConflict: 'id' })
          .select(PROFILE_COLUMNS)
          .single(),
      );
    },

    async update(userId: string, payload: ProfileUpdate) {
      return withTimeout(
        client
          .from('profiles')
          .update(payload)
          .eq('id', userId)
          .select(PROFILE_COLUMNS)
          .maybeSingle(),
      );
    },
  };
}

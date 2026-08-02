import 'react-native-url-polyfill/auto';

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import { requireSupabaseEnvironment } from '@/constants/environment';

let client: SupabaseClient | undefined;

/**
 * Returns one configuration-checked client instance.
 * Authentication persistence is deliberately disabled until the auth phase defines it.
 */
export function getSupabaseClient(): SupabaseClient {
  if (client) {
    return client;
  }

  const { supabaseUrl, supabasePublishableKey } = requireSupabaseEnvironment();

  client = createClient(supabaseUrl, supabasePublishableKey, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  });

  return client;
}

import 'react-native-url-polyfill/auto';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, processLock, type SupabaseClient } from '@supabase/supabase-js';
import { AppState, Platform } from 'react-native';

import { requireSupabaseEnvironment } from '@/constants/environment';
import type { Database } from '@/types/database';

let client: SupabaseClient<Database> | undefined;

/**
 * Returns one configuration-checked client instance with Expo-compatible auth persistence.
 */
export function getSupabaseClient(): SupabaseClient<Database> {
  if (client) {
    return client;
  }

  const { supabaseUrl, supabasePublishableKey } = requireSupabaseEnvironment();

  client = createClient(supabaseUrl, supabasePublishableKey, {
    auth: {
      ...(Platform.OS === 'web' ? {} : { storage: AsyncStorage }),
      autoRefreshToken: true,
      detectSessionInUrl: false,
      persistSession: true,
      lock: processLock,
    },
  });

  return client;
}

export function startSupabaseAutoRefresh(): () => void {
  if (Platform.OS === 'web') {
    return () => undefined;
  }

  const supabase = getSupabaseClient();

  const updateRefreshState = (state: string) => {
    if (state === 'active') {
      void supabase.auth.startAutoRefresh();
    } else {
      void supabase.auth.stopAutoRefresh();
    }
  };

  updateRefreshState(AppState.currentState);
  const subscription = AppState.addEventListener('change', updateRefreshState);

  return () => {
    subscription.remove();
    void supabase.auth.stopAutoRefresh();
  };
}

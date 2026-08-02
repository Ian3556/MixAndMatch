export const environment = Object.freeze({
  supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL?.trim() ?? '',
  supabasePublishableKey: process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ?? '',
  revenueCatPublicKey: process.env.EXPO_PUBLIC_REVENUECAT_PUBLIC_KEY?.trim() ?? '',
  storageBucket: process.env.EXPO_PUBLIC_STORAGE_BUCKET?.trim() ?? '',
});

export type PublicEnvironment = typeof environment;

export function isSupabaseConfigured(): boolean {
  return Boolean(environment.supabaseUrl && environment.supabasePublishableKey);
}

export function requireSupabaseEnvironment(): Pick<
  PublicEnvironment,
  'supabaseUrl' | 'supabasePublishableKey'
> {
  if (!isSupabaseConfigured()) {
    throw new Error(
      'Supabase is not configured. Set EXPO_PUBLIC_SUPABASE_URL and ' +
        'EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY in a local .env file.',
    );
  }

  return {
    supabaseUrl: environment.supabaseUrl,
    supabasePublishableKey: environment.supabasePublishableKey,
  };
}

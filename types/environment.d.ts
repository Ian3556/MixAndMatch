declare namespace NodeJS {
  interface ProcessEnv {
    readonly EXPO_PUBLIC_SUPABASE_URL?: string;
    readonly EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY?: string;
    readonly EXPO_PUBLIC_REVENUECAT_PUBLIC_KEY?: string;
    readonly EXPO_PUBLIC_STORAGE_BUCKET?: string;
  }
}

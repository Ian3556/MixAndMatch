import * as Linking from 'expo-linking';
import { type PropsWithChildren, useEffect } from 'react';

import { useAuthStore } from '@/store/authStore';
import { startSupabaseAutoRefresh } from '@supabase';

export function AuthBootstrap({ children }: PropsWithChildren) {
  const initialize = useAuthStore((state) => state.initialize);
  const dispose = useAuthStore((state) => state.dispose);
  const handleAuthUrl = useAuthStore((state) => state.handleAuthUrl);

  useEffect(() => {
    let stopAutoRefresh: () => void = () => undefined;

    try {
      stopAutoRefresh = startSupabaseAutoRefresh();
    } catch {
      // Initialization owns the user-facing configuration error.
    }

    const subscription = Linking.addEventListener('url', ({ url }) => {
      void handleAuthUrl(url);
    });

    const bootstrap = async () => {
      try {
        const url = await Linking.getInitialURL();
        if (url) {
          await handleAuthUrl(url);
        }
      } finally {
        await initialize();
      }
    };

    void bootstrap();

    return () => {
      subscription.remove();
      stopAutoRefresh();
      dispose();
    };
  }, [dispose, handleAuthUrl, initialize]);

  return children;
}

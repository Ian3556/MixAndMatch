import { useEffect } from 'react';

import { useAuthStore } from '@/store/authStore';
import { useStylistStore } from '@/store/stylistStore';
import { useWardrobeStore } from '@/store/wardrobeStore';

export function useStylistData() {
  const user = useAuthStore((state) => state.user);
  const profile = useAuthStore((state) => state.profile);
  const wardrobe = useWardrobeStore((state) => state.items);
  const wardrobeStatus = useWardrobeStore((state) => state.status);
  const wardrobeError = useWardrobeStore((state) => state.error);
  const loadedWardrobeUserId = useWardrobeStore((state) => state.loadedUserId);
  const refreshWardrobe = useWardrobeStore((state) => state.refresh);
  const stylistStatus = useStylistStore((state) => state.status);
  const stylistError = useStylistStore((state) => state.error);
  const loadedStylistUserId = useStylistStore((state) => state.loadedUserId);
  const hydrateStylist = useStylistStore((state) => state.hydrate);

  useEffect(() => {
    if (!user) return;
    if (loadedWardrobeUserId !== user.id || wardrobeStatus === 'idle') {
      void refreshWardrobe(user.id);
    }
  }, [loadedWardrobeUserId, refreshWardrobe, user, wardrobeStatus]);

  useEffect(() => {
    if (!user) return;
    if (loadedStylistUserId !== user.id || stylistStatus === 'idle') {
      void hydrateStylist(user.id);
    }
  }, [hydrateStylist, loadedStylistUserId, stylistStatus, user]);

  const wardrobeReady = loadedWardrobeUserId === user?.id && wardrobeStatus === 'ready';
  const stylistReady = loadedStylistUserId === user?.id && stylistStatus === 'ready';

  return {
    user,
    profile,
    wardrobe: wardrobeReady ? wardrobe : [],
    wardrobeStatus,
    stylistStatus,
    ready: Boolean(user && wardrobeReady && stylistReady),
    loading:
      Boolean(user) &&
      (!wardrobeReady || !stylistReady) &&
      wardrobeStatus !== 'error' &&
      stylistStatus !== 'error',
    error: wardrobeError ?? stylistError,
    retry: () => {
      if (!user) return;
      void Promise.all([refreshWardrobe(user.id), hydrateStylist(user.id)]);
    },
  };
}

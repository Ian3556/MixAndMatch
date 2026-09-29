import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useSavedInspirationStore } from '@/store/savedInspirationStore';

export function useSavedInspirations() {
  const userId = useAuthStore((state) => state.user?.id);
  const state = useSavedInspirationStore();
  const { load } = state;
  useEffect(() => {
    if (userId) void load(userId);
  }, [load, userId]);
  const current = Boolean(userId && state.userId === userId);
  return {
    items: current ? state.items : [],
    status: current ? state.status : 'loading',
    error: current ? state.error : null,
    pendingIds: current ? state.pendingIds : [],
    actionErrors: current ? state.actionErrors : {},
    retry: () => {
      if (userId) void load(userId, true);
    },
    toggle: (id: string) => {
      if (userId) void state.toggle(userId, id);
    },
  };
}

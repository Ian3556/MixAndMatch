import { createStore } from 'zustand/vanilla';

import type { SavedInspiration, SavedInspirationService } from '@/services/savedInspirationService';

type SavedInspirationState = {
  userId: string | null;
  items: SavedInspiration[];
  status: 'idle' | 'loading' | 'ready' | 'error';
  error: string | null;
  pendingIds: string[];
  actionErrors: Record<string, string>;
  load: (userId: string, refresh?: boolean) => Promise<void>;
  toggle: (userId: string, inspirationId: string) => Promise<void>;
  reset: () => void;
};

export function createSavedInspirationStore(service: SavedInspirationService) {
  let version = 0;
  const empty = {
    userId: null,
    items: [],
    status: 'idle',
    error: null,
    pendingIds: [],
    actionErrors: {},
  } as const;
  return createStore<SavedInspirationState>((set, get) => ({
    ...empty,
    items: [],
    pendingIds: [],
    async load(userId, refresh = false) {
      const state = get();
      if (
        state.userId === userId &&
        (state.status === 'loading' ||
          state.pendingIds.length ||
          (!refresh && state.status === 'ready'))
      )
        return;
      const request = ++version;
      set({
        userId,
        items: state.userId === userId ? state.items : [],
        status: 'loading',
        error: null,
        pendingIds: [],
        actionErrors: {},
      });
      try {
        const items = await service.list(userId);
        if (request === version) set({ items, status: 'ready' });
      } catch (error) {
        if (request === version) set({ status: 'error', error: message(error) });
      }
    },
    async toggle(userId, inspirationId) {
      const state = get();
      if (
        state.userId !== userId ||
        state.status !== 'ready' ||
        state.pendingIds.includes(inspirationId)
      )
        return;
      const request = version;
      const saved = !state.items.some((item) => item.inspirationId === inspirationId);
      const actionErrors = { ...state.actionErrors };
      delete actionErrors[inspirationId];
      set({ pendingIds: [...state.pendingIds, inspirationId], actionErrors });
      try {
        await service.setSaved(userId, inspirationId, saved);
        if (request !== version) return;
        set((current) => ({
          items: saved
            ? [{ inspirationId, createdAt: new Date().toISOString() }, ...current.items]
            : current.items.filter((item) => item.inspirationId !== inspirationId),
        }));
      } catch (error) {
        if (request === version)
          set((current) => ({
            actionErrors: { ...current.actionErrors, [inspirationId]: message(error) },
          }));
      } finally {
        if (request === version)
          set((current) => ({
            pendingIds: current.pendingIds.filter((id) => id !== inspirationId),
          }));
      }
    },
    reset() {
      version++;
      set({ ...empty, items: [], pendingIds: [] });
    },
  }));
}

function message(error: unknown) {
  return error instanceof Error ? error.message : 'Could not load saved inspiration. Try again.';
}

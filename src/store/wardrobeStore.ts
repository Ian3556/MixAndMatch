import { create } from 'zustand';

import { createSupabaseWardrobeGateway } from '@/services/supabaseWardrobeGateway';
import { createWardrobeService, type WardrobeService } from '@/services/wardrobeService';
import type {
  CreateWardrobeItemInput,
  WardrobeItem,
  WardrobeItemSaveResult,
} from '@/types/wardrobe';

type WardrobeStatus = 'idle' | 'loading' | 'ready' | 'error';

type WardrobeStore = {
  items: WardrobeItem[];
  status: WardrobeStatus;
  error: string | null;
  loadedUserId: string | null;
  refresh: (userId: string) => Promise<void>;
  addMany: (userId: string, inputs: CreateWardrobeItemInput[]) => Promise<WardrobeItemSaveResult[]>;
  toggleFavorite: (userId: string, itemId: string) => Promise<void>;
  deleteItem: (userId: string, itemId: string) => Promise<void>;
  reset: () => void;
};

let service: WardrobeService | undefined;
let requestVersion = 0;

function getService(): WardrobeService {
  service ??= createWardrobeService(createSupabaseWardrobeGateway());
  return service;
}

export const useWardrobeStore = create<WardrobeStore>((set, get) => ({
  items: [],
  status: 'idle',
  error: null,
  loadedUserId: null,

  async refresh(userId) {
    const version = ++requestVersion;
    const switchingUser = get().loadedUserId !== userId;
    set({
      status: 'loading',
      error: null,
      loadedUserId: userId,
      ...(switchingUser ? { items: [] } : {}),
    });
    try {
      const items = await getService().list(userId);
      if (version === requestVersion && get().loadedUserId === userId) {
        set({ items, status: 'ready', error: null });
      }
    } catch (error) {
      if (version === requestVersion && get().loadedUserId === userId) {
        set({
          status: 'error',
          error: error instanceof Error ? error.message : 'Your wardrobe could not be loaded.',
        });
      }
    }
  },

  async addMany(userId, inputs) {
    const results = await getService().saveMany(userId, inputs);
    const added = results
      .filter(
        (result): result is Extract<WardrobeItemSaveResult, { status: 'added' }> =>
          result.status === 'added',
      )
      .map((result) => result.item);
    if (get().loadedUserId === userId && added.length > 0) {
      set((state) => ({ items: [...added, ...state.items], status: 'ready', error: null }));
    }
    return results;
  },

  async toggleFavorite(userId, itemId) {
    const item = get().items.find((candidate) => candidate.id === itemId);
    if (!item) return;
    const updated = await getService().update(userId, itemId, { is_favorite: !item.isFavorite });
    set((state) => ({
      items: state.items.map((candidate) => (candidate.id === itemId ? updated : candidate)),
    }));
  },

  async deleteItem(userId, itemId) {
    await getService().delete(userId, itemId);
    set((state) => ({ items: state.items.filter((item) => item.id !== itemId) }));
  },

  reset() {
    requestVersion += 1;
    set({ items: [], status: 'idle', error: null, loadedUserId: null });
  },
}));

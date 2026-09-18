import { create } from 'zustand';

import { getStylingRecommendations } from '@/features/stylist/engine';
import {
  applyNeverRecommendFeedback,
  applyOutfitFeedback,
} from '@/features/stylist/personalization/feedbackEngine';
import {
  recordRecommendations,
  recordWornOutfit,
} from '@/features/stylist/personalization/wardrobeHistory';
import type {
  StylingDiagnostics,
  StylingRecommendation,
  StylingRequest,
} from '@/features/stylist/types';
import {
  EMPTY_STYLIST_USER_STATE,
  loadStylistUserState,
  saveStylistUserState,
  type OutfitFeedbackState,
  type SavedStylingLook,
  type StylistUserState,
} from '@/services/stylistPersistence';
import type { StyleProfile } from '@/types/profile';
import type { WardrobeItem } from '@/types/wardrobe';

export type StylistGeneration = {
  id: string;
  request: StylingRequest;
  recommendations: StylingRecommendation[];
  diagnostics: StylingDiagnostics;
  createdAt: string;
};

type StylistStatus = 'idle' | 'loading' | 'ready' | 'error';
type FeedbackAction = 'like' | 'dislike' | 'save' | 'wore';

type GenerateInput = {
  userId: string;
  wardrobe: readonly WardrobeItem[];
  styleProfile?: StyleProfile | null;
  request: StylingRequest;
  limit?: number;
};

type StylistStore = StylistUserState & {
  status: StylistStatus;
  error: string | null;
  loadedUserId: string | null;
  currentGeneration: StylistGeneration | null;
  hydrate: (userId: string) => Promise<void>;
  generate: (input: GenerateInput) => Promise<StylistGeneration>;
  regenerate: (input: GenerateInput) => Promise<StylistGeneration>;
  recordFeedback: (
    userId: string,
    recommendation: StylingRecommendation,
    request: StylingRequest,
    action: FeedbackAction,
  ) => Promise<void>;
  neverRecommendItem: (userId: string, itemId: string) => Promise<void>;
  findRecommendation: (outfitId: string) => StylingRecommendation | undefined;
  clearError: () => void;
  reset: () => void;
};

let hydrationVersion = 0;
let persistenceQueue = Promise.resolve();

export const useStylistStore = create<StylistStore>((set, get) => ({
  ...EMPTY_STYLIST_USER_STATE,
  status: 'idle',
  error: null,
  loadedUserId: null,
  currentGeneration: null,

  async hydrate(userId) {
    if (get().loadedUserId === userId && get().status === 'ready') return;
    const version = ++hydrationVersion;
    set({
      ...EMPTY_STYLIST_USER_STATE,
      status: 'loading',
      error: null,
      loadedUserId: userId,
      currentGeneration: null,
    });
    try {
      const persisted = await loadStylistUserState(userId);
      if (version === hydrationVersion && get().loadedUserId === userId) {
        set({ ...persisted, status: 'ready', error: null });
      }
    } catch (error) {
      if (version === hydrationVersion && get().loadedUserId === userId) {
        set({
          status: 'error',
          error:
            error instanceof Error ? error.message : 'Styling preferences could not be loaded.',
        });
      }
    }
  },

  async generate(input) {
    requireHydratedUser(get(), input.userId);
    const generation = createGeneration(input, get());
    const history = recordRecommendations(
      get().history,
      generation.recommendations,
      generation.createdAt,
    );
    set({ currentGeneration: generation, history, error: null });
    await persistCurrentState(input.userId, get, set);
    return generation;
  },

  async regenerate(input) {
    requireHydratedUser(get(), input.userId);
    let preferenceModel = get().preferenceModel;
    for (const recommendation of get().currentGeneration?.recommendations ?? []) {
      preferenceModel = applyOutfitFeedback(preferenceModel, recommendation.outfit, 'regenerate');
    }
    set({ preferenceModel });
    const generation = createGeneration(input, get());
    const history = recordRecommendations(
      get().history,
      generation.recommendations,
      generation.createdAt,
    );
    set({ currentGeneration: generation, history, error: null });
    await persistCurrentState(input.userId, get, set);
    return generation;
  },

  async recordFeedback(userId, recommendation, request, action) {
    requireHydratedUser(get(), userId);
    const currentFeedback = get().feedbackByOutfit[recommendation.outfit.id] ?? {};
    let preferenceModel = get().preferenceModel;
    let history = get().history;
    let savedLooks = get().savedLooks;
    let nextFeedback: OutfitFeedbackState = currentFeedback;

    if (action === 'like' || action === 'dislike') {
      if (currentFeedback.sentiment === action) return;
      if (currentFeedback.sentiment) {
        preferenceModel = applyOutfitFeedback(
          preferenceModel,
          recommendation.outfit,
          currentFeedback.sentiment,
          -1,
        );
      }
      preferenceModel = applyOutfitFeedback(preferenceModel, recommendation.outfit, action);
      nextFeedback = { ...currentFeedback, sentiment: action };
    }

    if (action === 'save') {
      if (savedLooks.some((look) => look.recommendation.outfit.id === recommendation.outfit.id))
        return;
      preferenceModel = applyOutfitFeedback(preferenceModel, recommendation.outfit, 'save');
      savedLooks = [
        { recommendation, request, savedAt: new Date().toISOString() },
        ...savedLooks,
      ].slice(0, 50);
    }

    if (action === 'wore') {
      if (currentFeedback.woreAt) return;
      const timestamp = new Date().toISOString();
      preferenceModel = applyOutfitFeedback(preferenceModel, recommendation.outfit, 'wore');
      history = recordWornOutfit(history, recommendation.outfit, timestamp);
      nextFeedback = { ...currentFeedback, woreAt: timestamp };
    }

    set({
      preferenceModel,
      history,
      savedLooks,
      feedbackByOutfit: {
        ...get().feedbackByOutfit,
        [recommendation.outfit.id]: nextFeedback,
      },
      error: null,
    });
    await persistCurrentState(userId, get, set);
  },

  async neverRecommendItem(userId, itemId) {
    requireHydratedUser(get(), userId);
    set({
      preferenceModel: applyNeverRecommendFeedback(get().preferenceModel, itemId),
      error: null,
    });
    await persistCurrentState(userId, get, set);
  },

  findRecommendation(outfitId) {
    return (
      get().currentGeneration?.recommendations.find(
        (recommendation) => recommendation.outfit.id === outfitId,
      ) ??
      get().savedLooks.find((look) => look.recommendation.outfit.id === outfitId)?.recommendation
    );
  },

  clearError() {
    set({ error: null });
  },

  reset() {
    hydrationVersion += 1;
    set({
      ...EMPTY_STYLIST_USER_STATE,
      status: 'idle',
      error: null,
      loadedUserId: null,
      currentGeneration: null,
    });
  },
}));

function createGeneration(input: GenerateInput, state: StylistUserState): StylistGeneration {
  const createdAt = new Date().toISOString();
  const result = getStylingRecommendations({
    wardrobe: input.wardrobe,
    ...(input.styleProfile === undefined ? {} : { styleProfile: input.styleProfile }),
    request: input.request,
    history: state.history,
    preferenceModel: state.preferenceModel,
    ...(input.limit === undefined ? {} : { limit: input.limit }),
    now: new Date(createdAt),
  });
  return {
    id: `generation-${Date.parse(createdAt).toString(36)}`,
    request: input.request,
    recommendations: result.recommendations,
    diagnostics: result.diagnostics,
    createdAt,
  };
}

function requireHydratedUser(
  state: Pick<StylistStore, 'loadedUserId' | 'status'>,
  userId: string,
): void {
  if (state.loadedUserId !== userId || state.status !== 'ready') {
    throw new Error('Styling preferences are still loading. Try again.');
  }
}

async function persistCurrentState(
  userId: string,
  get: () => StylistStore,
  set: (partial: Partial<StylistStore>) => void,
): Promise<void> {
  const state = get();
  const snapshot: StylistUserState = {
    preferenceModel: state.preferenceModel,
    history: state.history,
    savedLooks: state.savedLooks,
    feedbackByOutfit: state.feedbackByOutfit,
  };
  const write = persistenceQueue
    .catch(() => undefined)
    .then(() => saveStylistUserState(userId, snapshot));
  persistenceQueue = write;
  try {
    await write;
  } catch (error) {
    set({
      error: error instanceof Error ? error.message : 'Styling preferences could not be saved.',
    });
  }
}

export type { OutfitFeedbackState, SavedStylingLook };

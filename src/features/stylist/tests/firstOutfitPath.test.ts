import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  buildManualWardrobeInput,
  validateManualWardrobeItem,
} from '@/features/wardrobe/manual/manualWardrobeItem';
import {
  createWardrobeService,
  type WardrobeGateway,
  type WardrobeRow,
} from '@/services/wardrobeService';
import { EMPTY_STYLIST_USER_STATE } from '@/services/stylistPersistence';
import { useStylistStore } from '@/store/stylistStore';
import { createEmptyStyleProfile } from '@/types/profile';
import type { DraftWardrobeItem, WardrobeItem } from '@/types/wardrobe';
import { FIRST_OUTFIT_REQUEST, getFirstOutfitProgress } from '../presentation/firstOutfitProgress';
import { getOutfitItems } from '../types';

const storage = vi.hoisted(() => {
  const values = new Map<string, string>();
  return {
    values,
    getItem: vi.fn(async (key: string) => values.get(key) ?? null),
    setItem: vi.fn(async (key: string, value: string) => {
      values.set(key, value);
    }),
  };
});
vi.mock('@react-native-async-storage/async-storage', () => ({ default: storage }));

function wardrobeService() {
  const rows: WardrobeRow[] = [];
  const gateway: WardrobeGateway = {
    listByUser: async (id) => ({ data: rows.filter((row) => row.user_id === id), error: null }),
    insert: async (payload) => {
      // The in-memory gateway applies the database-generated id and timestamps.
      const row = {
        ...payload,
        id: `item-${rows.length}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as WardrobeRow;
      rows.push(row);
      return { data: row, error: null };
    },
    update: async () => ({ data: null, error: null }),
    delete: async () => ({ data: null, error: null }),
  };
  return createWardrobeService(gateway);
}

function draft(category: string): DraftWardrobeItem {
  return {
    name: category === 'Tops' ? 'Cotton shirt' : category === 'Bottoms' ? 'Trousers' : 'Day dress',
    category,
    imageKey: 'manual',
    imageUrl: '',
    deduplicationKey: `manual:${category}`,
    subcategory: '',
    primaryColor: '',
    secondaryColor: '',
    size: '',
    pattern: '',
    material: '',
    brand: '',
    season: '',
    occasion: '',
    notes: '',
    price: '',
    currency: '',
    isFavorite: false,
    sourceType: 'manual',
    sourceUrl: '',
  };
}

beforeEach(() => {
  storage.values.clear();
  vi.clearAllMocks();
  useStylistStore.getState().reset();
});

describe('first outfit path using the wardrobe service and actual styling engine', () => {
  it('moves from empty to one top to a usable outfit, saves it and resumes after reload', async () => {
    const service = wardrobeService();
    const wardrobe: WardrobeItem[] = [];
    const progress = () => getFirstOutfitProgress({ wardrobe }, useStylistStore.getState());
    expect(progress()).toMatchObject({ stage: 'add', category: 'Tops' });
    const top = draft('Tops');
    expect(validateManualWardrobeItem(top)).toEqual({});
    wardrobe.push(await service.create('a', buildManualWardrobeInput(top)));
    expect(progress()).toMatchObject({ stage: 'add', category: 'Bottoms' });
    wardrobe.push(await service.create('a', buildManualWardrobeInput(draft('Bottoms'))));
    expect(
      wardrobe.every(
        (item) => item.material === null && item.season === null && item.imageUrl === null,
      ),
    ).toBe(true);
    expect(progress().stage).toBe('ready');
    await useStylistStore.getState().hydrate('a');
    const generation = await useStylistStore
      .getState()
      .generate({ userId: 'a', wardrobe: await service.list('a'), request: FIRST_OUTFIT_REQUEST });
    expect(generation.recommendations.length).toBeGreaterThan(0);
    const look = generation.recommendations[0]!;
    expect(
      getOutfitItems(look.outfit)
        .map((item) => item.id)
        .sort(),
    ).toEqual(wardrobe.map((item) => item.id).sort());
    expect(progress().stage).toBe('ready');
    await useStylistStore.getState().recordFeedback('a', look, FIRST_OUTFIT_REQUEST, 'save');
    expect(progress().stage).toBe('complete');
    useStylistStore.getState().reset();
    await useStylistStore.getState().hydrate('a');
    expect(progress().stage).toBe('complete');
    expect(useStylistStore.getState().findRecommendation(look.outfit.id)).toBeDefined();
    await useStylistStore.getState().hydrate('b');
    expect(progress().stage).toBe('ready');
    expect(useStylistStore.getState().savedLooks).toEqual([]);
  });

  it('accepts one dress, but not accessories alone or a blocked combination', async () => {
    const service = wardrobeService();
    const dress = await service.create('a', buildManualWardrobeInput(draft('Dresses')));
    expect(getFirstOutfitProgress({ wardrobe: [dress] }, EMPTY_STYLIST_USER_STATE).stage).toBe(
      'ready',
    );
    expect(
      getFirstOutfitProgress(
        { wardrobe: [{ ...dress, name: 'Belt', category: 'Accessories' }] },
        EMPTY_STYLIST_USER_STATE,
      ).stage,
    ).toBe('add');
    expect(
      getFirstOutfitProgress(
        {
          wardrobe: [dress],
          preferenceModel: { preferences: [], neverRecommendItemIds: [dress.id] },
        },
        EMPTY_STYLIST_USER_STATE,
      ).stage,
    ).toBe('blocked');
    expect(
      getFirstOutfitProgress(
        {
          wardrobe: [{ ...dress, primaryColor: 'Red' }],
          styleProfile: { ...createEmptyStyleProfile(), avoidColors: ['Red'] },
        },
        EMPTY_STYLIST_USER_STATE,
      ).stage,
    ).toBe('blocked');
  });

  it('does not complete on failed storage, then supports retry and worn feedback', async () => {
    const service = wardrobeService();
    const dress = await service.create('a', buildManualWardrobeInput(draft('Dresses')));
    await useStylistStore.getState().hydrate('a');
    const generation = await useStylistStore
      .getState()
      .generate({ userId: 'a', wardrobe: [dress], request: FIRST_OUTFIT_REQUEST });
    storage.setItem.mockRejectedValueOnce(new Error('Storage full'));
    const look = generation.recommendations[0]!;
    await expect(
      useStylistStore.getState().recordFeedback('a', look, FIRST_OUTFIT_REQUEST, 'save'),
    ).rejects.toThrow('Storage full');
    expect(useStylistStore.getState().savedLooks).toEqual([]);
    expect(getFirstOutfitProgress({ wardrobe: [dress] }, useStylistStore.getState()).stage).toBe(
      'ready',
    );
    await useStylistStore.getState().recordFeedback('a', look, FIRST_OUTFIT_REQUEST, 'wore');
    useStylistStore.getState().reset();
    await useStylistStore.getState().hydrate('a');
    expect(getFirstOutfitProgress({ wardrobe: [dress] }, useStylistStore.getState()).stage).toBe(
      'complete',
    );
  });
});

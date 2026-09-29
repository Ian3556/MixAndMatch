import { describe, expect, it, vi } from 'vitest';
import type { SavedInspiration, SavedInspirationService } from '@/services/savedInspirationService';
import { createSavedInspirationStore } from './savedInspirationState';

function repository() {
  const rows = new Map<string, SavedInspiration[]>();
  const service: SavedInspirationService = {
    list: vi.fn(async (userId) => structuredClone(rows.get(userId) ?? [])),
    setSaved: vi.fn(async (userId, inspirationId, saved) => {
      const items = (rows.get(userId) ?? []).filter((item) => item.inspirationId !== inspirationId);
      rows.set(
        userId,
        saved ? [...items, { inspirationId, createdAt: '2026-09-28T00:00:00Z' }] : items,
      );
    }),
  };
  return service;
}

describe('account inspiration collection', () => {
  it('persists save and removal across fresh stores, separately for each account', async () => {
    const service = repository();
    const first = createSavedInspirationStore(service);
    await first.getState().load('a');
    await first.getState().toggle('a', 'city-minimal-uniform');
    const reopened = createSavedInspirationStore(service);
    await reopened.getState().load('a');
    expect(reopened.getState().items.map((item) => item.inspirationId)).toEqual([
      'city-minimal-uniform',
    ]);
    await reopened.getState().load('b');
    expect(reopened.getState().items).toEqual([]);
    await reopened.getState().toggle('a', 'city-minimal-uniform');
    expect(service.setSaved).toHaveBeenCalledTimes(1);
    await reopened.getState().load('a');
    await reopened.getState().toggle('a', 'city-minimal-uniform');
    await first.getState().load('a', true);
    expect(first.getState().items).toEqual([]);
  });

  it('does not claim a failed save or failed removal succeeded and allows retry', async () => {
    const service = repository();
    const store = createSavedInspirationStore(service);
    await store.getState().load('a');
    vi.mocked(service.setSaved).mockRejectedValueOnce(new Error('Offline'));
    await store.getState().toggle('a', 'look');
    expect(store.getState().items).toEqual([]);
    expect(store.getState().actionErrors.look).toBe('Offline');
    await store.getState().toggle('a', 'look');
    expect(store.getState().items).toHaveLength(1);
    vi.mocked(service.setSaved).mockRejectedValueOnce(new Error('Offline'));
    await store.getState().toggle('a', 'look');
    expect(store.getState().items).toHaveLength(1);
    await store.getState().toggle('a', 'look');
    expect(store.getState().items).toHaveLength(0);
    expect(store.getState().actionErrors).toEqual({});
  });

  it('deduplicates rapid taps and ignores a write finishing after account reset', async () => {
    const service = repository();
    const write = deferred<void>();
    vi.mocked(service.setSaved).mockReturnValueOnce(write.promise);
    const store = createSavedInspirationStore(service);
    await store.getState().load('a');
    const pending = store.getState().toggle('a', 'look');
    await store.getState().toggle('a', 'look');
    await store.getState().load('a', true);
    expect(service.setSaved).toHaveBeenCalledTimes(1);
    expect(service.list).toHaveBeenCalledTimes(1);
    expect(store.getState().items).toEqual([]);
    store.getState().reset();
    await store.getState().load('b');
    write.resolve();
    await pending;
    expect(store.getState()).toMatchObject({ userId: 'b', items: [], pendingIds: [] });
  });

  it('ignores stale reads and deduplicates concurrent loading on multiple screens', async () => {
    const service = repository();
    const read = deferred<SavedInspiration[]>();
    vi.mocked(service.list).mockReturnValueOnce(read.promise);
    const store = createSavedInspirationStore(service);
    const pending = store.getState().load('a');
    await store.getState().load('a');
    expect(service.list).toHaveBeenCalledTimes(1);
    await store.getState().load('b');
    read.resolve([{ inspirationId: 'private-a', createdAt: '' }]);
    await pending;
    expect(store.getState()).toMatchObject({ userId: 'b', items: [] });
  });

  it('keeps failed loading distinct from an empty collection', async () => {
    const service = repository();
    vi.mocked(service.list).mockRejectedValueOnce(new Error('Unavailable'));
    const store = createSavedInspirationStore(service);
    await store.getState().load('a');
    expect(store.getState().status).toBe('error');
    await store.getState().toggle('a', 'look');
    expect(service.setSaved).not.toHaveBeenCalled();
    await store.getState().load('a', true);
    expect(store.getState().status).toBe('ready');
  });
});

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((done) => {
    resolve = done;
  });
  return { promise, resolve };
}

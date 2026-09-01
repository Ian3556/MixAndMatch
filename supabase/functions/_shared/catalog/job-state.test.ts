import { describe, expect, it } from 'vitest';

import type { CatalogJobEntryState } from './types';
import { selectNextCatalogJobEntries, summarizeCatalogJobEntries } from './job-state';

const entries: CatalogJobEntryState[] = [
  {
    id: 'complete',
    sequenceNumber: 0,
    status: 'completed',
    attemptCount: 1,
    maxAttempts: 3,
    retryable: true,
  },
  {
    id: 'pending-two',
    sequenceNumber: 2,
    status: 'pending',
    attemptCount: 0,
    maxAttempts: 3,
    retryable: true,
  },
  {
    id: 'pending-one',
    sequenceNumber: 1,
    status: 'pending',
    attemptCount: 0,
    maxAttempts: 3,
    retryable: true,
  },
  {
    id: 'retry',
    sequenceNumber: 3,
    status: 'failed',
    attemptCount: 1,
    maxAttempts: 3,
    retryable: true,
  },
  {
    id: 'terminal-failure',
    sequenceNumber: 4,
    status: 'failed',
    attemptCount: 3,
    maxAttempts: 3,
    retryable: true,
  },
];

describe('catalog job resumability', () => {
  it('selects pending and retryable checkpoints in stable order without replaying completed work', () => {
    expect(selectNextCatalogJobEntries(entries, 2).map((entry) => entry.id)).toEqual([
      'pending-one',
      'pending-two',
    ]);
    expect(selectNextCatalogJobEntries(entries, 20).map((entry) => entry.id)).toEqual([
      'pending-one',
      'pending-two',
      'retry',
    ]);
  });

  it('reports terminal state only when no pending or retryable work remains', () => {
    expect(summarizeCatalogJobEntries(entries)).toMatchObject({
      completed: 1,
      failed: 2,
      pending: 2,
      retryableFailed: 1,
      terminal: false,
    });
    expect(
      summarizeCatalogJobEntries(
        entries.map((entry) =>
          entry.status === 'pending' || entry.id === 'retry'
            ? { ...entry, status: 'completed' as const }
            : entry,
        ),
      ).terminal,
    ).toBe(true);
  });
});

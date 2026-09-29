import type { CatalogJobEntryState } from './types';

export function selectNextCatalogJobEntries<T extends CatalogJobEntryState>(
  entries: T[],
  batchSize: number,
): T[] {
  const safeBatchSize = Math.max(1, Math.min(Math.floor(batchSize), 20));
  return [...entries]
    .sort((left, right) => left.sequenceNumber - right.sequenceNumber)
    .filter(
      (entry) =>
        entry.status === 'pending' ||
        (entry.status === 'failed' && entry.retryable && entry.attemptCount < entry.maxAttempts),
    )
    .slice(0, safeBatchSize);
}

export function summarizeCatalogJobEntries(entries: CatalogJobEntryState[]): {
  pending: number;
  processing: number;
  completed: number;
  duplicate: number;
  failed: number;
  skipped: number;
  retryableFailed: number;
  terminal: boolean;
} {
  const count = (status: CatalogJobEntryState['status']) =>
    entries.filter((entry) => entry.status === status).length;
  const retryableFailed = entries.filter(
    (entry) =>
      entry.status === 'failed' && entry.retryable && entry.attemptCount < entry.maxAttempts,
  ).length;
  const pending = count('pending');
  const processing = count('processing');
  return {
    pending,
    processing,
    completed: count('completed'),
    duplicate: count('duplicate'),
    failed: count('failed'),
    skipped: count('skipped'),
    retryableFailed,
    terminal: pending === 0 && processing === 0 && retryableFailed === 0,
  };
}

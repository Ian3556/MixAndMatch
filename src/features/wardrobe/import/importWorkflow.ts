import { normalizeUrl } from '@supabase/functions/_shared/wardrobe-import/normalize-product';
import type { ImportedProductCandidate } from '@supabase/functions/_shared/wardrobe-import/types';
import type {
  CreateWardrobeItemInput,
  WardrobeItem,
  WardrobeItemSaveResult,
} from '@/types/wardrobe';

export type ImportPreviewItem = {
  id: string;
  candidate: ImportedProductCandidate;
  deduplicationKey: string;
  selected: boolean;
  duplicate: boolean;
  incomplete: boolean;
};

export function createImportPreview(
  candidates: ImportedProductCandidate[],
  existingItems: WardrobeItem[],
): ImportPreviewItem[] {
  const existingKeys = new Set(existingItems.map((item) => item.deduplicationKey));
  return candidates.map((candidate, index) => {
    const deduplicationKey = createImportDeduplicationKey(candidate);
    const duplicate = existingKeys.has(deduplicationKey);
    return {
      id: `${index}:${deduplicationKey}`,
      candidate,
      deduplicationKey,
      selected: !duplicate,
      duplicate,
      incomplete: !candidate.name.trim() || !candidate.category?.trim(),
    };
  });
}

export function createImportDeduplicationKey(candidate: ImportedProductCandidate): string {
  const url = normalizeUrl(
    candidate.canonicalUrl ?? candidate.productUrl,
    candidate.productUrl,
    true,
  );
  if (url) {
    const variant = candidate.externalId ? `:variant:${candidate.externalId.toLowerCase()}` : '';
    return `url:${url.toLowerCase()}${variant}`;
  }
  if (candidate.externalId) {
    return `external:${candidate.sourceDomain.toLowerCase()}:${candidate.externalId.toLowerCase()}`;
  }
  return `name-image:${candidate.name.trim().toLowerCase()}:${candidate.imageUrl?.toLowerCase() ?? ''}`;
}

export function setAllSelected(items: ImportPreviewItem[], selected: boolean): ImportPreviewItem[] {
  return items.map((item) => ({ ...item, selected: item.duplicate ? false : selected }));
}

export function toggleImportSelection(
  items: ImportPreviewItem[],
  itemId: string,
): ImportPreviewItem[] {
  return items.map((item) =>
    item.id === itemId && !item.duplicate ? { ...item, selected: !item.selected } : item,
  );
}

export function updateImportCandidate(
  items: ImportPreviewItem[],
  itemId: string,
  candidate: ImportedProductCandidate,
): ImportPreviewItem[] {
  return items.map((item) =>
    item.id === itemId
      ? {
          ...item,
          candidate,
          deduplicationKey: createImportDeduplicationKey(candidate),
          incomplete: !candidate.name.trim() || !candidate.category?.trim(),
        }
      : item,
  );
}

export function buildWardrobeInputs(items: ImportPreviewItem[]): CreateWardrobeItemInput[] {
  return items
    .filter((item) => item.selected && !item.duplicate)
    .map(({ candidate, deduplicationKey }) => ({
      name: candidate.name.trim(),
      category: candidate.category?.trim() || 'Uncategorised',
      subcategory: candidate.subcategory ?? null,
      primaryColor: candidate.color ?? null,
      brand: candidate.brand ?? null,
      notes: candidate.description ?? null,
      imageUrl: candidate.imageUrl ?? null,
      sourceUrl: candidate.canonicalUrl ?? candidate.productUrl,
      sourceDomain: candidate.sourceDomain,
      externalProductId: candidate.externalId ?? null,
      price: candidate.price ?? null,
      currency: candidate.currency ?? null,
      importMethod: 'website-url',
      deduplicationKey,
    }));
}

export function applySaveResults(
  items: ImportPreviewItem[],
  results: WardrobeItemSaveResult[],
): ImportPreviewItem[] {
  const statusByKey = new Map(
    results.map((result) => [result.input.deduplicationKey, result.status] as const),
  );
  return items.map((item) => {
    const status = statusByKey.get(item.deduplicationKey);
    if (status === 'duplicate') return { ...item, duplicate: true, selected: false };
    if (status === 'added') return { ...item, selected: false };
    return item;
  });
}

export function summarizeSaveResults(results: WardrobeItemSaveResult[]) {
  return results.reduce(
    (summary, result) => ({ ...summary, [result.status]: summary[result.status] + 1 }),
    { added: 0, duplicate: 0, failed: 0 },
  );
}

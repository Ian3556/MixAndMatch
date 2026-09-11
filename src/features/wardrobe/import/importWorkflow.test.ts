import { describe, expect, it } from 'vitest';

import type { ImportedProductCandidate } from '@supabase/functions/_shared/wardrobe-import/types';
import type { WardrobeItem, WardrobeItemSaveResult } from '@/types/wardrobe';

import {
  applySaveResults,
  buildWardrobeInputs,
  createImportDeduplicationKey,
  createImportPreview,
  setAllSelected,
  summarizeSaveResults,
  toggleImportSelection,
  updateImportCandidate,
} from './importWorkflow';

const candidate: ImportedProductCandidate = {
  externalId: 'shirt-1',
  name: 'Shirt',
  productUrl: 'https://shop.example/products/shirt',
  sourceDomain: 'shop.example',
  extractionMethod: 'json-ld',
  confidence: 'high',
};

describe('wardrobe import workflow', () => {
  it('opens with non-duplicates selected and known duplicates excluded', () => {
    const existing = [
      { deduplicationKey: createImportDeduplicationKey(candidate) },
    ] as WardrobeItem[];
    const preview = createImportPreview(
      [candidate, { ...candidate, externalId: 'shirt-2' }],
      existing,
    );
    expect(preview.map((item) => [item.selected, item.duplicate])).toEqual([
      [false, true],
      [true, false],
    ]);
  });

  it('supports individual, select-all, and deselect-all actions without selecting duplicates', () => {
    const preview = createImportPreview([candidate, { ...candidate, externalId: 'shirt-2' }], []);
    expect(toggleImportSelection(preview, preview[0]?.id ?? '')[0]?.selected).toBe(false);
    expect(setAllSelected(preview, false).every((item) => !item.selected)).toBe(true);
    expect(setAllSelected([{ ...preview[0]!, duplicate: true }], true)[0]?.selected).toBe(false);
  });

  it('applies edits and maps selected candidates to persistence inputs', () => {
    const preview = createImportPreview([candidate], []);
    const edited = updateImportCandidate(preview, preview[0]?.id ?? '', {
      ...candidate,
      name: 'Edited Shirt',
      category: 'Tops',
      size: 'M',
    });
    expect(buildWardrobeInputs(edited)[0]).toMatchObject({
      name: 'Edited Shirt',
      category: 'Tops',
      size: 'M',
      importMethod: 'website-url',
    });
  });

  it('keeps partial failures selected while clearing saved and duplicate items', () => {
    const preview = createImportPreview(
      [candidate, { ...candidate, externalId: 'shirt-2' }, { ...candidate, externalId: 'shirt-3' }],
      [],
    );
    const inputs = buildWardrobeInputs(preview);
    const results: WardrobeItemSaveResult[] = [
      { input: inputs[0]!, status: 'added', item: {} as WardrobeItem },
      { input: inputs[1]!, status: 'duplicate' },
      { input: inputs[2]!, status: 'failed', message: 'Retry' },
    ];
    const updated = applySaveResults(preview, results);
    expect(updated.map((item) => item.selected)).toEqual([false, false, true]);
    expect(updated[1]?.duplicate).toBe(true);
    expect(summarizeSaveResults(results)).toEqual({ added: 1, duplicate: 1, failed: 1 });
  });
});

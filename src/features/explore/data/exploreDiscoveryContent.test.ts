import { describe, expect, it } from 'vitest';

import { allInspiration } from '@/fixtures/inspiration';

import { exploreDiscoveryContent } from './exploreDiscoveryContent';
import { EXPLORE_CATEGORY_OPTIONS, EXPLORE_STYLE_OPTIONS } from '../types/discovery';
import { buildMasonryColumns, filterExploreItems } from '../utils/discovery';

describe('Explore discovery content', () => {
  it('keeps stable unique ids and valid detail destinations', () => {
    const inspirationIds = new Set(allInspiration.map((item) => item.id));
    expect(new Set(exploreDiscoveryContent.map((item) => item.id)).size).toBe(
      exploreDiscoveryContent.length,
    );
    expect(exploreDiscoveryContent.every((item) => inspirationIds.has(item.inspirationId))).toBe(
      true,
    );
  });

  it('gives every displayed category and style filter at least one result', () => {
    expect(
      EXPLORE_CATEGORY_OPTIONS.every((option) =>
        exploreDiscoveryContent.some((item) => item.categoryIds.includes(option.id)),
      ),
    ).toBe(true);
    expect(
      EXPLORE_STYLE_OPTIONS.every((style) =>
        exploreDiscoveryContent.some((item) => item.style === style),
      ),
    ).toBe(true);
  });

  it('combines search, category, and style filters without duplicating results', () => {
    const results = filterExploreItems(exploreDiscoveryContent, {
      query: 'tailoring',
      categoryIds: ['outerwear', 'accessories'],
      styles: ['Minimalist', 'Old Money'],
    });

    expect(results.map((item) => item.id)).toEqual(['city-minimal-uniform', 'riviera-whites']);
  });

  it('supports multiple selections within a filter group', () => {
    const results = filterExploreItems(exploreDiscoveryContent, {
      query: '',
      categoryIds: ['dresses', 'outerwear'],
      styles: ['Formal', 'Vintage'],
    });

    expect(results.map((item) => item.id)).toEqual(['blue-hour-drape', 'archive-burgundy']);
  });

  it('balances every item into the requested masonry columns', () => {
    const columns = buildMasonryColumns(exploreDiscoveryContent, 3);
    expect(columns).toHaveLength(3);
    expect(columns.flat()).toHaveLength(exploreDiscoveryContent.length);
    expect(new Set(columns.flat().map((item) => item.id)).size).toBe(
      exploreDiscoveryContent.length,
    );
  });
});

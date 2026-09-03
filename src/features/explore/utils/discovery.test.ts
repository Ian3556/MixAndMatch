import { describe, expect, it } from 'vitest';

import type { ExploreDiscoveryItem } from '../types/discovery';
import { getRelatedExploreItems } from './discovery';

const selected = createItem({
  id: 'selected',
  style: 'Minimalist',
  categoryIds: ['tops', 'bottoms'],
  tags: ['neutral', 'city'],
});

describe('getRelatedExploreItems', () => {
  it('prioritises matching style before weaker metadata overlap', () => {
    const sameStyle = createItem({ id: 'same-style', style: 'Minimalist' });
    const sharedMetadata = createItem({
      id: 'shared-metadata',
      categoryIds: ['tops', 'bottoms'],
      tags: ['neutral', 'city'],
    });

    expect(getRelatedExploreItems([selected, sharedMetadata, sameStyle], selected)).toEqual([
      sameStyle,
      sharedMetadata,
    ]);
  });

  it('excludes the selected item and respects the requested result limit', () => {
    const first = createItem({ id: 'first', categoryIds: ['tops'] });
    const second = createItem({ id: 'second', categoryIds: ['bottoms'] });

    expect(getRelatedExploreItems([selected, first, second], selected, 1)).toEqual([first]);
  });
});

function createItem(
  overrides: Partial<ExploreDiscoveryItem> & Pick<ExploreDiscoveryItem, 'id'>,
): ExploreDiscoveryItem {
  return {
    id: overrides.id,
    title: overrides.id,
    aesthetic: overrides.aesthetic ?? 'Test aesthetic',
    description: overrides.description ?? 'Test styling description.',
    style: overrides.style ?? 'Casual',
    categoryIds: overrides.categoryIds ?? [],
    tags: overrides.tags ?? [],
    image: overrides.image ?? { kind: 'asset', key: 'featured-outfit-city-minimal' },
    imageAlt: overrides.imageAlt ?? 'Test outfit',
    imageAspectRatio: overrides.imageAspectRatio ?? 4 / 5,
    inspirationId: overrides.inspirationId ?? overrides.id,
  };
}

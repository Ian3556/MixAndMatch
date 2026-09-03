import type { ExploreDiscoveryItem, ExploreFilterCriteria } from '../types/discovery';

export function filterExploreItems(
  items: readonly ExploreDiscoveryItem[],
  criteria: ExploreFilterCriteria,
) {
  const normalizedQuery = criteria.query.trim().toLowerCase();

  return items.filter((item) => {
    const searchableText = [
      item.title,
      item.aesthetic,
      item.style,
      ...item.categoryIds,
      ...item.tags,
    ]
      .join(' ')
      .toLowerCase();
    const matchesQuery = normalizedQuery.length === 0 || searchableText.includes(normalizedQuery);
    const matchesCategory =
      criteria.categoryIds.length === 0 ||
      criteria.categoryIds.some((categoryId) => item.categoryIds.includes(categoryId));
    const matchesStyle = criteria.styles.length === 0 || criteria.styles.includes(item.style);

    return matchesQuery && matchesCategory && matchesStyle;
  });
}

export function buildMasonryColumns<T extends { imageAspectRatio: number }>(
  items: readonly T[],
  columnCount: number,
) {
  const safeColumnCount = Math.max(1, columnCount);
  const columns: T[][] = Array.from({ length: safeColumnCount }, () => []);
  const estimatedHeights = Array.from({ length: safeColumnCount }, () => 0);

  for (const item of items) {
    let shortestColumn = 0;
    for (let index = 1; index < safeColumnCount; index += 1) {
      if ((estimatedHeights[index] ?? 0) < (estimatedHeights[shortestColumn] ?? 0)) {
        shortestColumn = index;
      }
    }
    columns[shortestColumn]?.push(item);
    estimatedHeights[shortestColumn] =
      (estimatedHeights[shortestColumn] ?? 0) + 1 / item.imageAspectRatio + 0.32;
  }

  return columns;
}

export function getRelatedExploreItems(
  items: readonly ExploreDiscoveryItem[],
  selectedItem: ExploreDiscoveryItem,
  limit = 6,
) {
  return items
    .map((item, index) => ({
      index,
      item,
      score: scoreExploreSimilarity(selectedItem, item),
    }))
    .filter(({ item }) => item.id !== selectedItem.id)
    .sort((left, right) => right.score - left.score || left.index - right.index)
    .slice(0, Math.max(0, limit))
    .map(({ item }) => item);
}

function scoreExploreSimilarity(
  selectedItem: ExploreDiscoveryItem,
  candidate: ExploreDiscoveryItem,
) {
  let score = 0;

  if (selectedItem.style === candidate.style) score += 12;
  if (selectedItem.aesthetic === candidate.aesthetic) score += 8;
  score += countSharedValues(selectedItem.categoryIds, candidate.categoryIds) * 3;
  score += countSharedValues(selectedItem.tags, candidate.tags) * 2;

  return score;
}

function countSharedValues<T>(left: readonly T[], right: readonly T[]) {
  return left.reduce((count, value) => count + (right.includes(value) ? 1 : 0), 0);
}

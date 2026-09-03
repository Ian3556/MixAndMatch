import { exploreDiscoveryContent } from '../data/exploreDiscoveryContent';
import type { ExploreDiscoveryItem } from '../types/discovery';

/** Async boundary for replacing local editorial content with a repository or API later. */
export function getExploreDiscoveryContent(): Promise<readonly ExploreDiscoveryItem[]> {
  return Promise.resolve(exploreDiscoveryContent);
}

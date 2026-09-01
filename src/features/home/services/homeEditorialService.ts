import { homeEditorialContent } from '../data/homeEditorialContent';
import type { HomeEditorialContent } from '../types/editorial';

/** Async boundary for replacing local editorial data with a repository or API later. */
export function getHomeEditorialContent(): Promise<HomeEditorialContent> {
  return Promise.resolve(homeEditorialContent);
}

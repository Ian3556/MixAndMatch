export const OCCASION_RELATIONSHIPS: Record<string, readonly string[]> = {
  casual: ['everyday', 'university', 'weekend', 'travel'],
  everyday: ['casual', 'university', 'weekend', 'travel'],
  university: ['casual', 'everyday', 'weekend'],
  work: ['business-casual', 'smart-casual'],
  'business-casual': ['work', 'smart-casual', 'dinner'],
  formal: ['event', 'events', 'dinner'],
  date: ['dinner', 'party', 'smart-casual'],
  dinner: ['date', 'business-casual', 'formal', 'party'],
  party: ['date', 'dinner', 'event', 'events'],
  travel: ['casual', 'everyday', 'outdoor'],
  sport: ['outdoor', 'casual'],
  outdoor: ['sport', 'travel', 'casual'],
  weekend: ['casual', 'everyday', 'travel'],
};

export const OCCASION_FORMALITY: Record<string, number> = {
  casual: 2,
  everyday: 3,
  university: 3,
  weekend: 3,
  travel: 3,
  outdoor: 3,
  sport: 1,
  date: 5,
  dinner: 6,
  'smart-casual': 6,
  'business-casual': 7,
  work: 7,
  party: 7,
  event: 8,
  events: 8,
  formal: 10,
};

export function areOccasionsRelated(left: string, right: string): boolean {
  if (left === right) return true;
  return (
    OCCASION_RELATIONSHIPS[left]?.includes(right) === true ||
    OCCASION_RELATIONSHIPS[right]?.includes(left) === true
  );
}

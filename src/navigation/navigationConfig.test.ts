import { describe, expect, it } from 'vitest';

import { isMainTabRootRoute, MAIN_TAB_CONFIG } from './navigationConfig';
import {
  EXPLORE_ROUTES,
  HOME_ROUTES,
  MAIN_ROUTES,
  PROFILE_ROUTES,
  STYLIST_ROUTES,
  WARDROBE_ROUTES,
} from './routes';

describe('Phase 2 navigation configuration', () => {
  it('defines the five stable tab routes once with unique labels and icons', () => {
    expect(MAIN_TAB_CONFIG).toHaveLength(5);
    expect(MAIN_TAB_CONFIG.map((item) => item.route)).toEqual([
      MAIN_ROUTES.HOME_TAB,
      MAIN_ROUTES.EXPLORE_TAB,
      MAIN_ROUTES.STYLIST_TAB,
      MAIN_ROUTES.WARDROBE_TAB,
      MAIN_ROUTES.PROFILE_TAB,
    ]);
    expect(MAIN_TAB_CONFIG.map(({ label, icon }) => [label, icon])).toEqual([
      ['Home', 'home'],
      ['Explore', 'explore'],
      ['Stylist', 'stylist'],
      ['Wardrobe', 'wardrobe'],
      ['Profile', 'profile'],
    ]);
    expect(new Set(MAIN_TAB_CONFIG.map((item) => item.label)).size).toBe(5);
    expect(new Set(MAIN_TAB_CONFIG.map((item) => item.icon)).size).toBe(5);
  });

  it('keeps every nested stack route unique within its stack', () => {
    for (const stack of [
      HOME_ROUTES,
      EXPLORE_ROUTES,
      WARDROBE_ROUTES,
      STYLIST_ROUTES,
      PROFILE_ROUTES,
    ]) {
      const routes = Object.values(stack);
      expect(new Set(routes).size).toBe(routes.length);
    }
  });

  it('registers the complete add-item and outfit workflow route sequences', () => {
    expect(Object.values(WARDROBE_ROUTES)).toEqual(
      expect.arrayContaining([
        'ImportWardrobeWebsite',
        'AddItemEntry',
        'AddItemImage',
        'AddItemDetails',
        'AddItemReview',
        'WardrobeItemDetail',
      ]),
    );
    expect(Object.values(STYLIST_ROUTES)).toEqual(
      expect.arrayContaining([
        'OutfitGoal',
        'OutfitPreferences',
        'OutfitGenerating',
        'OutfitResult',
        'OutfitDetail',
      ]),
    );
  });

  it('shows the bottom tab bar only at each tab stack root', () => {
    expect(isMainTabRootRoute(MAIN_ROUTES.HOME_TAB)).toBe(true);
    expect(isMainTabRootRoute(MAIN_ROUTES.EXPLORE_TAB, EXPLORE_ROUTES.EXPLORE)).toBe(true);
    expect(isMainTabRootRoute(MAIN_ROUTES.EXPLORE_TAB, EXPLORE_ROUTES.INSPIRATION_DETAIL)).toBe(
      false,
    );
    expect(isMainTabRootRoute(MAIN_ROUTES.STYLIST_TAB, STYLIST_ROUTES.OUTFIT_DETAIL)).toBe(false);
    expect(isMainTabRootRoute('UnknownTab')).toBe(false);
  });
});

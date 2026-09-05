import {
  EXPLORE_ROUTES,
  HOME_ROUTES,
  MAIN_ROUTES,
  PROFILE_ROUTES,
  STYLIST_ROUTES,
  WARDROBE_ROUTES,
} from './routes';

export type TabIconKey = 'home' | 'explore' | 'wardrobe' | 'stylist' | 'profile';

export const MAIN_TAB_CONFIG = [
  { route: MAIN_ROUTES.HOME_TAB, label: 'Home', icon: 'home' },
  { route: MAIN_ROUTES.EXPLORE_TAB, label: 'Explore', icon: 'explore' },
  { route: MAIN_ROUTES.STYLIST_TAB, label: 'Stylist', icon: 'stylist' },
  { route: MAIN_ROUTES.WARDROBE_TAB, label: 'Wardrobe', icon: 'wardrobe' },
  { route: MAIN_ROUTES.PROFILE_TAB, label: 'Profile', icon: 'profile' },
] as const satisfies readonly {
  route: (typeof MAIN_ROUTES)[keyof typeof MAIN_ROUTES];
  label: string;
  icon: TabIconKey;
}[];

type MainTabRouteName = (typeof MAIN_ROUTES)[keyof typeof MAIN_ROUTES];

export const MAIN_TAB_ROOT_ROUTES: Record<MainTabRouteName, string> = {
  [MAIN_ROUTES.HOME_TAB]: HOME_ROUTES.HOME,
  [MAIN_ROUTES.EXPLORE_TAB]: EXPLORE_ROUTES.EXPLORE,
  [MAIN_ROUTES.STYLIST_TAB]: STYLIST_ROUTES.STYLIST,
  [MAIN_ROUTES.WARDROBE_TAB]: WARDROBE_ROUTES.WARDROBE,
  [MAIN_ROUTES.PROFILE_TAB]: PROFILE_ROUTES.PROFILE,
};

export function getTabConfig(routeName: string) {
  return MAIN_TAB_CONFIG.find((item) => item.route === routeName);
}

export function isMainTabRootRoute(tabRouteName: string, nestedRouteName?: string) {
  const rootRoute = MAIN_TAB_ROOT_ROUTES[tabRouteName as MainTabRouteName];
  return Boolean(rootRoute) && (!nestedRouteName || nestedRouteName === rootRoute);
}

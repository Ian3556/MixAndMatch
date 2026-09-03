import { MAIN_ROUTES } from './routes';

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

export function getTabConfig(routeName: string) {
  return MAIN_TAB_CONFIG.find((item) => item.route === routeName);
}

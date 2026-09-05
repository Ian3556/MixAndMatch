import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { FloatingTabBar } from './FloatingTabBar';
import { getTabConfig } from './navigationConfig';
import { MAIN_ROUTES } from './routes';
import { TabBarIcon } from './TabBarIcon';
import {
  ExploreTabNavigator,
  HomeTabNavigator,
  ProfileTabNavigator,
  StylistTabNavigator,
  WardrobeTabNavigator,
} from './TabNavigators';
import type { MainTabParamList } from './types';

const Tabs = createBottomTabNavigator<MainTabParamList>();

export function MainAppNavigator() {
  return (
    <Tabs.Navigator
      backBehavior="history"
      tabBar={FloatingTabBar}
      screenOptions={({ route }) => {
        const config = getTabConfig(route.name);
        const prominent = route.name === MAIN_ROUTES.STYLIST_TAB;
        return {
          headerShown: false,
          tabBarAccessibilityLabel: `${config?.label ?? route.name} tab`,
          tabBarHideOnKeyboard: true,
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} icon={config?.icon ?? 'home'} prominent={prominent} />
          ),
          tabBarLabel: config?.label ?? route.name,
        };
      }}
    >
      <Tabs.Screen component={HomeTabNavigator} name={MAIN_ROUTES.HOME_TAB} />
      <Tabs.Screen component={ExploreTabNavigator} name={MAIN_ROUTES.EXPLORE_TAB} />
      <Tabs.Screen component={StylistTabNavigator} name={MAIN_ROUTES.STYLIST_TAB} />
      <Tabs.Screen component={WardrobeTabNavigator} name={MAIN_ROUTES.WARDROBE_TAB} />
      <Tabs.Screen component={ProfileTabNavigator} name={MAIN_ROUTES.PROFILE_TAB} />
    </Tabs.Navigator>
  );
}

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ExploreScreen } from '@/features/explore/screens/ExploreScreen';
import { ExploreOutfitDetailScreen } from '@/features/explore/screens/ExploreOutfitDetailScreen';
import { SearchResultsScreen } from '@/features/explore/screens/SearchResultsScreen';
import { StyleCategoryScreen } from '@/features/explore/screens/StyleCategoryScreen';
import { HomeScreen } from '@/features/home/screens/HomeScreen';
import { InspirationDetailScreen } from '@/features/home/screens/InspirationDetailScreen';
import { CatalogDevelopmentScreen } from '@/features/catalog/screens/CatalogDevelopmentScreen';
import { AboutScreen } from '@/features/profile/screens/AboutScreen';
import { AccountSettingsScreen } from '@/features/profile/screens/AccountSettingsScreen';
import { AppearanceSettingsScreen } from '@/features/profile/screens/AppearanceSettingsScreen';
import { BodyProfileScreen } from '@/features/profile/screens/BodyProfileScreen';
import { ColorPreferencesScreen } from '@/features/profile/screens/ColorPreferencesScreen';
import { EditProfileScreen } from '@/features/profile/screens/EditProfileScreen';
import { FitPreferencesScreen } from '@/features/profile/screens/FitPreferencesScreen';
import { HelpAndSupportScreen } from '@/features/profile/screens/HelpAndSupportScreen';
import { NotificationSettingsScreen } from '@/features/profile/screens/NotificationSettingsScreen';
import { OccasionsScreen } from '@/features/profile/screens/OccasionsScreen';
import { PreferredStylesScreen } from '@/features/profile/screens/PreferredStylesScreen';
import { PrivacySettingsScreen } from '@/features/profile/screens/PrivacySettingsScreen';
import { ProfileScreen } from '@/features/profile/screens/ProfileScreen';
import { StyleProfileScreen } from '@/features/profile/screens/StyleProfileScreen';
import { OutfitDetailScreen } from '@/features/stylist/screens/OutfitDetailScreen';
import { OutfitGeneratingScreen } from '@/features/stylist/screens/OutfitGeneratingScreen';
import { OutfitGoalScreen } from '@/features/stylist/screens/OutfitGoalScreen';
import { OutfitPreferencesScreen } from '@/features/stylist/screens/OutfitPreferencesScreen';
import { OutfitResultScreen } from '@/features/stylist/screens/OutfitResultScreen';
import { StylistScreen } from '@/features/stylist/screens/StylistScreen';
import { AddItemDetailsScreen } from '@/features/wardrobe/screens/AddItemDetailsScreen';
import { AddItemEntryScreen } from '@/features/wardrobe/screens/AddItemEntryScreen';
import { AddItemImageScreen } from '@/features/wardrobe/screens/AddItemImageScreen';
import { AddItemReviewScreen } from '@/features/wardrobe/screens/AddItemReviewScreen';
import { WardrobeItemDetailScreen } from '@/features/wardrobe/screens/WardrobeItemDetailScreen';
import { ImportWardrobeWebsiteScreen } from '@/features/wardrobe/screens/ImportWardrobeWebsiteScreen';
import { WardrobeScreen } from '@/features/wardrobe/screens/WardrobeScreen';
import { isCatalogDevToolsEnabled } from '@/constants/catalogDevTools';

import {
  EXPLORE_ROUTES,
  HOME_ROUTES,
  PROFILE_ROUTES,
  STYLIST_ROUTES,
  WARDROBE_ROUTES,
} from './routes';
import type {
  ExploreStackParamList,
  HomeStackParamList,
  ProfileStackParamList,
  StylistStackParamList,
  WardrobeStackParamList,
} from './types';

const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const ExploreStack = createNativeStackNavigator<ExploreStackParamList>();
const WardrobeStack = createNativeStackNavigator<WardrobeStackParamList>();
const StylistStack = createNativeStackNavigator<StylistStackParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();
const screenOptions = { headerShown: false } as const;

export function HomeTabNavigator() {
  return (
    <HomeStack.Navigator screenOptions={screenOptions}>
      <HomeStack.Screen component={HomeScreen} name={HOME_ROUTES.HOME} />
      <HomeStack.Screen component={InspirationDetailScreen} name={HOME_ROUTES.INSPIRATION_DETAIL} />
    </HomeStack.Navigator>
  );
}

export function ExploreTabNavigator() {
  return (
    <ExploreStack.Navigator screenOptions={screenOptions}>
      <ExploreStack.Screen component={ExploreScreen} name={EXPLORE_ROUTES.EXPLORE} />
      <ExploreStack.Screen component={SearchResultsScreen} name={EXPLORE_ROUTES.SEARCH_RESULTS} />
      <ExploreStack.Screen component={StyleCategoryScreen} name={EXPLORE_ROUTES.STYLE_CATEGORY} />
      <ExploreStack.Screen
        component={ExploreOutfitDetailScreen}
        name={EXPLORE_ROUTES.INSPIRATION_DETAIL}
      />
    </ExploreStack.Navigator>
  );
}

export function WardrobeTabNavigator() {
  return (
    <WardrobeStack.Navigator screenOptions={screenOptions}>
      <WardrobeStack.Screen component={WardrobeScreen} name={WARDROBE_ROUTES.WARDROBE} />
      <WardrobeStack.Screen
        component={ImportWardrobeWebsiteScreen}
        name={WARDROBE_ROUTES.IMPORT_WEBSITE}
      />
      <WardrobeStack.Screen component={AddItemEntryScreen} name={WARDROBE_ROUTES.ADD_ITEM_ENTRY} />
      <WardrobeStack.Screen component={AddItemImageScreen} name={WARDROBE_ROUTES.ADD_ITEM_IMAGE} />
      <WardrobeStack.Screen
        component={AddItemDetailsScreen}
        name={WARDROBE_ROUTES.ADD_ITEM_DETAILS}
      />
      <WardrobeStack.Screen
        component={AddItemReviewScreen}
        name={WARDROBE_ROUTES.ADD_ITEM_REVIEW}
      />
      <WardrobeStack.Screen
        component={WardrobeItemDetailScreen}
        name={WARDROBE_ROUTES.ITEM_DETAIL}
      />
    </WardrobeStack.Navigator>
  );
}

export function StylistTabNavigator() {
  return (
    <StylistStack.Navigator screenOptions={screenOptions}>
      <StylistStack.Screen component={StylistScreen} name={STYLIST_ROUTES.STYLIST} />
      <StylistStack.Screen component={OutfitGoalScreen} name={STYLIST_ROUTES.OUTFIT_GOAL} />
      <StylistStack.Screen
        component={OutfitPreferencesScreen}
        name={STYLIST_ROUTES.OUTFIT_PREFERENCES}
      />
      <StylistStack.Screen
        component={OutfitGeneratingScreen}
        name={STYLIST_ROUTES.OUTFIT_GENERATING}
      />
      <StylistStack.Screen component={OutfitResultScreen} name={STYLIST_ROUTES.OUTFIT_RESULT} />
      <StylistStack.Screen component={OutfitDetailScreen} name={STYLIST_ROUTES.OUTFIT_DETAIL} />
    </StylistStack.Navigator>
  );
}

export function ProfileTabNavigator() {
  return (
    <ProfileStack.Navigator screenOptions={screenOptions}>
      <ProfileStack.Screen component={ProfileScreen} name={PROFILE_ROUTES.PROFILE} />
      <ProfileStack.Screen component={EditProfileScreen} name={PROFILE_ROUTES.EDIT_PROFILE} />
      <ProfileStack.Screen component={StyleProfileScreen} name={PROFILE_ROUTES.STYLE_PROFILE} />
      <ProfileStack.Screen component={BodyProfileScreen} name={PROFILE_ROUTES.BODY_PROFILE} />
      <ProfileStack.Screen
        component={PreferredStylesScreen}
        name={PROFILE_ROUTES.PREFERRED_STYLES}
      />
      <ProfileStack.Screen component={ColorPreferencesScreen} name={PROFILE_ROUTES.COLOR} />
      <ProfileStack.Screen component={OccasionsScreen} name={PROFILE_ROUTES.OCCASIONS} />
      <ProfileStack.Screen component={FitPreferencesScreen} name={PROFILE_ROUTES.FIT_PREFERENCES} />
      <ProfileStack.Screen component={AccountSettingsScreen} name={PROFILE_ROUTES.ACCOUNT} />
      <ProfileStack.Screen component={AppearanceSettingsScreen} name={PROFILE_ROUTES.APPEARANCE} />
      <ProfileStack.Screen
        component={NotificationSettingsScreen}
        name={PROFILE_ROUTES.NOTIFICATIONS}
      />
      <ProfileStack.Screen component={PrivacySettingsScreen} name={PROFILE_ROUTES.PRIVACY} />
      <ProfileStack.Screen component={HelpAndSupportScreen} name={PROFILE_ROUTES.HELP} />
      <ProfileStack.Screen component={AboutScreen} name={PROFILE_ROUTES.ABOUT} />
      {isCatalogDevToolsEnabled() ? (
        <ProfileStack.Screen
          component={CatalogDevelopmentScreen}
          name={PROFILE_ROUTES.CATALOG_DEVELOPMENT}
        />
      ) : null}
    </ProfileStack.Navigator>
  );
}

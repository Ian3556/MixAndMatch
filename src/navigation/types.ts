import type { NavigatorScreenParams } from '@react-navigation/native';

import type { DraftWardrobeItem } from '@/types/wardrobe';

export type AuthStackParamList = {
  Welcome: undefined;
  SignUp: undefined;
  SignIn: undefined;
  ForgotPassword: undefined;
  ResetPassword: undefined;
  EmailVerification: undefined;
};

export type HomeStackParamList = {
  Home: undefined;
  InspirationDetail: { inspirationId: string };
};

export type ExploreStackParamList = {
  Explore: undefined;
  SearchResults: { query: string };
  StyleCategory: { categoryId: string; title: string };
  InspirationDetail:
    | { itemId: string; inspirationId?: never }
    | {
        inspirationId: string;
        itemId?: never;
      };
};

export type WardrobeStackParamList = {
  Wardrobe: undefined;
  ImportWardrobeWebsite: undefined;
  AddItemEntry: undefined;
  AddItemImage: { source: 'camera' | 'gallery' | 'online' | 'manual' };
  AddItemDetails: { imageKey: string };
  AddItemReview: { draft: DraftWardrobeItem };
  WardrobeItemDetail: { itemId: string };
};

export type StylistStackParamList = {
  Stylist: undefined;
  OutfitGoal: undefined;
  OutfitPreferences: { occasion: string; style: string };
  OutfitGenerating: { occasion: string; style: string };
  OutfitResult: { outfitId: string };
  OutfitDetail: { outfitId: string };
};

export type ProfileStackParamList = {
  Profile: undefined;
  EditProfile: undefined;
  AccountSettings: undefined;
  AppearanceSettings: undefined;
  NotificationSettings: undefined;
  PrivacySettings: undefined;
  HelpAndSupport: undefined;
  About: undefined;
  CatalogDevelopment: undefined;
};

export type MainTabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList> | undefined;
  ExploreTab: NavigatorScreenParams<ExploreStackParamList> | undefined;
  StylistTab: NavigatorScreenParams<StylistStackParamList> | undefined;
  WardrobeTab: NavigatorScreenParams<WardrobeStackParamList> | undefined;
  ProfileTab: NavigatorScreenParams<ProfileStackParamList> | undefined;
};

export type OnboardingStackParamList = {
  ProfileSetup: undefined;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList> | undefined;
  Main: NavigatorScreenParams<MainTabParamList> | undefined;
  Onboarding: NavigatorScreenParams<OnboardingStackParamList> | undefined;
};

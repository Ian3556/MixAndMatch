import type { NavigatorScreenParams } from '@react-navigation/native';

import type { StylingRequest } from '@/features/stylist/types';
import type { DraftWardrobeItem, ManualWardrobeItemPrefill } from '@/types/wardrobe';
import type { CatalogBrandSourceStatus } from '@/types/catalogDatabase';

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
  Wardrobe: { notice?: string } | undefined;
  BrowseBrands: undefined;
  BrandProducts: { brandId: string; brandName: string; brandStatus: CatalogBrandSourceStatus };
  CatalogProduct: { productId: string };
  ImportWardrobeWebsite: undefined;
  AddItemEntry: undefined;
  AddItemImage: { source: 'camera' | 'gallery' | 'online' | 'manual' };
  AddItemDetails: { imageKey: string; initialDraft?: ManualWardrobeItemPrefill };
  AddItemReview: { draft: DraftWardrobeItem };
  WardrobeItemDetail: { itemId: string };
};

export type StylistStackParamList = {
  Stylist: undefined;
  OutfitGoal:
    | {
        selectedItemId?: string;
        occasion?: string;
        desiredStyle?: string;
      }
    | undefined;
  OutfitPreferences: { request: StylingRequest };
  OutfitGenerating: { request: StylingRequest };
  OutfitResult: { generationId: string };
  OutfitDetail: { outfitId: string };
};

export type ProfileStackParamList = {
  Profile: undefined;
  EditProfile: undefined;
  StyleProfile: undefined;
  BodyProfile: undefined;
  PreferredStyles: undefined;
  ColorPreferences: undefined;
  Occasions: undefined;
  FitPreferences: undefined;
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

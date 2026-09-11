export const ROOT_ROUTES = {
  AUTH: 'Auth',
  MAIN: 'Main',
  ONBOARDING: 'Onboarding',
} as const;

export type RootRouteName = (typeof ROOT_ROUTES)[keyof typeof ROOT_ROUTES];

export const AUTH_ROUTES = {
  WELCOME: 'Welcome',
  SIGN_UP: 'SignUp',
  SIGN_IN: 'SignIn',
  FORGOT_PASSWORD: 'ForgotPassword',
  RESET_PASSWORD: 'ResetPassword',
  EMAIL_VERIFICATION: 'EmailVerification',
} as const;

export const ONBOARDING_ROUTES = {
  PROFILE_SETUP: 'ProfileSetup',
} as const;

export const MAIN_ROUTES = {
  HOME_TAB: 'HomeTab',
  EXPLORE_TAB: 'ExploreTab',
  STYLIST_TAB: 'StylistTab',
  WARDROBE_TAB: 'WardrobeTab',
  PROFILE_TAB: 'ProfileTab',
} as const;

export const HOME_ROUTES = {
  HOME: 'Home',
  INSPIRATION_DETAIL: 'InspirationDetail',
} as const;

export const EXPLORE_ROUTES = {
  EXPLORE: 'Explore',
  SEARCH_RESULTS: 'SearchResults',
  STYLE_CATEGORY: 'StyleCategory',
  INSPIRATION_DETAIL: 'InspirationDetail',
} as const;

export const WARDROBE_ROUTES = {
  WARDROBE: 'Wardrobe',
  BROWSE_BRANDS: 'BrowseBrands',
  BRAND_PRODUCTS: 'BrandProducts',
  CATALOG_PRODUCT: 'CatalogProduct',
  IMPORT_WEBSITE: 'ImportWardrobeWebsite',
  ADD_ITEM_ENTRY: 'AddItemEntry',
  ADD_ITEM_IMAGE: 'AddItemImage',
  ADD_ITEM_DETAILS: 'AddItemDetails',
  ADD_ITEM_REVIEW: 'AddItemReview',
  ITEM_DETAIL: 'WardrobeItemDetail',
} as const;

export const STYLIST_ROUTES = {
  STYLIST: 'Stylist',
  OUTFIT_GOAL: 'OutfitGoal',
  OUTFIT_PREFERENCES: 'OutfitPreferences',
  OUTFIT_GENERATING: 'OutfitGenerating',
  OUTFIT_RESULT: 'OutfitResult',
  OUTFIT_DETAIL: 'OutfitDetail',
} as const;

export const PROFILE_ROUTES = {
  PROFILE: 'Profile',
  EDIT_PROFILE: 'EditProfile',
  STYLE_PROFILE: 'StyleProfile',
  BODY_PROFILE: 'BodyProfile',
  PREFERRED_STYLES: 'PreferredStyles',
  COLOR: 'ColorPreferences',
  OCCASIONS: 'Occasions',
  FIT_PREFERENCES: 'FitPreferences',
  ACCOUNT: 'AccountSettings',
  APPEARANCE: 'AppearanceSettings',
  NOTIFICATIONS: 'NotificationSettings',
  PRIVACY: 'PrivacySettings',
  HELP: 'HelpAndSupport',
  ABOUT: 'About',
  CATALOG_DEVELOPMENT: 'CatalogDevelopment',
} as const;

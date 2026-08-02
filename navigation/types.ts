import type { NavigatorScreenParams } from '@react-navigation/native';

/**
 * Future flow parameter lists stay intentionally empty until their screens exist.
 * Keeping each flow named now prevents route ownership from leaking across features.
 */
export type AuthStackParamList = Record<string, object | undefined>;
export type MainStackParamList = Record<string, object | undefined>;
export type SettingsStackParamList = Record<string, object | undefined>;
export type AdminStackParamList = Record<string, object | undefined>;
export type OnboardingStackParamList = Record<string, object | undefined>;

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList> | undefined;
  Main: NavigatorScreenParams<MainStackParamList> | undefined;
  Settings: NavigatorScreenParams<SettingsStackParamList> | undefined;
  Admin: NavigatorScreenParams<AdminStackParamList> | undefined;
  Onboarding: NavigatorScreenParams<OnboardingStackParamList> | undefined;
};

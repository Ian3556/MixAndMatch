import type { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Welcome: undefined;
  SignUp: undefined;
  SignIn: undefined;
  ForgotPassword: undefined;
  ResetPassword: undefined;
  EmailVerification: undefined;
};

export type MainStackParamList = {
  Home: undefined;
  Settings: undefined;
  Admin: undefined;
};

export type OnboardingStackParamList = {
  ProfileSetup: undefined;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList> | undefined;
  Main: NavigatorScreenParams<MainStackParamList> | undefined;
  Onboarding: NavigatorScreenParams<OnboardingStackParamList> | undefined;
};

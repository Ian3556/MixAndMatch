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
  HOME: 'Home',
  SETTINGS: 'Settings',
  ADMIN: 'Admin',
} as const;

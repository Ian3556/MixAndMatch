export const ROOT_ROUTES = {
  AUTH: 'Auth',
  MAIN: 'Main',
  SETTINGS: 'Settings',
  ADMIN: 'Admin',
  ONBOARDING: 'Onboarding',
} as const;

export type RootRouteName = (typeof ROOT_ROUTES)[keyof typeof ROOT_ROUTES];

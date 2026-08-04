export type DevelopmentQuickLoginCredentials = {
  email: string;
  password: string;
};

export function resolveDevelopmentQuickLoginCredentials(
  isDevelopment: boolean,
  email: string | undefined,
  password: string | undefined,
): DevelopmentQuickLoginCredentials | null {
  if (!isDevelopment) return null;

  const normalizedEmail = email?.trim() ?? '';
  if (!normalizedEmail || !password) return null;

  return { email: normalizedEmail, password };
}

export function getDevelopmentQuickLoginCredentials(): DevelopmentQuickLoginCredentials | null {
  const isDevelopment = typeof __DEV__ !== 'undefined' && __DEV__;

  return resolveDevelopmentQuickLoginCredentials(
    isDevelopment,
    process.env.EXPO_PUBLIC_TEST_LOGIN_EMAIL,
    process.env.EXPO_PUBLIC_TEST_LOGIN_PASSWORD,
  );
}

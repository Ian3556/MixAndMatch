export function resolveCatalogDevToolsEnabled(
  isDevelopment: boolean,
  configuredValue: string | undefined,
): boolean {
  return isDevelopment && configuredValue?.trim().toLowerCase() === 'true';
}

export function isCatalogDevToolsEnabled(): boolean {
  const isDevelopment = typeof __DEV__ !== 'undefined' && __DEV__;
  return resolveCatalogDevToolsEnabled(
    isDevelopment,
    process.env.EXPO_PUBLIC_ENABLE_CATALOG_DEV_TOOLS,
  );
}

import { createContext, type PropsWithChildren, useContext, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';

import { darkTheme, lightTheme, type AppTheme } from './theme';

export type ThemePreference = 'system' | 'light' | 'dark';

export type AppThemeContextValue = AppTheme & {
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
};

const ThemeContext = createContext<AppThemeContextValue | null>(null);

export function AppThemeProvider({ children }: PropsWithChildren) {
  const colorScheme = useColorScheme();
  const [preference, setPreference] = useState<ThemePreference>('system');
  const isDark = preference === 'dark' || (preference === 'system' && colorScheme === 'dark');
  const theme = isDark ? darkTheme : lightTheme;
  const value = useMemo(() => ({ ...theme, preference, setPreference }), [preference, theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme(): AppThemeContextValue {
  const theme = useContext(ThemeContext);

  if (!theme) {
    throw new Error('useAppTheme must be used inside AppThemeProvider.');
  }

  return theme;
}

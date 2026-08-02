import { createContext, type PropsWithChildren, useContext } from 'react';
import { useColorScheme } from 'react-native';

import { darkTheme, lightTheme, type AppTheme } from './theme';

const ThemeContext = createContext<AppTheme | null>(null);

export function AppThemeProvider({ children }: PropsWithChildren) {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

export function useAppTheme(): AppTheme {
  const theme = useContext(ThemeContext);

  if (!theme) {
    throw new Error('useAppTheme must be used inside AppThemeProvider.');
  }

  return theme;
}

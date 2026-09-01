import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
  type Theme as NavigationTheme,
} from '@react-navigation/native';

import { darkColors, lightColors, type ThemeColors } from './colors';
import { radii, type Radii } from './radii';
import { shadows, type Shadows } from './shadows';
import { spacing, type Spacing } from './spacing';
import { typography, type Typography } from './typography';

export type AppTheme = {
  isDark: boolean;
  colors: ThemeColors;
  spacing: Spacing;
  typography: Typography;
  radii: Radii;
  shadows: Shadows;
  navigationTheme: NavigationTheme;
};

function createTheme(
  isDark: boolean,
  colors: ThemeColors,
  baseNavigationTheme: NavigationTheme,
): AppTheme {
  return {
    isDark,
    colors,
    spacing,
    typography,
    radii,
    shadows,
    navigationTheme: {
      ...baseNavigationTheme,
      colors: {
        ...baseNavigationTheme.colors,
        primary: colors.primary,
        background: colors.background,
        card: colors.surface,
        text: colors.text,
        border: colors.border,
        notification: colors.danger,
      },
    },
  };
}

export const lightTheme = createTheme(false, lightColors, NavigationDefaultTheme);
export const darkTheme = createTheme(true, darkColors, NavigationDarkTheme);

import { Platform, type TextStyle } from 'react-native';

const systemFont = Platform.select({
  ios: 'System',
  android: 'sans-serif',
  default: 'system-ui',
});

const systemFontMedium = Platform.select({
  ios: 'System',
  android: 'sans-serif-medium',
  default: 'system-ui',
});

const editorialFont = Platform.select({
  ios: 'Georgia',
  android: 'serif',
  default: 'Georgia',
});

export const typography = {
  fontFamily: {
    regular: systemFont ?? 'System',
    medium: systemFontMedium ?? 'System',
    bold: systemFont ?? 'System',
    editorial: editorialFont ?? 'serif',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
    xxxl: 40,
  },
  lineHeight: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 32,
    xxl: 40,
    xxxl: 48,
  },
  fontWeight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  } satisfies Record<string, NonNullable<TextStyle['fontWeight']>>,
} as const;

export type Typography = typeof typography;

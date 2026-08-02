import type { ViewStyle } from 'react-native';

export const shadows = {
  none: {} satisfies ViewStyle,
  sm: {
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  } satisfies ViewStyle,
  md: {
    elevation: 5,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  } satisfies ViewStyle,
  lg: {
    elevation: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.16,
    shadowRadius: 20,
  } satisfies ViewStyle,
} as const;

export type Shadows = typeof shadows;

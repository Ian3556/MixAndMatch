import { Pressable, StyleSheet, Text } from 'react-native';

import { useAppTheme, type AppTheme } from '@/theme';

type IconButtonProps = {
  label: string;
  symbol: string;
  onPress: () => void;
  selected?: boolean;
};

export function IconButton({ label, symbol, onPress, selected = false }: IconButtonProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      hitSlop={4}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        selected ? styles.selected : null,
        pressed ? styles.pressed : null,
      ]}
    >
      <Text style={[styles.symbol, selected ? styles.selectedSymbol : null]}>{symbol}</Text>
    </Pressable>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    button: {
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
      borderRadius: theme.radii.full,
      borderWidth: 1,
      height: 44,
      justifyContent: 'center',
      width: 44,
    },
    selected: {
      backgroundColor: theme.colors.primarySoft,
      borderColor: theme.colors.primary,
    },
    symbol: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSize.lg,
      lineHeight: theme.typography.lineHeight.lg,
      textAlign: 'center',
    },
    selectedSymbol: {
      color: theme.colors.primary,
    },
    pressed: {
      opacity: 0.72,
    },
  });
}

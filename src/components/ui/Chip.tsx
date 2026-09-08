import { Pressable, StyleSheet, Text } from 'react-native';

import { useAppTheme, type AppTheme } from '@/theme';

type ChipProps = {
  label: string;
  selected?: boolean;
  square?: boolean;
  onPress: () => void;
};

export function Chip({ label, selected = false, square = false, onPress }: ChipProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        square ? styles.square : null,
        selected ? styles.selected : null,
        pressed ? styles.pressed : null,
      ]}
    >
      <Text numberOfLines={1} style={[styles.label, selected ? styles.selectedLabel : null]}>
        {label}
      </Text>
      {selected ? <Text style={styles.check}> ✓</Text> : null}
    </Pressable>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    chip: {
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
      borderRadius: theme.radii.full,
      borderWidth: 1,
      flexDirection: 'row',
      minHeight: 44,
      paddingHorizontal: theme.spacing.md,
    },
    selected: {
      backgroundColor: theme.colors.primarySoft,
      borderColor: theme.colors.primary,
    },
    square: {
      borderRadius: theme.radii.none,
    },
    label: {
      color: theme.colors.textMuted,
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.medium,
    },
    selectedLabel: {
      color: theme.colors.primary,
      fontWeight: theme.typography.fontWeight.semibold,
    },
    check: { color: theme.colors.primary },
    pressed: { opacity: 0.75 },
  });
}

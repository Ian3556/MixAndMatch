import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAppTheme, type AppTheme } from '@/theme';

import { getColorHex } from '../styleProfileOptions';

type PreferenceChoiceGroupProps = {
  colors?: boolean;
  label?: string;
  onToggle: (value: string) => void;
  options: readonly string[];
  selected: string[];
};

export function PreferenceChoiceGroup({
  colors = false,
  label,
  onToggle,
  options,
  selected,
}: PreferenceChoiceGroupProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.group}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View accessibilityRole="list" style={styles.options}>
        {options.map((option) => {
          const isSelected = selected.includes(option);
          const color = colors ? getColorHex(option) : undefined;
          return (
            <Pressable
              accessibilityLabel={option}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: isSelected }}
              key={option}
              onPress={() => onToggle(option)}
              style={({ pressed }) => [
                styles.option,
                isSelected ? styles.optionSelected : null,
                pressed ? styles.pressed : null,
              ]}
            >
              {color ? <View style={[styles.swatch, { backgroundColor: color }]} /> : null}
              <Text style={[styles.optionText, isSelected ? styles.optionTextSelected : null]}>
                {option}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export function togglePreference(values: string[], value: string): string[] {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    group: { gap: theme.spacing.sm },
    label: {
      color: theme.colors.textMuted,
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.xs,
      fontWeight: theme.typography.fontWeight.semibold,
      letterSpacing: 1,
      textTransform: 'uppercase',
    },
    options: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
    option: {
      alignItems: 'center',
      borderColor: theme.colors.border,
      borderWidth: 1,
      flexDirection: 'row',
      gap: theme.spacing.sm,
      minHeight: 42,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
    },
    optionSelected: { backgroundColor: theme.colors.text, borderColor: theme.colors.text },
    optionText: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.sm,
    },
    optionTextSelected: { color: theme.colors.background },
    swatch: {
      borderColor: theme.colors.border,
      borderRadius: theme.radii.full,
      borderWidth: 1,
      height: 16,
      width: 16,
    },
    pressed: { opacity: 0.62 },
  });
}

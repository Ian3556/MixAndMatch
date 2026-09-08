import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAppTheme, type AppTheme } from '@/theme';

import { OptionSheet } from './OptionSheet';

type SelectFieldProps = {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
  error?: string | undefined;
};

export function SelectField({ label, value, options, onChange, error }: SelectFieldProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const [isOpen, setIsOpen] = useState(false);
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <Pressable
        accessibilityLabel={label}
        accessibilityRole="button"
        accessibilityValue={{ text: value || 'Not selected' }}
        onPress={() => setIsOpen(true)}
        style={({ pressed }) => [
          styles.control,
          error ? styles.controlError : null,
          pressed ? styles.pressed : null,
        ]}
      >
        <Text style={[styles.value, value ? null : styles.placeholder]}>
          {value || `Select ${label.toLowerCase()}`}
        </Text>
        <Text style={styles.chevron}>⌄</Text>
      </Pressable>
      {error ? (
        <Text accessibilityLiveRegion="polite" style={styles.error}>
          {error}
        </Text>
      ) : null}
      <OptionSheet
        onDismiss={() => setIsOpen(false)}
        onSelect={(option) => {
          onChange(option);
          setIsOpen(false);
        }}
        options={options}
        selected={value}
        title={label}
        visible={isOpen}
      />
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    field: { gap: theme.spacing.sm },
    label: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.semibold,
    },
    control: {
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
      borderRadius: theme.radii.md,
      borderWidth: 1,
      flexDirection: 'row',
      minHeight: 52,
      paddingHorizontal: theme.spacing.md,
    },
    controlError: { borderColor: theme.colors.danger },
    value: { color: theme.colors.text, flex: 1, fontSize: theme.typography.fontSize.md },
    placeholder: { color: theme.colors.textMuted },
    chevron: { color: theme.colors.textMuted, fontSize: theme.typography.fontSize.lg },
    error: {
      color: theme.colors.danger,
      fontFamily: theme.typography.fontFamily.regular,
      fontSize: theme.typography.fontSize.sm,
      lineHeight: theme.typography.lineHeight.sm,
    },
    pressed: { opacity: 0.75 },
  });
}

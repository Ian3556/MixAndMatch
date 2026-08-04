import { ActivityIndicator, Pressable, StyleSheet, Text, type PressableProps } from 'react-native';

import { useAppTheme, type AppTheme } from '@/theme';

type ActionButtonProps = Omit<PressableProps, 'children' | 'style'> & {
  label: string;
  loading?: boolean | undefined;
  variant?: 'primary' | 'secondary' | 'text' | undefined;
};

export function ActionButton({
  label,
  loading = false,
  disabled = false,
  variant = 'primary',
  ...pressableProps
}: ActionButtonProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        pressed && !isDisabled ? styles.pressed : null,
        isDisabled ? styles.disabled : null,
      ]}
      {...pressableProps}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? theme.colors.surface : theme.colors.primary}
        />
      ) : (
        <Text style={[styles.label, styles[`${variant}Label`]]}>{label}</Text>
      )}
    </Pressable>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    base: {
      alignItems: 'center',
      borderRadius: theme.radii.md,
      borderWidth: 1,
      justifyContent: 'center',
      minHeight: 52,
      paddingHorizontal: theme.spacing.lg,
    },
    primary: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    secondary: {
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
    },
    text: {
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      minHeight: 44,
    },
    label: {
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.md,
      fontWeight: theme.typography.fontWeight.semibold,
      lineHeight: theme.typography.lineHeight.md,
      textAlign: 'center',
    },
    primaryLabel: {
      color: theme.colors.surface,
    },
    secondaryLabel: {
      color: theme.colors.text,
    },
    textLabel: {
      color: theme.colors.primary,
    },
    pressed: {
      opacity: 0.82,
    },
    disabled: {
      opacity: 0.55,
    },
  });
}

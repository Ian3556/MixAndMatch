import { forwardRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { useAppTheme, type AppTheme } from '@/theme';

type FormTextInputProps = Omit<TextInputProps, 'style'> & {
  label: string;
  error?: string | undefined;
};

export const FormTextInput = forwardRef<TextInput, FormTextInputProps>(function FormTextInput(
  { label, error, secureTextEntry = false, ...inputProps },
  ref,
) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const isPassword = secureTextEntry;

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputShell, error ? styles.inputShellError : null]}>
        <TextInput
          ref={ref}
          accessibilityLabel={label}
          placeholderTextColor={theme.colors.textMuted}
          secureTextEntry={isPassword && !isPasswordVisible}
          selectionColor={theme.colors.primary}
          style={styles.input}
          {...inputProps}
        />
        {isPassword ? (
          <Pressable
            accessibilityLabel={isPasswordVisible ? `Hide ${label}` : `Show ${label}`}
            accessibilityRole="button"
            hitSlop={8}
            onPress={() => setIsPasswordVisible((visible) => !visible)}
            style={styles.visibilityButton}
          >
            <Text style={styles.visibilityLabel}>{isPasswordVisible ? 'Hide' : 'Show'}</Text>
          </Pressable>
        ) : null}
      </View>
      {error ? (
        <Text accessibilityLiveRegion="polite" style={styles.error}>
          {error}
        </Text>
      ) : null}
    </View>
  );
});

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    field: {
      gap: theme.spacing.sm,
    },
    label: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.semibold,
      lineHeight: theme.typography.lineHeight.sm,
    },
    inputShell: {
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
      borderRadius: theme.radii.md,
      borderWidth: 1,
      flexDirection: 'row',
      minHeight: 52,
    },
    inputShellError: {
      borderColor: theme.colors.danger,
    },
    input: {
      color: theme.colors.text,
      flex: 1,
      fontFamily: theme.typography.fontFamily.regular,
      fontSize: theme.typography.fontSize.md,
      lineHeight: theme.typography.lineHeight.md,
      minHeight: 50,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
    },
    visibilityButton: {
      alignItems: 'center',
      alignSelf: 'stretch',
      justifyContent: 'center',
      paddingHorizontal: theme.spacing.md,
    },
    visibilityLabel: {
      color: theme.colors.primary,
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.semibold,
    },
    error: {
      color: theme.colors.danger,
      fontFamily: theme.typography.fontFamily.regular,
      fontSize: theme.typography.fontSize.sm,
      lineHeight: theme.typography.lineHeight.sm,
    },
  });
}

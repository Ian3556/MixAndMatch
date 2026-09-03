import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { useAppTheme, type AppTheme } from '@/theme';

type SearchBarProps = {
  value: string;
  onChangeText: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  square?: boolean;
  submitLabel?: string;
};

export function SearchBar({
  value,
  onChangeText,
  onSubmit,
  placeholder = 'Search styles and pieces',
  square = false,
  submitLabel = 'Go',
}: SearchBarProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <View style={[styles.shell, square ? styles.squareShell : null]}>
      <Text accessibilityElementsHidden style={styles.icon}>
        ⌕
      </Text>
      <TextInput
        accessibilityLabel="Search"
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textMuted}
        returnKeyType="search"
        style={styles.input}
        value={value}
      />
      <Pressable
        accessibilityLabel="Submit search"
        accessibilityRole="button"
        onPress={onSubmit}
        style={({ pressed }) => [styles.submitButton, pressed ? styles.pressed : null]}
      >
        <Text style={[styles.submit, submitLabel === '→' ? styles.submitArrow : null]}>
          {submitLabel}
        </Text>
      </Pressable>
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    shell: {
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
      borderRadius: theme.radii.lg,
      borderWidth: 1,
      flexDirection: 'row',
      minHeight: 52,
      paddingHorizontal: theme.spacing.md,
    },
    squareShell: { borderRadius: 0 },
    icon: {
      color: theme.colors.textMuted,
      fontSize: theme.typography.fontSize.xl,
    },
    input: {
      color: theme.colors.text,
      flex: 1,
      fontFamily: theme.typography.fontFamily.regular,
      fontSize: theme.typography.fontSize.md,
      minHeight: 50,
      paddingHorizontal: theme.spacing.sm,
    },
    submitButton: {
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 44,
      minWidth: 44,
    },
    submit: {
      color: theme.colors.primary,
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.semibold,
    },
    submitArrow: {
      fontSize: theme.typography.fontSize.xl,
      lineHeight: theme.typography.lineHeight.xl,
    },
    pressed: { opacity: 0.68 },
  });
}

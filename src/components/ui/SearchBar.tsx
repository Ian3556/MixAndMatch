import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { useAppTheme, type AppTheme } from '@/theme';

type SearchBarProps = {
  value: string;
  onChangeText: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  square?: boolean;
};

export function SearchBar({
  value,
  onChangeText,
  onSubmit,
  placeholder = 'Search styles and pieces',
  square = false,
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
      <Pressable accessibilityLabel="Submit search" accessibilityRole="button" onPress={onSubmit}>
        <Text style={styles.submit}>Go</Text>
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
    submit: {
      color: theme.colors.primary,
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.semibold,
      padding: theme.spacing.sm,
    },
  });
}

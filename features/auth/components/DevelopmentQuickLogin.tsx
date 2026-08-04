import { StyleSheet, Text, View } from 'react-native';

import { ActionButton } from '@/components/ActionButton';
import { useAppTheme, type AppTheme } from '@/theme';

type DevelopmentQuickLoginProps = {
  configured: boolean;
  loading: boolean;
  disabled: boolean;
  onPress: () => void;
};

export function DevelopmentQuickLogin({
  configured,
  loading,
  disabled,
  onPress,
}: DevelopmentQuickLoginProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  if (typeof __DEV__ === 'undefined' || !__DEV__) return null;

  return (
    <View accessibilityRole="summary" style={styles.container}>
      <View style={styles.heading}>
        <Text style={styles.eyebrow}>DEVELOPMENT ONLY</Text>
        <Text style={styles.title}>Testing shortcut</Text>
      </View>
      <Text style={styles.description}>
        {configured
          ? 'Sign in through Supabase with the dedicated test account configured on this device.'
          : 'Set EXPO_PUBLIC_TEST_LOGIN_EMAIL and EXPO_PUBLIC_TEST_LOGIN_PASSWORD in .env.local to enable Quick Login.'}
      </Text>
      <ActionButton
        accessibilityLabel="Quick Login with test account"
        disabled={disabled || !configured}
        label="Quick Login"
        loading={loading}
        onPress={onPress}
        variant="secondary"
      />
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    container: {
      backgroundColor: theme.colors.primarySoft,
      borderColor: theme.colors.primary,
      borderRadius: theme.radii.lg,
      borderWidth: 1,
      gap: theme.spacing.sm,
      padding: theme.spacing.md,
    },
    heading: {
      gap: theme.spacing.xxs,
    },
    eyebrow: {
      color: theme.colors.primary,
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.xs,
      fontWeight: theme.typography.fontWeight.semibold,
      letterSpacing: 1.1,
      lineHeight: theme.typography.lineHeight.xs,
    },
    title: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.bold,
      fontSize: theme.typography.fontSize.md,
      fontWeight: theme.typography.fontWeight.bold,
      lineHeight: theme.typography.lineHeight.md,
    },
    description: {
      color: theme.colors.textMuted,
      fontFamily: theme.typography.fontFamily.regular,
      fontSize: theme.typography.fontSize.sm,
      lineHeight: theme.typography.lineHeight.sm,
    },
  });
}

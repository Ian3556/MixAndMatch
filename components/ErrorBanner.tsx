import { StyleSheet, Text, View } from 'react-native';

import { useAppTheme, type AppTheme } from '@/theme';

type ErrorBannerProps = {
  message: string;
};

export function ErrorBanner({ message }: ErrorBannerProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <View accessibilityLiveRegion="polite" accessibilityRole="alert" style={styles.container}>
      <Text style={styles.title}>Something needs attention</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    container: {
      backgroundColor: theme.isDark ? '#321C1E' : '#FFF0F1',
      borderColor: theme.colors.danger,
      borderRadius: theme.radii.md,
      borderWidth: 1,
      gap: theme.spacing.xs,
      padding: theme.spacing.md,
    },
    title: {
      color: theme.colors.danger,
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.semibold,
      lineHeight: theme.typography.lineHeight.sm,
    },
    message: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.regular,
      fontSize: theme.typography.fontSize.sm,
      lineHeight: theme.typography.lineHeight.sm,
    },
  });
}

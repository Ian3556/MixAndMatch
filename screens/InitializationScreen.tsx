import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppTheme, type AppTheme } from '@/theme';

export function InitializationScreen() {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <Text style={styles.brand}>MIX &amp; MATCH</Text>
        <ActivityIndicator color={theme.colors.primary} size="large" />
        <Text accessibilityLiveRegion="polite" style={styles.message}>
          Restoring your session…
        </Text>
      </View>
    </SafeAreaView>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    safeArea: {
      backgroundColor: theme.colors.background,
      flex: 1,
    },
    content: {
      alignItems: 'center',
      flex: 1,
      gap: theme.spacing.lg,
      justifyContent: 'center',
      padding: theme.spacing.xl,
    },
    brand: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.bold,
      fontSize: theme.typography.fontSize.xl,
      fontWeight: theme.typography.fontWeight.bold,
      letterSpacing: 2,
      lineHeight: theme.typography.lineHeight.xl,
    },
    message: {
      color: theme.colors.textMuted,
      fontFamily: theme.typography.fontFamily.regular,
      fontSize: theme.typography.fontSize.md,
      lineHeight: theme.typography.lineHeight.md,
      textAlign: 'center',
    },
  });
}

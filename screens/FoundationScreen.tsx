import type { RouteProp } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootStackParamList } from '@/navigation/types';
import { useAppTheme, type AppTheme } from '@/theme';

type FoundationRoute = RouteProp<RootStackParamList, keyof RootStackParamList>;

export function FoundationScreen() {
  const route = useRoute<FoundationRoute>();
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.eyebrow}>MIX &amp; MATCH</Text>
        <Text style={styles.title}>Phase 0 foundation</Text>
        <Text style={styles.body}>
          The {route.name} flow is registered. Product screens and behavior are intentionally not
          implemented in this phase.
        </Text>
      </View>
    </SafeAreaView>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    container: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: theme.spacing.xl,
    },
    eyebrow: {
      color: theme.colors.primary,
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.xs,
      fontWeight: theme.typography.fontWeight.semibold,
      letterSpacing: 1.6,
      lineHeight: theme.typography.lineHeight.xs,
      marginBottom: theme.spacing.sm,
    },
    title: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.bold,
      fontSize: theme.typography.fontSize.xxxl,
      fontWeight: theme.typography.fontWeight.bold,
      letterSpacing: -0.8,
      lineHeight: theme.typography.lineHeight.xxxl,
      marginBottom: theme.spacing.md,
    },
    body: {
      color: theme.colors.textMuted,
      fontFamily: theme.typography.fontFamily.regular,
      fontSize: theme.typography.fontSize.md,
      fontWeight: theme.typography.fontWeight.regular,
      lineHeight: theme.typography.lineHeight.md,
      maxWidth: 520,
    },
  });
}

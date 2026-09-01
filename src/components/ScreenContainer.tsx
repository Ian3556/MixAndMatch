import type { PropsWithChildren, ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppTheme, type AppTheme } from '@/theme';

type ScreenContainerProps = PropsWithChildren<{
  title: string;
  description?: string | undefined;
  eyebrow?: string | undefined;
  footer?: ReactNode | undefined;
}>;

export function ScreenContainer({
  title,
  description,
  eyebrow = 'MIX & MATCH',
  footer,
  children,
}: ScreenContainerProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            <View style={styles.header}>
              {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
              <Text accessibilityRole="header" style={styles.title}>
                {title}
              </Text>
              {description ? <Text style={styles.description}>{description}</Text> : null}
            </View>
            <View style={styles.body}>{children}</View>
            {footer ? <View style={styles.footer}>{footer}</View> : null}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    safeArea: {
      backgroundColor: theme.colors.background,
      flex: 1,
    },
    keyboardView: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
    },
    content: {
      alignSelf: 'center',
      flex: 1,
      justifyContent: 'center',
      maxWidth: 560,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.xxl,
      width: '100%',
    },
    header: {
      marginBottom: theme.spacing.xl,
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
      fontSize: theme.typography.fontSize.xxl,
      fontWeight: theme.typography.fontWeight.bold,
      letterSpacing: -0.6,
      lineHeight: theme.typography.lineHeight.xxl,
    },
    description: {
      color: theme.colors.textMuted,
      fontFamily: theme.typography.fontFamily.regular,
      fontSize: theme.typography.fontSize.md,
      lineHeight: theme.typography.lineHeight.md,
      marginTop: theme.spacing.md,
    },
    body: {
      gap: theme.spacing.md,
    },
    footer: {
      marginTop: theme.spacing.xl,
    },
  });
}

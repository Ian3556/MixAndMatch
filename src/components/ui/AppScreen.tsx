import type { PropsWithChildren, ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  type ScrollViewProps,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppTheme, type AppTheme } from '@/theme';

import { AppHeader } from './AppHeader';

type AppScreenProps = PropsWithChildren<{
  title: string;
  subtitle?: string;
  eyebrow?: string;
  onBack?: () => void;
  actions?: ReactNode;
  hideHeader?: boolean;
  scrollProps?: Omit<ScrollViewProps, 'contentContainerStyle'>;
}>;

export function AppScreen({
  title,
  subtitle,
  eyebrow,
  onBack,
  actions,
  hideHeader = false,
  scrollProps,
  children,
}: AppScreenProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          {...scrollProps}
        >
          {hideHeader ? null : (
            <AppHeader
              actions={actions}
              eyebrow={eyebrow}
              onBack={onBack}
              subtitle={subtitle}
              title={title}
            />
          )}
          <View style={styles.body}>{children}</View>
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
    content: {
      alignSelf: 'center',
      gap: theme.spacing.xl,
      maxWidth: 900,
      paddingBottom: theme.spacing.xxxl,
      paddingHorizontal: theme.spacing.md,
      paddingTop: theme.spacing.md,
      width: '100%',
    },
    body: {
      gap: theme.spacing.xl,
    },
  });
}

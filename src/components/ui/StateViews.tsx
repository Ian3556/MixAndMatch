import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { useAppTheme, type AppTheme } from '@/theme';

type StateAction = { label: string; onPress: () => void };

type MessageStateProps = {
  title: string;
  message: string;
  symbol: string;
  action?: StateAction;
};

function MessageState({ title, message, symbol, action }: MessageStateProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.messageState}>
      <View style={styles.symbolShell}>
        <Text style={styles.symbol}>{symbol}</Text>
      </View>
      <Text accessibilityRole="header" style={styles.title}>
        {title}
      </Text>
      <Text style={styles.message}>{message}</Text>
      {action ? (
        <Pressable accessibilityRole="button" onPress={action.onPress} style={styles.action}>
          <Text style={styles.actionLabel}>{action.label}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function EmptyState(props: Omit<MessageStateProps, 'symbol'> & { symbol?: string }) {
  return <MessageState symbol={props.symbol ?? '◇'} {...props} />;
}

export function ErrorState(props: Omit<MessageStateProps, 'symbol'>) {
  return <MessageState symbol="!" {...props} />;
}

export function LoadingState({ title, message }: { title: string; message: string }) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  return (
    <View accessibilityLiveRegion="polite" style={styles.messageState}>
      <ActivityIndicator color={theme.colors.primary} size="large" />
      <Text accessibilityRole="header" style={styles.title}>
        {title}
      </Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

export function SkeletonCard() {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  return (
    <View accessibilityLabel="Content loading" style={styles.skeletonCard}>
      <View style={styles.skeletonImage} />
      <View style={styles.skeletonLineWide} />
      <View style={styles.skeletonLine} />
    </View>
  );
}

export function DeferredNotice({ children }: { children: string }) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  return (
    <View accessibilityRole="summary" style={styles.notice}>
      <Text style={styles.noticeTitle}>Phase 3 boundary</Text>
      <Text style={styles.noticeBody}>{children}</Text>
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    messageState: {
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
      borderRadius: theme.radii.xl,
      borderWidth: 1,
      gap: theme.spacing.sm,
      padding: theme.spacing.xl,
    },
    symbolShell: {
      alignItems: 'center',
      backgroundColor: theme.colors.primarySoft,
      borderRadius: theme.radii.full,
      height: 56,
      justifyContent: 'center',
      marginBottom: theme.spacing.xs,
      width: 56,
    },
    symbol: { color: theme.colors.primary, fontSize: theme.typography.fontSize.xl },
    title: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.bold,
      fontSize: theme.typography.fontSize.lg,
      fontWeight: theme.typography.fontWeight.bold,
      lineHeight: theme.typography.lineHeight.lg,
      textAlign: 'center',
    },
    message: {
      color: theme.colors.textMuted,
      fontFamily: theme.typography.fontFamily.regular,
      fontSize: theme.typography.fontSize.sm,
      lineHeight: theme.typography.lineHeight.sm,
      maxWidth: 440,
      textAlign: 'center',
    },
    action: {
      alignItems: 'center',
      backgroundColor: theme.colors.primary,
      borderRadius: theme.radii.md,
      justifyContent: 'center',
      marginTop: theme.spacing.sm,
      minHeight: 48,
      paddingHorizontal: theme.spacing.lg,
    },
    actionLabel: {
      color: theme.colors.surface,
      fontFamily: theme.typography.fontFamily.medium,
      fontWeight: theme.typography.fontWeight.semibold,
    },
    skeletonCard: { gap: theme.spacing.sm, minWidth: 150 },
    skeletonImage: {
      aspectRatio: 4 / 5,
      backgroundColor: theme.colors.surfaceMuted,
      borderRadius: theme.radii.lg,
    },
    skeletonLineWide: {
      backgroundColor: theme.colors.surfaceMuted,
      borderRadius: theme.radii.full,
      height: 14,
      width: '80%',
    },
    skeletonLine: {
      backgroundColor: theme.colors.surfaceMuted,
      borderRadius: theme.radii.full,
      height: 12,
      width: '52%',
    },
    notice: {
      backgroundColor: theme.colors.primarySoft,
      borderColor: theme.colors.primary,
      borderRadius: theme.radii.md,
      borderWidth: 1,
      gap: theme.spacing.xs,
      padding: theme.spacing.md,
    },
    noticeTitle: {
      color: theme.colors.primary,
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.semibold,
    },
    noticeBody: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.regular,
      fontSize: theme.typography.fontSize.sm,
      lineHeight: theme.typography.lineHeight.sm,
    },
  });
}

import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useAppTheme, type AppTheme } from '@/theme';

import { IconButton } from './IconButton';

type AppHeaderProps = {
  title: string;
  subtitle?: string | undefined;
  eyebrow?: string | undefined;
  onBack?: (() => void) | undefined;
  actions?: ReactNode | undefined;
};

export function AppHeader({ title, subtitle, eyebrow, onBack, actions }: AppHeaderProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.header}>
      {onBack ? <IconButton label="Go back" onPress={onBack} symbol="‹" /> : null}
      <View style={styles.copy}>
        {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
        {title ? (
          <Text accessibilityRole="header" numberOfLines={2} style={styles.title}>
            {title}
          </Text>
        ) : null}
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {actions ? <View style={styles.actions}>{actions}</View> : null}
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    header: {
      alignItems: 'flex-start',
      flexDirection: 'row',
      gap: theme.spacing.md,
      justifyContent: 'space-between',
    },
    copy: {
      flex: 1,
    },
    eyebrow: {
      color: theme.colors.primary,
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.xs,
      fontWeight: theme.typography.fontWeight.semibold,
      letterSpacing: 1.2,
      lineHeight: theme.typography.lineHeight.xs,
      marginBottom: theme.spacing.xs,
      textTransform: 'uppercase',
    },
    title: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.bold,
      fontSize: theme.typography.fontSize.xxl,
      fontWeight: theme.typography.fontWeight.bold,
      letterSpacing: -0.6,
      lineHeight: theme.typography.lineHeight.xxl,
    },
    subtitle: {
      color: theme.colors.textMuted,
      fontFamily: theme.typography.fontFamily.regular,
      fontSize: theme.typography.fontSize.sm,
      lineHeight: theme.typography.lineHeight.sm,
      marginTop: theme.spacing.xs,
    },
    actions: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: theme.spacing.sm,
    },
  });
}

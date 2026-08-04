import type { PropsWithChildren } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useAppTheme, type AppTheme } from '@/theme';

export function SettingsGroup({ title, children }: PropsWithChildren<{ title?: string }>) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  return (
    <View style={styles.group}>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      <View style={styles.rows}>{children}</View>
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    group: { gap: theme.spacing.sm },
    title: {
      color: theme.colors.textMuted,
      fontSize: theme.typography.fontSize.xs,
      fontWeight: theme.typography.fontWeight.semibold,
      letterSpacing: 1.1,
      paddingHorizontal: theme.spacing.sm,
      textTransform: 'uppercase',
    },
    rows: {
      borderColor: theme.colors.border,
      borderRadius: theme.radii.lg,
      borderWidth: 1,
      overflow: 'hidden',
    },
  });
}

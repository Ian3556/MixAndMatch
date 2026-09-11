import { StyleSheet, View } from 'react-native';

import { useAppTheme, type AppTheme } from '@/theme';

export function CatalogBrowseSkeleton({ rows = 5 }: { rows?: number }) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  return (
    <View accessibilityLabel="Catalog loading" style={styles.list}>
      {Array.from({ length: rows }, (_, index) => (
        <View key={index} style={styles.row}>
          <View style={styles.image} />
          <View style={styles.copy}>
            <View style={styles.title} />
            <View style={styles.meta} />
          </View>
        </View>
      ))}
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    list: { gap: theme.spacing.sm },
    row: {
      alignItems: 'center',
      borderBottomColor: theme.colors.border,
      borderBottomWidth: StyleSheet.hairlineWidth,
      flexDirection: 'row',
      gap: theme.spacing.md,
      minHeight: 76,
      paddingVertical: theme.spacing.sm,
    },
    image: { backgroundColor: theme.colors.surfaceMuted, height: 48, width: 64 },
    copy: { flex: 1, gap: theme.spacing.sm },
    title: { backgroundColor: theme.colors.surfaceMuted, height: 14, width: '48%' },
    meta: { backgroundColor: theme.colors.surfaceMuted, height: 10, width: '32%' },
  });
}

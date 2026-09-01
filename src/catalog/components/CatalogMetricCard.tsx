import { StyleSheet, Text, View } from 'react-native';

import { useAppTheme, type AppTheme } from '@/theme';

export function CatalogMetricCard({ label, value }: { label: string; value: number }) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  return (
    <View style={styles.card}>
      <Text style={styles.value}>{value.toLocaleString()}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    card: {
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
      borderRadius: theme.radii.md,
      borderWidth: 1,
      flexGrow: 1,
      gap: theme.spacing.xs,
      minWidth: 140,
      padding: theme.spacing.md,
    },
    value: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSize.xl,
      fontWeight: theme.typography.fontWeight.bold,
    },
    label: { color: theme.colors.textMuted, fontSize: theme.typography.fontSize.sm },
  });
}

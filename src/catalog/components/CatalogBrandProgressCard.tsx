import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { CatalogBrandProgress } from '@/catalog/types';
import { useAppTheme, type AppTheme } from '@/theme';

type Props = {
  brand: CatalogBrandProgress;
  selected: boolean;
  onSelect: () => void;
};

export function CatalogBrandProgressCard({ brand, selected, onSelect }: Props) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const progress = Math.min(brand.validated_count / brand.target_validated_count, 1);
  const distribution = Object.entries(brand.category_distribution).filter(([, count]) => count > 0);
  const gaps = Object.entries(brand.category_targets).filter(
    ([category, target]) => (brand.category_distribution[category] ?? 0) < target,
  ).length;
  const status =
    brand.validated_count >= brand.target_validated_count
      ? 'Complete'
      : ['blocked', 'unavailable', 'manual_seed_required'].includes(brand.source_status)
        ? 'Limited source availability'
        : 'Needs more products';

  return (
    <Pressable
      accessibilityLabel={`Use ${brand.brand_name} in catalogue controls`}
      accessibilityRole="button"
      onPress={onSelect}
      style={({ pressed }) => [
        styles.card,
        selected ? styles.selected : null,
        pressed ? styles.pressed : null,
      ]}
    >
      <View style={styles.header}>
        <View style={styles.copy}>
          <Text style={styles.name}>{brand.brand_name}</Text>
          <Text style={styles.status}>{status}</Text>
        </View>
        <Text style={styles.count}>
          {brand.validated_count} / {brand.target_validated_count}
        </Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${progress * 100}%` }]} />
      </View>
      <View style={styles.metaRow}>
        <Text style={styles.meta}>{brand.source_status.replaceAll('_', ' ')}</Text>
        <Text style={[styles.meta, gaps > 0 ? styles.warning : null]}>
          {gaps > 0 ? `${gaps} diversity gaps` : 'Diversity target met'}
        </Text>
      </View>
      {distribution.length > 0 ? (
        <Text style={styles.distribution}>
          {distribution.map(([category, count]) => `${formatSlug(category)} ${count}`).join(' · ')}
        </Text>
      ) : (
        <Text style={styles.distribution}>No validated category distribution yet.</Text>
      )}
    </Pressable>
  );
}

function formatSlug(value: string): string {
  return value
    .split('_')
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(' ');
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    card: {
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
      borderRadius: theme.radii.lg,
      borderWidth: 1,
      gap: theme.spacing.sm,
      minWidth: 260,
      padding: theme.spacing.md,
      width: '48%',
    },
    selected: { borderColor: theme.colors.primary, borderWidth: 2 },
    pressed: { opacity: 0.78 },
    header: { alignItems: 'flex-start', flexDirection: 'row', gap: theme.spacing.md },
    copy: { flex: 1 },
    name: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSize.md,
      fontWeight: theme.typography.fontWeight.bold,
    },
    status: { color: theme.colors.textMuted, fontSize: theme.typography.fontSize.sm },
    count: { color: theme.colors.primary, fontWeight: theme.typography.fontWeight.semibold },
    track: {
      backgroundColor: theme.colors.surfaceMuted,
      borderRadius: theme.radii.full,
      height: 8,
      overflow: 'hidden',
    },
    fill: { backgroundColor: theme.colors.primary, height: '100%' },
    metaRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
      justifyContent: 'space-between',
    },
    meta: { color: theme.colors.textMuted, fontSize: theme.typography.fontSize.xs },
    warning: { color: theme.colors.warning },
    distribution: { color: theme.colors.textMuted, fontSize: theme.typography.fontSize.xs },
  });
}

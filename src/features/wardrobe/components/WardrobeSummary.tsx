import { StyleSheet, Text, View } from 'react-native';

import { useAppTheme, type AppTheme } from '@/theme';
import type { WardrobeItem } from '@/types/wardrobe';

type Props = {
  items: WardrobeItem[];
  loading: boolean;
};

export function WardrobeSummary({ items, loading }: Props) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const categoryCount = new Set(items.map((item) => item.category)).size;
  const favouriteCount = items.filter((item) => item.isFavorite).length;
  const latestItem = items[0]?.name ?? '—';
  const metrics = [
    { label: 'Total items', value: String(items.length) },
    { label: 'Categories', value: String(categoryCount) },
    { label: 'Favourites', value: String(favouriteCount) },
    { label: 'Recently added', value: latestItem },
  ];

  return (
    <View style={styles.section}>
      <Text accessibilityRole="header" style={styles.heading}>
        Wardrobe summary
      </Text>
      <View accessibilityLabel="Wardrobe summary" style={styles.metrics}>
        {metrics.map((metric) => (
          <View key={metric.label} style={styles.metric}>
            {loading ? (
              <>
                <View accessibilityRole="progressbar" style={styles.valueSkeleton} />
                <View style={styles.labelSkeleton} />
              </>
            ) : (
              <>
                <Text numberOfLines={1} style={styles.value}>
                  {metric.value}
                </Text>
                <Text style={styles.label}>{metric.label}</Text>
              </>
            )}
          </View>
        ))}
      </View>
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    section: { gap: theme.spacing.md },
    heading: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.semibold,
      letterSpacing: 1.3,
      lineHeight: theme.typography.lineHeight.sm,
      textTransform: 'uppercase',
    },
    metrics: { flexDirection: 'row', flexWrap: 'wrap' },
    metric: {
      flexBasis: '25%',
      flexGrow: 1,
      gap: theme.spacing.xs,
      minWidth: 132,
      paddingBottom: theme.spacing.sm,
      paddingRight: theme.spacing.md,
    },
    value: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.editorial,
      fontSize: theme.typography.fontSize.xl,
      lineHeight: theme.typography.lineHeight.xl,
    },
    label: {
      color: theme.colors.textMuted,
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.xs,
      letterSpacing: 0.6,
      lineHeight: theme.typography.lineHeight.xs,
      textTransform: 'uppercase',
    },
    valueSkeleton: {
      backgroundColor: theme.colors.surfaceMuted,
      height: 28,
      width: 72,
    },
    labelSkeleton: {
      backgroundColor: theme.colors.surfaceMuted,
      height: 11,
      width: 92,
    },
  });
}

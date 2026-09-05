import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAppTheme, type AppTheme } from '@/theme';

type ActivitySummaryProps = {
  wardrobeCount: number;
  wardrobeError: string | null;
  wardrobeLoading: boolean;
  onRetryWardrobe: () => void;
};

const unavailableMetrics = [
  { label: 'Saved Outfits', accessibilityLabel: 'Saved Outfits, not tracked yet' },
  { label: 'Favorite Looks', accessibilityLabel: 'Favorite Looks, not tracked yet' },
  { label: 'Outfit History', accessibilityLabel: 'Outfit History, not tracked yet' },
] as const;

export function ActivitySummary({
  wardrobeCount,
  wardrobeError,
  wardrobeLoading,
  onRetryWardrobe,
}: ActivitySummaryProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.section}>
      <Text accessibilityRole="header" style={styles.heading}>
        ACTIVITY SUMMARY
      </Text>
      <View style={styles.grid}>
        <Metric
          accessibilityLabel={
            wardrobeError
              ? 'Total Wardrobe Items unavailable'
              : `Total Wardrobe Items, ${wardrobeCount}`
          }
          label="Total Wardrobe Items"
          loading={wardrobeLoading}
          styles={styles}
          value={wardrobeError ? '—' : String(wardrobeCount)}
        />
        {unavailableMetrics.map((metric) => (
          <Metric
            accessibilityLabel={metric.accessibilityLabel}
            key={metric.label}
            label={metric.label}
            styles={styles}
            value="—"
          />
        ))}
      </View>
      {wardrobeError ? (
        <View style={styles.errorRow}>
          <Text accessibilityLiveRegion="polite" style={styles.supportingText}>
            Your wardrobe count could not be loaded.
          </Text>
          <Pressable accessibilityRole="button" hitSlop={8} onPress={onRetryWardrobe}>
            <Text style={styles.retry}>Retry</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

type MetricProps = {
  accessibilityLabel: string;
  label: string;
  loading?: boolean;
  styles: ReturnType<typeof createStyles>;
  value: string;
};

function Metric({ accessibilityLabel, label, loading = false, styles, value }: MetricProps) {
  return (
    <View accessibilityLabel={accessibilityLabel} style={styles.metric}>
      {loading ? (
        <>
          <View accessibilityRole="progressbar" style={styles.valueSkeleton} />
          <View style={styles.labelSkeleton} />
        </>
      ) : (
        <>
          <Text style={styles.value}>{value}</Text>
          <Text style={styles.label}>{label}</Text>
        </>
      )}
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    section: { gap: theme.spacing.lg },
    heading: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.md,
      fontWeight: theme.typography.fontWeight.semibold,
      letterSpacing: 1.4,
      lineHeight: theme.typography.lineHeight.md,
    },
    grid: { flexDirection: 'row', flexWrap: 'wrap' },
    metric: {
      borderTopColor: theme.colors.border,
      borderTopWidth: StyleSheet.hairlineWidth,
      flexBasis: '50%',
      flexGrow: 1,
      gap: theme.spacing.xs,
      minWidth: 150,
      paddingBottom: theme.spacing.lg,
      paddingRight: theme.spacing.md,
      paddingTop: theme.spacing.lg,
    },
    value: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.editorial,
      fontSize: theme.typography.fontSize.xxxl,
      lineHeight: theme.typography.lineHeight.xxxl,
    },
    label: {
      color: theme.colors.textMuted,
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.sm,
      letterSpacing: 0.5,
      lineHeight: theme.typography.lineHeight.sm,
      textTransform: 'uppercase',
    },
    valueSkeleton: {
      backgroundColor: theme.colors.surfaceMuted,
      height: 42,
      width: 56,
    },
    labelSkeleton: {
      backgroundColor: theme.colors.surfaceMuted,
      height: 13,
      marginTop: theme.spacing.xs,
      width: 124,
    },
    supportingText: {
      color: theme.colors.textMuted,
      fontFamily: theme.typography.fontFamily.regular,
      fontSize: theme.typography.fontSize.xs,
      lineHeight: theme.typography.lineHeight.xs,
    },
    errorRow: { alignItems: 'center', flexDirection: 'row', gap: theme.spacing.md },
    retry: {
      color: theme.colors.primary,
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.semibold,
      textDecorationLine: 'underline',
    },
  });
}

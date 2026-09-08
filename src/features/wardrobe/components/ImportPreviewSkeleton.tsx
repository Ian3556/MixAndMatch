import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { AppScreen } from '@/components/ui/AppScreen';
import { useAppTheme, type AppTheme } from '@/theme';
import { getGridColumnCount } from '@/utils/layout';

type Props = { onBack: () => void };

export function ImportPreviewSkeleton({ onBack }: Props) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const { width } = useWindowDimensions();
  const columnCount = getGridColumnCount(Math.min(width, 900));

  return (
    <AppScreen onBack={onBack} title="Import from website">
      <View accessibilityLiveRegion="polite" accessibilityRole="progressbar" style={styles.status}>
        <Text style={styles.statusLabel}>Reading product data</Text>
        <Text style={styles.statusMessage}>
          Validating the page and preparing a preview. Larger collections can take a moment.
        </Text>
      </View>
      <View accessibilityElementsHidden style={styles.grid}>
        {Array.from({ length: Math.max(4, columnCount * 2) }, (_, index) => (
          <View key={index} style={[styles.card, { flexBasis: `${100 / columnCount}%` }]}>
            <View style={styles.image} />
            <View style={styles.titleLine} />
            <View style={styles.metaLine} />
          </View>
        ))}
      </View>
    </AppScreen>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    status: { gap: theme.spacing.xs },
    statusLabel: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.md,
      fontWeight: theme.typography.fontWeight.semibold,
    },
    statusMessage: {
      color: theme.colors.textMuted,
      fontFamily: theme.typography.fontFamily.regular,
      fontSize: theme.typography.fontSize.sm,
      lineHeight: theme.typography.lineHeight.sm,
      maxWidth: 520,
    },
    grid: { flexDirection: 'row', flexWrap: 'wrap', margin: -theme.spacing.sm / 2 },
    card: { gap: theme.spacing.sm, minWidth: 0, padding: theme.spacing.sm / 2 },
    image: {
      aspectRatio: 4 / 5,
      backgroundColor: theme.colors.surfaceMuted,
      width: '100%',
    },
    titleLine: { backgroundColor: theme.colors.surfaceMuted, height: 14, width: '78%' },
    metaLine: { backgroundColor: theme.colors.surfaceMuted, height: 10, width: '52%' },
  });
}

import { StyleSheet, View } from 'react-native';

import { useAppTheme, type AppTheme } from '@/theme';

import { buildMasonryColumns } from '../utils/discovery';

const SKELETON_ITEMS = [
  { id: 'skeleton-1', imageAspectRatio: 2 / 3 },
  { id: 'skeleton-2', imageAspectRatio: 4 / 5 },
  { id: 'skeleton-3', imageAspectRatio: 3 / 4 },
  { id: 'skeleton-4', imageAspectRatio: 2 / 3 },
  { id: 'skeleton-5', imageAspectRatio: 5 / 6 },
  { id: 'skeleton-6', imageAspectRatio: 3 / 4 },
] as const;

export function ExploreFeedSkeleton({ columnCount }: { columnCount: number }) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const columns = buildMasonryColumns(SKELETON_ITEMS, columnCount);

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={styles.masonry}
    >
      {columns.map((column, columnIndex) => (
        <View key={columnIndex} style={styles.column}>
          {column.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={[styles.image, { aspectRatio: item.imageAspectRatio }]} />
              <View style={styles.titleLine} />
              <View style={styles.metaLine} />
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    masonry: { alignItems: 'flex-start', flexDirection: 'row', gap: theme.spacing.sm },
    column: { flex: 1, gap: theme.spacing.lg, minWidth: 0 },
    card: { gap: theme.spacing.sm },
    image: { backgroundColor: theme.colors.surfaceMuted, width: '100%' },
    titleLine: { backgroundColor: theme.colors.surfaceMuted, height: 14, width: '78%' },
    metaLine: { backgroundColor: theme.colors.surfaceMuted, height: 10, width: '58%' },
  });
}

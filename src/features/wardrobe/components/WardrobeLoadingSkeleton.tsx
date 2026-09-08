import { StyleSheet, View } from 'react-native';

import { useAppTheme, type AppTheme } from '@/theme';
import type { WardrobeViewMode } from '@/store/wardrobeStore';

type Props = {
  columnCount: number;
  viewMode: WardrobeViewMode;
};

export function WardrobeLoadingSkeleton({ columnCount, viewMode }: Props) {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <View
      accessibilityLabel="Wardrobe content loading"
      accessibilityRole="progressbar"
      style={styles.content}
    >
      <View style={styles.categories}>
        {[72, 88, 76, 104].map((width) => (
          <View key={width} style={[styles.category, { width }]} />
        ))}
      </View>
      {viewMode === 'grid' ? (
        <View style={styles.grid}>
          {Array.from({ length: Math.max(4, columnCount * 2) }, (_, index) => (
            <View key={index} style={[styles.gridItem, { flexBasis: `${100 / columnCount}%` }]}>
              <View style={styles.gridImage} />
              <View style={styles.titleLine} />
              <View style={styles.metaLine} />
            </View>
          ))}
        </View>
      ) : (
        <View>
          {Array.from({ length: 5 }, (_, index) => (
            <View key={index} style={styles.listItem}>
              <View style={styles.listImage} />
              <View style={styles.listCopy}>
                <View style={styles.titleLine} />
                <View style={styles.metaLine} />
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    content: { gap: theme.spacing.lg },
    categories: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
    category: { backgroundColor: theme.colors.surfaceMuted, height: 36 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', margin: -theme.spacing.sm / 2 },
    gridItem: { gap: theme.spacing.sm, minWidth: 0, padding: theme.spacing.sm / 2 },
    gridImage: {
      aspectRatio: 4 / 5,
      backgroundColor: theme.colors.surfaceMuted,
      width: '100%',
    },
    titleLine: { backgroundColor: theme.colors.surfaceMuted, height: 14, width: '78%' },
    metaLine: { backgroundColor: theme.colors.surfaceMuted, height: 10, width: '54%' },
    listItem: {
      alignItems: 'center',
      borderTopColor: theme.colors.border,
      borderTopWidth: StyleSheet.hairlineWidth,
      flexDirection: 'row',
      gap: theme.spacing.md,
      paddingVertical: theme.spacing.md,
    },
    listImage: {
      aspectRatio: 4 / 5,
      backgroundColor: theme.colors.surfaceMuted,
      width: 76,
    },
    listCopy: { flex: 1, gap: theme.spacing.sm },
  });
}

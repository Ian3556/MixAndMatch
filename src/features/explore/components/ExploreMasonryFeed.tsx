import { memo, useCallback, useMemo, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { resolveEditorialImageSource } from '@/features/home/components/editorialAssets';
import { useAppTheme, type AppTheme } from '@/theme';

import type { ExploreDiscoveryItem } from '../types/discovery';
import { buildMasonryColumns } from '../utils/discovery';

type Props = {
  columnCount: number;
  items: readonly ExploreDiscoveryItem[];
  onOpenItem: (item: ExploreDiscoveryItem) => void;
};

export function ExploreMasonryFeed({ columnCount, items, onOpenItem }: Props) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const columns = useMemo(() => buildMasonryColumns(items, columnCount), [columnCount, items]);

  return (
    <View style={styles.masonry}>
      {columns.map((column, columnIndex) => (
        <View key={columnIndex} style={styles.column}>
          {column.map((item) => (
            <ExploreFeedCard item={item} key={item.id} onOpenItem={onOpenItem} />
          ))}
        </View>
      ))}
    </View>
  );
}

const ExploreFeedCard = memo(function ExploreFeedCard({
  item,
  onOpenItem,
}: {
  item: ExploreDiscoveryItem;
  onOpenItem: (item: ExploreDiscoveryItem) => void;
}) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const [imageLoading, setImageLoading] = useState(true);
  const imageSource = useMemo(() => resolveEditorialImageSource(item.image), [item.image]);
  const handleOpen = useCallback(() => onOpenItem(item), [item, onOpenItem]);
  const handleImageLoadEnd = useCallback(() => setImageLoading(false), []);
  const handleImageLoadStart = useCallback(() => setImageLoading(true), []);

  return (
    <View style={styles.card}>
      <Pressable
        accessibilityLabel={`Open ${item.title}`}
        accessibilityRole="button"
        onPress={handleOpen}
        style={({ pressed }) => [styles.imagePressable, pressed ? styles.pressed : null]}
      >
        <View style={[styles.imageFrame, { aspectRatio: item.imageAspectRatio }]}>
          <Image
            accessibilityLabel={item.imageAlt}
            accessible
            fadeDuration={120}
            onLoadEnd={handleImageLoadEnd}
            onLoadStart={handleImageLoadStart}
            resizeMode="cover"
            source={imageSource}
            style={styles.image}
          />
          {imageLoading ? <View accessibilityElementsHidden style={styles.imageSkeleton} /> : null}
        </View>
      </Pressable>
      <View style={styles.copy}>
        <Text numberOfLines={1} style={styles.title}>
          {item.title}
        </Text>
        <Text numberOfLines={1} style={styles.meta}>
          {item.style} · {item.aesthetic}
        </Text>
      </View>
    </View>
  );
});

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    masonry: { alignItems: 'flex-start', flexDirection: 'row', gap: theme.spacing.sm },
    column: { flex: 1, gap: theme.spacing.lg, minWidth: 0 },
    card: { gap: theme.spacing.sm, minWidth: 0 },
    imagePressable: { width: '100%' },
    imageFrame: {
      backgroundColor: theme.colors.surfaceMuted,
      overflow: 'hidden',
      width: '100%',
    },
    image: { height: '100%', width: '100%' },
    imageSkeleton: {
      backgroundColor: theme.colors.surfaceMuted,
      bottom: 0,
      left: 0,
      position: 'absolute',
      right: 0,
      top: 0,
    },
    copy: { gap: theme.spacing.xxs, minWidth: 0 },
    title: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.semibold,
      lineHeight: theme.typography.lineHeight.sm,
    },
    meta: {
      color: theme.colors.textMuted,
      fontFamily: theme.typography.fontFamily.regular,
      fontSize: theme.typography.fontSize.xs,
      lineHeight: theme.typography.lineHeight.xs,
    },
    pressed: { opacity: 0.74 },
  });
}

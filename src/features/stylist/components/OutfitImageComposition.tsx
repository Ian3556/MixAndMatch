import { useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  type DimensionValue,
} from 'react-native';

import { useAppTheme, type AppTheme } from '@/theme';

export type OutfitDisplayItem = {
  id: string;
  name: string;
  category?: string | null;
  primaryColor?: string | null;
  imageUrl?: string | null;
};

type Props = {
  items: readonly OutfitDisplayItem[];
  featured?: boolean;
  showCaptions?: boolean;
};

export function OutfitImageComposition({ items, featured = false, showCaptions = true }: Props) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const { width } = useWindowDimensions();
  const wide = width >= 720;

  return (
    <View style={styles.composition}>
      {items.map((item, index) => {
        const tileWidth: DimensionValue = featured
          ? index === 0
            ? wide
              ? '61%'
              : '100%'
            : wide
              ? '35%'
              : '47%'
          : '47%';
        return (
          <OutfitImageTile
            featured={featured && index === 0}
            item={item}
            key={item.id}
            showCaption={showCaptions}
            styles={styles}
            width={tileWidth}
          />
        );
      })}
    </View>
  );
}

type Styles = ReturnType<typeof createStyles>;

function OutfitImageTile({
  item,
  featured,
  showCaption,
  width,
  styles,
}: {
  item: OutfitDisplayItem;
  featured: boolean;
  showCaption: boolean;
  width: DimensionValue;
  styles: Styles;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const metadata = [item.category, item.primaryColor].filter(Boolean).join(' · ');

  return (
    <View style={[styles.tile, { width }]}>
      <View style={[styles.imageFrame, featured ? styles.imageFrameFeatured : null]}>
        {item.imageUrl && !imageFailed ? (
          <Image
            accessibilityLabel={`${item.name} wardrobe image`}
            onError={() => setImageFailed(true)}
            resizeMode="cover"
            source={{ uri: item.imageUrl }}
            style={styles.image}
          />
        ) : (
          <View
            accessibilityLabel={`${item.name} image unavailable`}
            accessibilityRole="image"
            style={styles.imageUnavailable}
          >
            <Text style={styles.unavailableIndex}>WARDROBE ITEM</Text>
            <Text numberOfLines={3} style={styles.unavailableName}>
              {item.name}
            </Text>
          </View>
        )}
      </View>
      {showCaption ? (
        <View style={styles.caption}>
          <Text numberOfLines={2} style={styles.itemName}>
            {item.name}
          </Text>
          {metadata ? <Text style={styles.itemMeta}>{metadata}</Text> : null}
        </View>
      ) : null}
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    composition: {
      alignItems: 'flex-start',
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.md,
    },
    tile: { flexGrow: 1, gap: theme.spacing.sm, minWidth: 138 },
    imageFrame: {
      aspectRatio: 4 / 5,
      backgroundColor: theme.colors.surfaceMuted,
      overflow: 'hidden',
      width: '100%',
    },
    imageFrameFeatured: { aspectRatio: 5 / 6 },
    image: { height: '100%', width: '100%' },
    imageUnavailable: {
      borderColor: theme.colors.border,
      borderWidth: StyleSheet.hairlineWidth,
      flex: 1,
      justifyContent: 'space-between',
      padding: theme.spacing.md,
    },
    unavailableIndex: {
      color: theme.colors.textMuted,
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.xs,
      letterSpacing: 1.2,
    },
    unavailableName: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.editorial,
      fontSize: theme.typography.fontSize.xl,
      lineHeight: theme.typography.lineHeight.xl,
    },
    caption: { gap: theme.spacing.xxs },
    itemName: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.semibold,
    },
    itemMeta: {
      color: theme.colors.textMuted,
      fontSize: theme.typography.fontSize.xs,
      textTransform: 'capitalize',
    },
  });
}

import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { PlaceholderArtwork } from '@/components/ui/PlaceholderArtwork';
import { useAppTheme, type AppTheme } from '@/theme';
import type { WardrobeItem } from '@/types/wardrobe';

type Props = {
  item: WardrobeItem;
  onFavorite: () => void;
  onOpen: () => void;
};

export function WardrobeListItem({ item, onFavorite, onOpen }: Props) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <View style={styles.row}>
      <Pressable
        accessibilityLabel={`Open ${item.name}`}
        accessibilityRole="button"
        onPress={onOpen}
        style={({ pressed }) => [styles.itemContent, pressed ? styles.pressed : null]}
      >
        <View style={styles.thumbnail}>
          {item.imageUrl && !imageFailed ? (
            <Image
              accessibilityLabel={`${item.name} wardrobe image`}
              onError={() => setImageFailed(true)}
              resizeMode="cover"
              source={{ uri: item.imageUrl }}
              style={styles.image}
            />
          ) : (
            <PlaceholderArtwork
              colors={[theme.colors.primarySoft, theme.colors.surfaceMuted, theme.colors.surface]}
              compact
              label={item.name}
            />
          )}
        </View>
        <View style={styles.copy}>
          <Text numberOfLines={2} style={styles.name}>
            {item.name}
          </Text>
          <Text numberOfLines={1} style={styles.brand}>
            {item.brand || 'Independent piece'}
          </Text>
          <Text numberOfLines={1} style={styles.meta}>
            {[item.category, item.primaryColor, item.material].filter(Boolean).join(' · ')}
          </Text>
        </View>
      </Pressable>
      <Pressable
        accessibilityLabel={`${item.isFavorite ? 'Remove' : 'Add'} ${item.name} ${item.isFavorite ? 'from' : 'to'} favourites`}
        accessibilityRole="button"
        accessibilityState={{ selected: item.isFavorite }}
        hitSlop={4}
        onPress={onFavorite}
        style={({ pressed }) => [styles.favoriteButton, pressed ? styles.pressed : null]}
      >
        <Ionicons
          color={item.isFavorite ? theme.colors.primary : theme.colors.textMuted}
          name={item.isFavorite ? 'heart' : 'heart-outline'}
          size={21}
        />
      </Pressable>
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    row: {
      alignItems: 'center',
      borderTopColor: theme.colors.border,
      borderTopWidth: StyleSheet.hairlineWidth,
      flexDirection: 'row',
      gap: theme.spacing.sm,
      paddingVertical: theme.spacing.md,
    },
    itemContent: {
      alignItems: 'center',
      flex: 1,
      flexDirection: 'row',
      gap: theme.spacing.md,
      minWidth: 0,
    },
    thumbnail: {
      aspectRatio: 4 / 5,
      backgroundColor: theme.colors.surfaceMuted,
      overflow: 'hidden',
      width: 76,
    },
    image: { height: '100%', width: '100%' },
    copy: { flex: 1, gap: theme.spacing.xs, minWidth: 0 },
    name: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.md,
      fontWeight: theme.typography.fontWeight.semibold,
      lineHeight: theme.typography.lineHeight.md,
    },
    brand: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.regular,
      fontSize: theme.typography.fontSize.sm,
      lineHeight: theme.typography.lineHeight.sm,
    },
    meta: {
      color: theme.colors.textMuted,
      fontFamily: theme.typography.fontFamily.regular,
      fontSize: theme.typography.fontSize.xs,
      lineHeight: theme.typography.lineHeight.xs,
    },
    favoriteButton: {
      alignItems: 'center',
      height: 44,
      justifyContent: 'center',
      width: 44,
    },
    pressed: { opacity: 0.62 },
  });
}

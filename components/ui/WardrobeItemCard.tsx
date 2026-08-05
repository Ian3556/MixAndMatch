import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { useAppTheme, type AppTheme } from '@/theme';
import type { WardrobeItem } from '@/types/wardrobe';

import { IconButton } from './IconButton';
import { PlaceholderArtwork } from './PlaceholderArtwork';

type WardrobeItemCardProps = {
  item: WardrobeItem;
  onOpen: () => void;
  onFavorite: () => void;
  width?: number;
};

export function WardrobeItemCard({ item, onOpen, onFavorite, width }: WardrobeItemCardProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <View style={[styles.card, width ? { width } : null]}>
      <Pressable
        accessibilityLabel={`Open ${item.name}`}
        accessibilityRole="button"
        onPress={onOpen}
        style={({ pressed }) => (pressed ? styles.pressed : null)}
      >
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
            label={item.name}
          />
        )}
      </Pressable>
      <View style={styles.heading}>
        <Pressable
          accessibilityLabel={`Open ${item.name} details`}
          accessibilityRole="button"
          onPress={onOpen}
          style={styles.copy}
        >
          <Text numberOfLines={2} style={styles.title}>
            {item.name}
          </Text>
          <Text numberOfLines={1} style={styles.meta}>
            {[item.category, item.primaryColor].filter(Boolean).join(' Â· ')}
          </Text>
        </Pressable>
        <IconButton
          label={`${item.isFavorite ? 'Remove' : 'Add'} ${item.name} ${item.isFavorite ? 'from' : 'to'} favourites`}
          onPress={onFavorite}
          selected={item.isFavorite}
          symbol={item.isFavorite ? 'â™¥' : 'â™¡'}
        />
      </View>
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    card: { gap: theme.spacing.sm },
    image: {
      aspectRatio: 4 / 5,
      backgroundColor: theme.colors.surfaceMuted,
      borderRadius: theme.radii.lg,
      width: '100%',
    },
    pressed: { opacity: 0.78 },
    heading: { alignItems: 'center', flexDirection: 'row', gap: theme.spacing.xs },
    copy: { flex: 1, minWidth: 0 },
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
  });
}

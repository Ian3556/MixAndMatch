import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { useAppTheme, type AppTheme } from '@/theme';
import type { WardrobeItem } from '@/types/wardrobe';

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
        <View style={styles.imageFrame}>
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
        </View>
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
            {[item.brand, item.category, item.primaryColor].filter(Boolean).join(' · ')}
          </Text>
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
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    card: { gap: theme.spacing.sm },
    imageFrame: {
      aspectRatio: 4 / 5,
      backgroundColor: theme.colors.surfaceMuted,
      overflow: 'hidden',
      width: '100%',
    },
    image: { height: '100%', width: '100%' },
    pressed: { opacity: 0.7 },
    heading: { alignItems: 'center', flexDirection: 'row', gap: theme.spacing.xs },
    copy: { flex: 1, minWidth: 0 },
    favoriteButton: {
      alignItems: 'center',
      height: 44,
      justifyContent: 'center',
      width: 44,
    },
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

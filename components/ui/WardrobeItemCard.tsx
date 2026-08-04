import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { WardrobeItemFixture } from '@/fixtures/wardrobe';
import { useAppTheme, type AppTheme } from '@/theme';

import { IconButton } from './IconButton';
import { PlaceholderArtwork } from './PlaceholderArtwork';

type WardrobeItemCardProps = {
  item: WardrobeItemFixture;
  onOpen: () => void;
  onFavorite: () => void;
  onMore: () => void;
  width?: number;
};

export function WardrobeItemCard({
  item,
  onOpen,
  onFavorite,
  onMore,
  width,
}: WardrobeItemCardProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <View style={[styles.card, width ? { width } : null]}>
      <Pressable
        accessibilityLabel={`Open ${item.name}`}
        accessibilityRole="button"
        onPress={onOpen}
        style={({ pressed }) => (pressed ? styles.pressed : null)}
      >
        <PlaceholderArtwork colors={[item.tone, theme.colors.surfaceMuted]} label={item.name} />
      </Pressable>
      <View style={styles.heading}>
        <View style={styles.copy}>
          <Text numberOfLines={2} style={styles.title}>
            {item.name}
          </Text>
          <Text numberOfLines={1} style={styles.meta}>
            {item.category} · {item.color}
          </Text>
        </View>
        <IconButton
          label={`${item.isFavorite ? 'Remove' : 'Add'} ${item.name} ${item.isFavorite ? 'from' : 'to'} favourites`}
          onPress={onFavorite}
          selected={item.isFavorite}
          symbol={item.isFavorite ? '♥' : '♡'}
        />
        <IconButton label={`More options for ${item.name}`} onPress={onMore} symbol="⋯" />
      </View>
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    card: { gap: theme.spacing.sm },
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

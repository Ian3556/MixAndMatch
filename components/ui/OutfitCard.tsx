import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { OutfitFixture } from '@/fixtures/outfits';
import { useAppTheme, type AppTheme } from '@/theme';

import { PlaceholderArtwork } from './PlaceholderArtwork';

type OutfitCardProps = {
  outfit: OutfitFixture;
  onPress: () => void;
  compact?: boolean;
};

export function OutfitCard({ outfit, onPress, compact = false }: OutfitCardProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <Pressable
      accessibilityLabel={`Open outfit concept ${outfit.name}`}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed ? styles.pressed : null]}
    >
      <PlaceholderArtwork
        aspectRatio={compact ? 16 / 9 : 4 / 3}
        colors={outfit.colors}
        compact={compact}
        label={outfit.name}
      />
      <View>
        <Text style={styles.title}>{outfit.name}</Text>
        <Text style={styles.meta}>
          {outfit.occasion} · {outfit.style}
        </Text>
      </View>
    </Pressable>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    card: {
      gap: theme.spacing.sm,
      minWidth: 220,
    },
    pressed: { opacity: 0.76 },
    title: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.md,
      fontWeight: theme.typography.fontWeight.semibold,
      lineHeight: theme.typography.lineHeight.md,
    },
    meta: {
      color: theme.colors.textMuted,
      fontFamily: theme.typography.fontFamily.regular,
      fontSize: theme.typography.fontSize.sm,
      lineHeight: theme.typography.lineHeight.sm,
    },
  });
}

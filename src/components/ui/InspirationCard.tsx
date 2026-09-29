import { Pressable, StyleSheet, Text, View, type DimensionValue } from 'react-native';
import type { ReactNode } from 'react';

import type { InspirationFixture } from '@/fixtures/inspiration';
import { useAppTheme, type AppTheme } from '@/theme';

import { IconButton } from './IconButton';
import { PlaceholderArtwork } from './PlaceholderArtwork';

type InspirationCardProps = {
  item: InspirationFixture;
  onOpen: () => void;
  saveAction: ReactNode;
  onMore: () => void;
  width?: DimensionValue;
};

export function InspirationCard({ item, onOpen, saveAction, onMore, width }: InspirationCardProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <View style={[styles.card, width ? { width } : null]}>
      <Pressable
        accessibilityLabel={`Open ${item.title}`}
        accessibilityRole="button"
        onPress={onOpen}
        style={({ pressed }) => (pressed ? styles.pressed : null)}
      >
        <PlaceholderArtwork colors={item.colors} label={item.title} />
      </Pressable>
      <View style={styles.footer}>
        <View style={styles.copy}>
          <Text numberOfLines={1} style={styles.title}>
            {item.title}
          </Text>
          <Text numberOfLines={1} style={styles.category}>
            {item.category}
          </Text>
        </View>
        <IconButton label={`More options for ${item.title}`} onPress={onMore} symbol="⋯" />
      </View>
      {saveAction}
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    card: { gap: theme.spacing.sm },
    pressed: { opacity: 0.78 },
    footer: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: theme.spacing.xs,
    },
    copy: { flex: 1, minWidth: 0 },
    title: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.md,
      fontWeight: theme.typography.fontWeight.semibold,
      lineHeight: theme.typography.lineHeight.md,
    },
    category: {
      color: theme.colors.textMuted,
      fontFamily: theme.typography.fontFamily.regular,
      fontSize: theme.typography.fontSize.sm,
      lineHeight: theme.typography.lineHeight.sm,
    },
  });
}

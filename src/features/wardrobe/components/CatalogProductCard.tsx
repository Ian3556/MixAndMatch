import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import type { CatalogProductSummary } from '@/catalog/browseTypes';
import { PlaceholderArtwork } from '@/components/ui/PlaceholderArtwork';
import { useAppTheme, type AppTheme } from '@/theme';
import type { WardrobeViewMode } from '@/store/wardrobeStore';

type Props = {
  product: CatalogProductSummary;
  viewMode: WardrobeViewMode;
  onPress: () => void;
  width?: number;
};

export function CatalogProductCard({ product, viewMode, onPress, width }: Props) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const [imageFailed, setImageFailed] = useState(false);
  const list = viewMode === 'list';

  return (
    <Pressable
      accessibilityLabel={`Open ${product.name}`}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        list ? styles.listCard : null,
        !list && width ? { width } : null,
        pressed ? styles.pressed : null,
      ]}
    >
      <View style={[styles.imageFrame, list ? styles.listImageFrame : null]}>
        {product.imageUrl && !imageFailed ? (
          <Image
            accessibilityLabel={`${product.name} product image`}
            onError={() => setImageFailed(true)}
            resizeMode="cover"
            source={{ uri: product.imageUrl }}
            style={styles.image}
          />
        ) : (
          <PlaceholderArtwork
            colors={[theme.colors.surfaceMuted, theme.colors.primarySoft, theme.colors.surface]}
            label={product.name}
          />
        )}
      </View>
      <View style={styles.copy}>
        <Text numberOfLines={1} style={styles.brand}>
          {product.brandName}
        </Text>
        <Text numberOfLines={2} style={styles.name}>
          {product.name}
        </Text>
        <Text numberOfLines={1} style={styles.meta}>
          {[
            product.isDemo ? 'Demo' : null,
            product.categoryName,
            product.primaryColor,
            formatPrice(product.price, product.currency),
          ]
            .filter(Boolean)
            .join(' · ')}
        </Text>
      </View>
    </Pressable>
  );
}

function formatPrice(price: number | null, currency: string | null): string | null {
  if (price === null) return null;
  return `${currency ?? ''} ${price.toFixed(2)}`.trim();
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    card: { gap: theme.spacing.sm },
    listCard: {
      alignItems: 'center',
      borderBottomColor: theme.colors.border,
      borderBottomWidth: StyleSheet.hairlineWidth,
      flexDirection: 'row',
      paddingVertical: theme.spacing.sm,
      width: '100%',
    },
    imageFrame: {
      aspectRatio: 4 / 5,
      backgroundColor: theme.colors.surfaceMuted,
      overflow: 'hidden',
      width: '100%',
    },
    listImageFrame: { height: 112, width: 90 },
    image: { height: '100%', width: '100%' },
    copy: { flex: 1, gap: theme.spacing.xs, minWidth: 0 },
    brand: {
      color: theme.colors.textMuted,
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.xs,
      letterSpacing: 1,
      textTransform: 'uppercase',
    },
    name: {
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
    },
    pressed: { opacity: 0.68 },
  });
}

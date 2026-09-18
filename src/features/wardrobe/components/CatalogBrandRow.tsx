import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import type { CatalogBrand } from '@/catalog/browseTypes';
import { useAppTheme, type AppTheme } from '@/theme';

type Props = {
  brand: CatalogBrand;
  onPress: () => void;
};

export function CatalogBrandRow({ brand, onPress }: Props) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const [failedLogoUrl, setFailedLogoUrl] = useState<string | null>(null);

  return (
    <Pressable
      accessibilityLabel={`Browse ${brand.name} products`}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed ? styles.pressed : null]}
    >
      {brand.logoUrl && failedLogoUrl !== brand.logoUrl ? (
        <Image
          accessibilityIgnoresInvertColors
          onError={() => setFailedLogoUrl(brand.logoUrl)}
          source={{ uri: brand.logoUrl }}
          style={styles.logo}
        />
      ) : (
        <View accessibilityLabel={`${brand.name} logo unavailable`} style={styles.logoFallback}>
          <Text style={styles.initial}>{brand.name.slice(0, 1).toUpperCase()}</Text>
        </View>
      )}
      <View style={styles.copy}>
        <Text style={styles.name}>{brand.name}</Text>
        <Text style={styles.status}>{formatStatus(brand)}</Text>
      </View>
      <Ionicons color={theme.colors.textMuted} name="chevron-forward" size={20} />
    </Pressable>
  );
}

function formatStatus(brand: CatalogBrand): string {
  if (brand.hasDemoCatalog) return `Demo catalogue · ${brand.productCount} products`;
  if (['ready', 'supported', 'completed'].includes(brand.status)) {
    return `Catalog available · ${brand.productCount} products`;
  }
  if (brand.status === 'partially_supported') return 'Limited catalog';
  return 'Catalog not available yet';
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    row: {
      alignItems: 'center',
      borderBottomColor: theme.colors.border,
      borderBottomWidth: StyleSheet.hairlineWidth,
      flexDirection: 'row',
      gap: theme.spacing.md,
      minHeight: 76,
      paddingVertical: theme.spacing.sm,
    },
    logo: {
      backgroundColor: theme.colors.surfaceMuted,
      height: 48,
      resizeMode: 'contain',
      width: 64,
    },
    logoFallback: {
      alignItems: 'center',
      backgroundColor: theme.colors.surfaceMuted,
      height: 48,
      justifyContent: 'center',
      width: 64,
    },
    initial: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.editorial,
      fontSize: theme.typography.fontSize.xl,
    },
    copy: { flex: 1, minWidth: 0 },
    name: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.md,
      fontWeight: theme.typography.fontWeight.semibold,
    },
    status: {
      color: theme.colors.textMuted,
      fontFamily: theme.typography.fontFamily.regular,
      fontSize: theme.typography.fontSize.xs,
    },
    pressed: { opacity: 0.62 },
  });
}

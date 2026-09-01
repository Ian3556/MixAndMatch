import { Image, Linking, StyleSheet, Text, View } from 'react-native';

import type { CatalogManagementAction } from '@supabase/functions/_shared/catalog/management-actions';

import type { CatalogReviewItem } from '@/catalog/types';
import { ActionButton } from '@/components/ActionButton';
import { useAppTheme, type AppTheme } from '@/theme';

type Props = {
  item: CatalogReviewItem;
  pending: boolean;
  onAction: (action: CatalogManagementAction) => void;
  onEdit: () => void;
};

export function CatalogReviewCard({ item, pending, onAction, onEdit }: Props) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  return (
    <View style={styles.card}>
      <View style={styles.main}>
        {item.image_url ? (
          <Image
            accessibilityLabel={`${item.product_name} product image`}
            source={{ uri: item.image_url }}
            style={styles.image}
          />
        ) : (
          <View accessibilityLabel="Product image unavailable" style={styles.imageFallback}>
            <Text style={styles.imageFallbackText}>No image</Text>
          </View>
        )}
        <View style={styles.copy}>
          <Text style={styles.brand}>{item.brand_name}</Text>
          <Text style={styles.name}>{item.product_name}</Text>
          <Text style={styles.meta}>
            {item.currency && item.current_price !== null
              ? `${item.currency} ${item.current_price.toFixed(2)}`
              : item.price_unavailable
                ? 'Price unavailable'
                : 'Price needs review'}
            {' · '}
            {item.category_slug}
            {item.subcategory_slug ? ` / ${item.subcategory_slug}` : ''}
          </Text>
          <Text style={styles.meta}>Confidence {Math.round(item.confidence * 100)}%</Text>
          <Text style={styles.tags}>Tags: {item.style_tags.join(', ') || 'None'}</Text>
        </View>
      </View>
      {item.errors.length > 0 ? (
        <Text style={styles.error}>Required: {item.errors.join(', ')}</Text>
      ) : null}
      {item.warnings.length > 0 ? (
        <Text style={styles.warning}>Warnings: {item.warnings.join(', ')}</Text>
      ) : null}
      <View style={styles.actions}>
        <ActionButton
          disabled={pending}
          label="Approve"
          onPress={() =>
            onAction({ action: 'review_product', productId: item.product_id, decision: 'approve' })
          }
        />
        <ActionButton disabled={pending} label="Edit" onPress={onEdit} variant="secondary" />
        <ActionButton
          disabled={pending}
          label="Reject"
          onPress={() =>
            onAction({ action: 'review_product', productId: item.product_id, decision: 'reject' })
          }
          variant="secondary"
        />
        <ActionButton
          disabled={pending}
          label="Re-run enrichment"
          onPress={() =>
            onAction({
              action: 'start_product_maintenance',
              productId: item.product_id,
              operation: 'reenrich',
            })
          }
          variant="secondary"
        />
        <ActionButton
          disabled={pending}
          label="Open source"
          onPress={() => void Linking.openURL(item.source_url)}
          variant="text"
        />
      </View>
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    card: {
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
      borderRadius: theme.radii.lg,
      borderWidth: 1,
      gap: theme.spacing.sm,
      padding: theme.spacing.md,
    },
    main: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.md },
    image: {
      backgroundColor: theme.colors.surfaceMuted,
      borderRadius: theme.radii.md,
      height: 150,
      width: 120,
    },
    imageFallback: {
      alignItems: 'center',
      backgroundColor: theme.colors.surfaceMuted,
      borderRadius: theme.radii.md,
      height: 150,
      justifyContent: 'center',
      width: 120,
    },
    imageFallbackText: { color: theme.colors.textMuted, fontSize: theme.typography.fontSize.sm },
    copy: { flex: 1, gap: theme.spacing.xs, minWidth: 220 },
    brand: {
      color: theme.colors.primary,
      fontSize: theme.typography.fontSize.xs,
      fontWeight: theme.typography.fontWeight.semibold,
      textTransform: 'uppercase',
    },
    name: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSize.lg,
      fontWeight: theme.typography.fontWeight.bold,
    },
    meta: { color: theme.colors.textMuted, fontSize: theme.typography.fontSize.sm },
    tags: { color: theme.colors.text, fontSize: theme.typography.fontSize.sm },
    error: { color: theme.colors.danger, fontSize: theme.typography.fontSize.sm },
    warning: { color: theme.colors.warning, fontSize: theme.typography.fontSize.sm },
    actions: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.xs },
  });
}

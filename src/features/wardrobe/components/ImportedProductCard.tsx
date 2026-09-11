import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { ActionButton } from '@/components/ActionButton';
import { PlaceholderArtwork } from '@/components/ui/PlaceholderArtwork';
import type { ImportPreviewItem } from '@/features/wardrobe/import/importWorkflow';
import { useAppTheme, type AppTheme } from '@/theme';

type Props = {
  disabled: boolean;
  item: ImportPreviewItem;
  onEdit: () => void;
  onOpenSource: () => void;
  onToggle: () => void;
  width: number;
};

export function ImportedProductCard({
  disabled,
  item,
  onEdit,
  onOpenSource,
  onToggle,
  width,
}: Props) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const [imageFailed, setImageFailed] = useState(false);
  const { candidate } = item;

  return (
    <View style={[styles.card, { width }]}>
      {candidate.imageUrl && !imageFailed ? (
        <Image
          accessibilityLabel={`${candidate.name} product image`}
          onError={() => setImageFailed(true)}
          resizeMode="cover"
          source={{ uri: candidate.imageUrl }}
          style={styles.image}
        />
      ) : (
        <PlaceholderArtwork
          colors={[theme.colors.primarySoft, theme.colors.surfaceMuted, theme.colors.surface]}
          label={candidate.name}
        />
      )}
      <Pressable
        accessibilityLabel={`${item.selected ? 'Deselect' : 'Select'} ${candidate.name}`}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: item.selected, disabled: item.duplicate || disabled }}
        disabled={item.duplicate || disabled}
        onPress={onToggle}
        style={({ pressed }) => [
          styles.selection,
          item.selected ? styles.selectionSelected : null,
          item.duplicate ? styles.disabled : null,
          pressed ? styles.pressed : null,
        ]}
      >
        <Text style={styles.checkmark}>{item.selected ? '✓' : '○'}</Text>
        <Text style={styles.selectionLabel}>
          {item.duplicate ? 'Already in wardrobe' : item.selected ? 'Selected' : 'Not selected'}
        </Text>
      </Pressable>
      <View style={styles.copy}>
        <Text numberOfLines={2} style={styles.name}>
          {candidate.name}
        </Text>
        <Text style={styles.meta}>
          {[
            candidate.brand,
            candidate.category,
            candidate.color,
            candidate.size,
            formatPrice(candidate.price, candidate.currency),
          ]
            .filter(Boolean)
            .join(' · ') || 'Details need review'}
        </Text>
        <Text style={styles.source}>{candidate.sourceDomain}</Text>
        {item.incomplete ? <Text style={styles.warning}>Incomplete details</Text> : null}
      </View>
      <View style={styles.actions}>
        <ActionButton disabled={disabled} label="Edit" onPress={onEdit} variant="secondary" />
        <ActionButton label="Open source" onPress={onOpenSource} variant="text" />
      </View>
    </View>
  );
}

function formatPrice(price?: number, currency?: string): string | undefined {
  if (price === undefined) return undefined;
  return `${currency ?? ''} ${price.toFixed(2)}`.trim();
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    card: {
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
      borderRadius: theme.radii.lg,
      borderWidth: 1,
      gap: theme.spacing.sm,
      overflow: 'hidden',
      paddingBottom: theme.spacing.md,
    },
    image: { aspectRatio: 4 / 5, backgroundColor: theme.colors.surfaceMuted, width: '100%' },
    selection: {
      alignItems: 'center',
      borderColor: theme.colors.border,
      borderRadius: theme.radii.md,
      borderWidth: 1,
      flexDirection: 'row',
      gap: theme.spacing.sm,
      marginHorizontal: theme.spacing.md,
      minHeight: 44,
      paddingHorizontal: theme.spacing.sm,
    },
    selectionSelected: {
      backgroundColor: theme.colors.primarySoft,
      borderColor: theme.colors.primary,
    },
    checkmark: { color: theme.colors.primary, fontSize: theme.typography.fontSize.lg },
    selectionLabel: { color: theme.colors.text, fontWeight: theme.typography.fontWeight.semibold },
    copy: { gap: theme.spacing.xs, paddingHorizontal: theme.spacing.md },
    name: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSize.md,
      fontWeight: theme.typography.fontWeight.bold,
    },
    meta: { color: theme.colors.textMuted, fontSize: theme.typography.fontSize.sm },
    source: { color: theme.colors.textMuted, fontSize: theme.typography.fontSize.xs },
    warning: { color: theme.colors.warning, fontSize: theme.typography.fontSize.xs },
    actions: { gap: theme.spacing.xs, paddingHorizontal: theme.spacing.md },
    disabled: { opacity: 0.6 },
    pressed: { opacity: 0.78 },
  });
}

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';

import { ActionButton } from '@/components/ActionButton';
import { AppScreen } from '@/components/ui/AppScreen';
import { PlaceholderArtwork } from '@/components/ui/PlaceholderArtwork';
import { DeferredNotice } from '@/components/ui/StateViews';
import { neutralGarmentArtworkColors } from '@/fixtures/wardrobe';
import type { WardrobeStackParamList } from '@/navigation/types';
import { useAppTheme, type AppTheme } from '@/theme';
import { showDeferredNotice } from '@/utils/deferred';

type Props = NativeStackScreenProps<WardrobeStackParamList, 'AddItemReview'>;

export function AddItemReviewScreen({ navigation, route }: Props) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const { draft } = route.params;
  const details = [
    ['Category', draft.category],
    ['Subcategory', draft.subcategory],
    ['Primary colour', draft.primaryColor],
    ['Secondary colour', draft.secondaryColor],
    ['Pattern', draft.pattern],
    ['Material', draft.material],
    ['Brand', draft.brand],
    ['Season', draft.season],
    ['Occasion', draft.occasion],
    ['Favourite', draft.isFavorite ? 'Yes' : 'No'],
    ['Notes', draft.notes],
  ] as const;

  return (
    <AppScreen onBack={navigation.goBack} subtitle="Confirm the UI-only draft." title="Review item">
      <View style={styles.preview}>
        <PlaceholderArtwork colors={neutralGarmentArtworkColors} label={draft.name} />
        <View style={styles.previewCopy}>
          <Text accessibilityRole="header" style={styles.itemName}>
            {draft.name}
          </Text>
          <Text style={styles.imageKey}>Local preview: {draft.imageKey}</Text>
        </View>
      </View>
      <View style={styles.details}>
        {details.map(([label, value]) => (
          <View key={label} style={styles.detailRow}>
            <Text style={styles.detailLabel}>{label}</Text>
            <Text style={styles.detailValue}>{value || 'Not specified'}</Text>
          </View>
        ))}
      </View>
      <DeferredNotice>
        “Add to wardrobe” will explain the Phase 2 boundary. It will not write data or show a fake
        saved state.
      </DeferredNotice>
      <ActionButton label="Edit details" onPress={navigation.goBack} variant="secondary" />
      <ActionButton
        label="Add to wardrobe"
        onPress={() => showDeferredNotice('Wardrobe persistence')}
      />
    </AppScreen>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    preview: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.md },
    previewCopy: { flex: 1, justifyContent: 'flex-end', minWidth: 200 },
    itemName: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSize.xl,
      fontWeight: theme.typography.fontWeight.bold,
    },
    imageKey: { color: theme.colors.textMuted, fontSize: theme.typography.fontSize.sm },
    details: {
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
      borderRadius: theme.radii.lg,
      borderWidth: 1,
      overflow: 'hidden',
    },
    detailRow: {
      borderBottomColor: theme.colors.border,
      borderBottomWidth: StyleSheet.hairlineWidth,
      flexDirection: 'row',
      gap: theme.spacing.md,
      padding: theme.spacing.md,
    },
    detailLabel: { color: theme.colors.textMuted, width: 120 },
    detailValue: { color: theme.colors.text, flex: 1, textAlign: 'right' },
  });
}

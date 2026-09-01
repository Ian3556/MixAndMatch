import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ActionButton } from '@/components/ActionButton';
import { AppScreen } from '@/components/ui/AppScreen';
import { PlaceholderArtwork } from '@/components/ui/PlaceholderArtwork';
import { ErrorState } from '@/components/ui/StateViews';
import { neutralGarmentArtworkColors } from '@/fixtures/wardrobe';
import type { WardrobeStackParamList } from '@/navigation/types';
import { useAuthStore } from '@/store/authStore';
import { useWardrobeStore } from '@/store/wardrobeStore';
import { useAppTheme, type AppTheme } from '@/theme';

type Props = NativeStackScreenProps<WardrobeStackParamList, 'AddItemReview'>;

export function AddItemReviewScreen({ navigation, route }: Props) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const { draft } = route.params;
  const user = useAuthStore((state) => state.user);
  const addMany = useWardrobeStore((state) => state.addMany);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const saveLock = useRef(false);
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

  const save = async () => {
    if (!user || saveLock.current) return;
    saveLock.current = true;
    setIsSaving(true);
    setError(null);
    try {
      const [result] = await addMany(user.id, [
        {
          name: draft.name,
          category: draft.category || 'Uncategorised',
          subcategory: draft.subcategory,
          primaryColor: draft.primaryColor,
          secondaryColor: draft.secondaryColor,
          pattern: draft.pattern,
          material: draft.material,
          brand: draft.brand,
          season: draft.season,
          occasion: draft.occasion,
          notes: draft.notes,
          isFavorite: draft.isFavorite,
          importMethod: 'manual',
          deduplicationKey: `manual:${user.id}:${Date.now()}:${Math.random().toString(36).slice(2)}`,
        },
      ]);
      if (result?.status === 'added') navigation.popToTop();
      else if (result?.status === 'duplicate') setError('This item is already in your wardrobe.');
      else setError(result?.message ?? 'The item could not be saved.');
    } finally {
      saveLock.current = false;
      setIsSaving(false);
    }
  };

  return (
    <AppScreen onBack={navigation.goBack} subtitle="Confirm before saving." title="Review item">
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
      {error ? (
        <ErrorState
          action={{ label: 'Dismiss', onPress: () => setError(null) }}
          message={error}
          title="Item not saved"
        />
      ) : null}
      <ActionButton label="Edit details" onPress={navigation.goBack} variant="secondary" />
      <ActionButton label="Add to wardrobe" loading={isSaving} onPress={() => void save()} />
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

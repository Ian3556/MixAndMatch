import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useRef, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { ActionButton } from '@/components/ActionButton';
import { AppScreen } from '@/components/ui/AppScreen';
import { PlaceholderArtwork } from '@/components/ui/PlaceholderArtwork';
import { ErrorState } from '@/components/ui/StateViews';
import { buildManualWardrobeInput } from '@/features/wardrobe/manual/manualWardrobeItem';
import { neutralGarmentArtworkColors } from '@/fixtures/wardrobe';
import { WARDROBE_ROUTES } from '@/navigation/routes';
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
  const [imageFailed, setImageFailed] = useState(false);
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
    ['Price', draft.price ? `${draft.currency} ${Number(draft.price).toFixed(2)}`.trim() : ''],
    ['Favourite', draft.isFavorite ? 'Yes' : 'No'],
    ['Notes', draft.notes],
  ] as const;

  const save = async () => {
    if (!user || saveLock.current) return;
    saveLock.current = true;
    setIsSaving(true);
    setError(null);
    try {
      const [result] = await addMany(user.id, [buildManualWardrobeInput(draft)]);
      if (result?.status === 'added') {
        navigation.popTo(WARDROBE_ROUTES.WARDROBE, {
          notice: `${draft.name} was added to your wardrobe.`,
        });
      } else if (result?.status === 'duplicate') {
        setError(
          'A matching item is already in your wardrobe. Review the details before retrying.',
        );
      } else {
        setError(result?.message ?? 'The item could not be saved.');
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'The item could not be saved.');
    } finally {
      saveLock.current = false;
      setIsSaving(false);
    }
  };

  return (
    <AppScreen {...(isSaving ? {} : { onBack: navigation.goBack })} title="Review item">
      <View style={styles.preview}>
        <View style={styles.imageFrame}>
          {draft.imageUrl && !imageFailed ? (
            <Image
              accessibilityLabel={`${draft.name} wardrobe image`}
              onError={() => setImageFailed(true)}
              resizeMode="cover"
              source={{ uri: draft.imageUrl }}
              style={styles.image}
            />
          ) : (
            <PlaceholderArtwork colors={neutralGarmentArtworkColors} label={draft.name} />
          )}
        </View>
        <View style={styles.previewCopy}>
          <Text accessibilityRole="header" style={styles.itemName}>
            {draft.name}
          </Text>
          <Text style={styles.previewMeta}>
            {[draft.brand, draft.category, draft.primaryColor].filter(Boolean).join(' · ')}
          </Text>
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
      <ActionButton
        disabled={isSaving}
        label="Edit details"
        onPress={navigation.goBack}
        variant="secondary"
      />
      <ActionButton
        disabled={!user}
        label="Add to wardrobe"
        loading={isSaving}
        onPress={() => void save()}
      />
      <ActionButton
        disabled={isSaving}
        label="Cancel"
        onPress={navigation.popToTop}
        variant="text"
      />
    </AppScreen>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    preview: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.md },
    imageFrame: {
      aspectRatio: 4 / 5,
      backgroundColor: theme.colors.surfaceMuted,
      maxWidth: 280,
      overflow: 'hidden',
      width: '100%',
    },
    image: { height: '100%', width: '100%' },
    previewCopy: { flex: 1, justifyContent: 'flex-end', minWidth: 200 },
    itemName: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.editorial,
      fontSize: theme.typography.fontSize.xxl,
      lineHeight: theme.typography.lineHeight.xxl,
    },
    previewMeta: {
      color: theme.colors.textMuted,
      fontFamily: theme.typography.fontFamily.regular,
      fontSize: theme.typography.fontSize.sm,
      lineHeight: theme.typography.lineHeight.sm,
    },
    details: { borderTopColor: theme.colors.border, borderTopWidth: 1 },
    detailRow: {
      borderBottomColor: theme.colors.border,
      borderBottomWidth: StyleSheet.hairlineWidth,
      flexDirection: 'row',
      gap: theme.spacing.md,
      paddingVertical: theme.spacing.md,
    },
    detailLabel: { color: theme.colors.textMuted, width: 120 },
    detailValue: { color: theme.colors.text, flex: 1, textAlign: 'right' },
  });
}

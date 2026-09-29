import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ActionButton } from '@/components/ActionButton';
import { FormTextInput } from '@/components/FormTextInput';
import { AppScreen } from '@/components/ui/AppScreen';
import { SelectField } from '@/components/ui/SelectField';
import { ErrorState, LoadingState } from '@/components/ui/StateViews';
import {
  draftFromWardrobeItem,
  toWardrobeEditUpdate,
  validateWardrobeEdit,
  type WardrobeEditDraft,
} from '@/features/wardrobe/edit/editWardrobeItem';
import { wardrobeCategories } from '@/fixtures/categories';
import type { WardrobeStackParamList } from '@/navigation/types';
import { TOP_SUBCATEGORIES } from '@/services/wardrobeMetadata';
import { useAuthStore } from '@/store/authStore';
import { useWardrobeStore } from '@/store/wardrobeStore';
import { useAppTheme, type AppTheme } from '@/theme';
import type { WardrobeItem } from '@/types/wardrobe';

type Props = NativeStackScreenProps<WardrobeStackParamList, 'EditWardrobeItem'>;

const SEASONS = ['None', 'Spring', 'Summer', 'Autumn', 'Winter', 'All Season'];
const OCCASIONS = [
  'None',
  'Casual',
  'Smart Casual',
  'Business',
  'Formal',
  'Sport',
  'Sport, Tennis',
  'Sport, Gym',
  'Sport, Running',
  'Outdoor',
  'Travel',
  'Party',
  'Date',
  'Home',
];

export function EditWardrobeItemScreen({ navigation, route }: Props) {
  const user = useAuthStore((state) => state.user);
  const loadedUserId = useWardrobeStore((state) => state.loadedUserId);
  const status = useWardrobeStore((state) => state.status);
  const refresh = useWardrobeStore((state) => state.refresh);
  const item = useWardrobeStore((state) =>
    state.loadedUserId === user?.id
      ? state.items.find((candidate) => candidate.id === route.params.itemId)
      : undefined,
  );

  useEffect(() => {
    if (user && loadedUserId !== user.id) void refresh(user.id);
  }, [loadedUserId, refresh, user]);

  if (user && (loadedUserId !== user.id || status === 'loading')) {
    return (
      <AppScreen onBack={navigation.goBack} title="Edit item">
        <LoadingState message="Loading the saved item." title="Opening item" />
      </AppScreen>
    );
  }
  if (!item || !user) {
    return (
      <AppScreen onBack={navigation.goBack} title="Item unavailable">
        <ErrorState
          action={{ label: 'Go back', onPress: navigation.goBack }}
          message="This wardrobe item could not be found."
          title="Item not found"
        />
      </AppScreen>
    );
  }
  return <EditForm item={item} navigation={navigation} userId={user.id} />;
}

function EditForm({
  item,
  navigation,
  userId,
}: {
  item: WardrobeItem;
  navigation: Props['navigation'];
  userId: string;
}) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const updateItem = useWardrobeStore((state) => state.updateItem);
  const [draft, setDraft] = useState<WardrobeEditDraft>(() => draftFromWardrobeItem(item));
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const saveLock = useRef(false);
  const update = (key: keyof WardrobeEditDraft, value: string) =>
    setDraft((current) => ({ ...current, [key]: value }));

  const save = async () => {
    if (saveLock.current) return;
    const validationError = validateWardrobeEdit(draft);
    if (validationError) {
      setError(validationError);
      return;
    }
    saveLock.current = true;
    setIsSaving(true);
    setError(null);
    try {
      await updateItem(userId, item.id, toWardrobeEditUpdate(item, draft));
      navigation.goBack();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'The item could not be updated.');
    } finally {
      saveLock.current = false;
      setIsSaving(false);
    }
  };

  return (
    <AppScreen {...(isSaving ? {} : { onBack: navigation.goBack })} title="Edit item">
      <Text style={styles.intro}>
        Fill in what you know. Source and catalog references stay linked.
      </Text>
      <FormTextInput
        label="Brand"
        maxLength={120}
        onChangeText={(value) => update('brand', value)}
        value={draft.brand}
      />
      <FormTextInput
        label="Item name"
        maxLength={180}
        onChangeText={(value) => update('name', value)}
        value={draft.name}
      />
      <SelectField
        label="Category"
        onChange={(value) => update('category', value)}
        options={wardrobeCategories.slice(1).map((category) => category.label)}
        square
        value={draft.category}
      />
      {draft.category === 'Tops' ? (
        <SelectField
          label="Subcategory"
          onChange={(value) => update('subcategory', value === 'None' ? '' : value)}
          options={['None', ...TOP_SUBCATEGORIES]}
          square
          value={draft.subcategory}
        />
      ) : (
        <FormTextInput
          label="Subcategory"
          maxLength={100}
          onChangeText={(value) => update('subcategory', value)}
          placeholder="Add subcategory"
          value={draft.subcategory}
        />
      )}
      <FormTextInput
        label="Colour"
        maxLength={100}
        onChangeText={(value) => update('color', value)}
        placeholder="Add colour"
        value={draft.color}
      />
      <FormTextInput
        label="Material"
        maxLength={100}
        onChangeText={(value) => update('material', value)}
        placeholder="Add material only if known"
        value={draft.material}
      />
      <View style={styles.columns}>
        <View style={styles.column}>
          <SelectField
            label="Season"
            onChange={(value) => update('season', value === 'None' ? '' : value)}
            options={SEASONS}
            square
            value={draft.season}
          />
        </View>
        <View style={styles.column}>
          <SelectField
            label="Occasion"
            onChange={(value) => update('occasion', value === 'None' ? '' : value)}
            options={OCCASIONS}
            square
            value={draft.occasion}
          />
        </View>
      </View>
      <FormTextInput
        label="Size"
        maxLength={100}
        onChangeText={(value) => update('size', value)}
        value={draft.size}
      />
      <FormTextInput
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="url"
        label="Image URL"
        maxLength={2048}
        onChangeText={(value) => update('imageUrl', value)}
        placeholder="HTTPS image URL"
        value={draft.imageUrl}
      />
      <FormTextInput
        label="My notes"
        maxLength={2000}
        multiline
        numberOfLines={4}
        onChangeText={(value) => update('notes', value)}
        placeholder="Add personal notes"
        textAlignVertical="top"
        value={draft.notes}
      />
      {error ? (
        <ErrorState
          action={{ label: 'Dismiss', onPress: () => setError(null) }}
          message={error}
          title="Could not save changes"
        />
      ) : null}
      <ActionButton label="Save changes" loading={isSaving} onPress={() => void save()} square />
      <ActionButton
        disabled={isSaving}
        label="Cancel"
        onPress={navigation.goBack}
        square
        variant="text"
      />
    </AppScreen>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    intro: { color: theme.colors.textMuted, fontSize: theme.typography.fontSize.sm },
    columns: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.md },
    column: { flex: 1, minWidth: 180 },
  });
}

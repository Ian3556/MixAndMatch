import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ActionButton } from '@/components/ActionButton';
import { FormTextInput } from '@/components/FormTextInput';
import { AppScreen } from '@/components/ui/AppScreen';
import { SelectField } from '@/components/ui/SelectField';
import { ToggleRow } from '@/components/ui/ToggleRow';
import { wardrobeCategories } from '@/fixtures/categories';
import { WARDROBE_ROUTES } from '@/navigation/routes';
import type { WardrobeStackParamList } from '@/navigation/types';
import { useAppTheme, type AppTheme } from '@/theme';
import type { DraftWardrobeItem } from '@/types/wardrobe';

type Props = NativeStackScreenProps<WardrobeStackParamList, 'AddItemDetails'>;

const initialDraft: Omit<DraftWardrobeItem, 'imageKey'> = {
  name: '',
  category: '',
  subcategory: '',
  primaryColor: '',
  secondaryColor: '',
  pattern: '',
  material: '',
  brand: '',
  season: '',
  occasion: '',
  notes: '',
  isFavorite: false,
};

export function AddItemDetailsScreen({ navigation, route }: Props) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const [draft, setDraft] = useState<DraftWardrobeItem>({
    ...initialDraft,
    imageKey: route.params.imageKey,
  });
  const [nameError, setNameError] = useState<string | undefined>();

  function updateDraft<K extends keyof DraftWardrobeItem>(key: K, value: DraftWardrobeItem[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  const continueToReview = () => {
    if (!draft.name.trim()) {
      setNameError('Enter an item name to preview the review screen.');
      return;
    }
    navigation.navigate(WARDROBE_ROUTES.ADD_ITEM_REVIEW, {
      draft: { ...draft, name: draft.name.trim() },
    });
  };

  return (
    <AppScreen
      onBack={navigation.goBack}
      subtitle="Add the details required to save this item."
      title="Item details"
    >
      <FormTextInput
        error={nameError}
        label="Item name"
        onChangeText={(value) => {
          updateDraft('name', value);
          setNameError(undefined);
        }}
        placeholder="e.g. Navy relaxed blazer"
        value={draft.name}
      />
      <View style={styles.twoColumn}>
        <View style={styles.fieldColumn}>
          <SelectField
            label="Category"
            onChange={(value) => updateDraft('category', value)}
            options={wardrobeCategories.slice(1).map((item) => item.label)}
            value={draft.category}
          />
        </View>
        <View style={styles.fieldColumn}>
          <SelectField
            label="Subcategory"
            onChange={(value) => updateDraft('subcategory', value)}
            options={['Basic', 'Layer', 'Statement', 'Tailored', 'Casual']}
            value={draft.subcategory}
          />
        </View>
      </View>
      <View style={styles.twoColumn}>
        <View style={styles.fieldColumn}>
          <SelectField
            label="Primary colour"
            onChange={(value) => updateDraft('primaryColor', value)}
            options={['Black', 'White', 'Navy', 'Grey', 'Brown', 'Beige', 'Green', 'Blue', 'Red']}
            value={draft.primaryColor}
          />
        </View>
        <View style={styles.fieldColumn}>
          <SelectField
            label="Secondary colour"
            onChange={(value) => updateDraft('secondaryColor', value)}
            options={['None', 'Black', 'White', 'Navy', 'Grey', 'Brown', 'Beige', 'Green', 'Blue']}
            value={draft.secondaryColor}
          />
        </View>
      </View>
      <SelectField
        label="Pattern"
        onChange={(value) => updateDraft('pattern', value)}
        options={['Solid', 'Striped', 'Checked', 'Floral', 'Graphic', 'Textured']}
        value={draft.pattern}
      />
      <SelectField
        label="Material"
        onChange={(value) => updateDraft('material', value)}
        options={['Cotton', 'Linen', 'Wool', 'Denim', 'Leather', 'Synthetic', 'Blend', 'Unknown']}
        value={draft.material}
      />
      <FormTextInput
        label="Brand"
        onChangeText={(value) => updateDraft('brand', value)}
        placeholder="Optional"
        value={draft.brand}
      />
      <View style={styles.twoColumn}>
        <View style={styles.fieldColumn}>
          <SelectField
            label="Season"
            onChange={(value) => updateDraft('season', value)}
            options={['All season', 'Warm weather', 'Cold weather', 'Transitional']}
            value={draft.season}
          />
        </View>
        <View style={styles.fieldColumn}>
          <SelectField
            label="Occasion"
            onChange={(value) => updateDraft('occasion', value)}
            options={['Everyday', 'Work', 'Formal', 'Evening', 'Travel', 'Active']}
            value={draft.occasion}
          />
        </View>
      </View>
      <FormTextInput
        label="Notes"
        multiline
        numberOfLines={4}
        onChangeText={(value) => updateDraft('notes', value)}
        placeholder="Fit, care, or styling notes"
        textAlignVertical="top"
        value={draft.notes}
      />
      <ToggleRow
        description="Favourite status is saved with the wardrobe item."
        label="Favourite item"
        onValueChange={(value) => updateDraft('isFavorite', value)}
        value={draft.isFavorite}
      />
      <ActionButton label="Review item" onPress={continueToReview} />
    </AppScreen>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    twoColumn: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.md },
    fieldColumn: { flex: 1, minWidth: 220 },
  });
}

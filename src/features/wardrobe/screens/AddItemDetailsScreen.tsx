import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ActionButton } from '@/components/ActionButton';
import { FormTextInput } from '@/components/FormTextInput';
import { AppScreen } from '@/components/ui/AppScreen';
import { SelectField } from '@/components/ui/SelectField';
import { ToggleRow } from '@/components/ui/ToggleRow';
import {
  createManualDeduplicationKey,
  validateManualWardrobeItem,
  type ManualWardrobeItemErrors,
} from '@/features/wardrobe/manual/manualWardrobeItem';
import { wardrobeCategories } from '@/fixtures/categories';
import { WARDROBE_ROUTES } from '@/navigation/routes';
import type { WardrobeStackParamList } from '@/navigation/types';
import { useAppTheme, type AppTheme } from '@/theme';
import type { DraftWardrobeItem } from '@/types/wardrobe';

type Props = NativeStackScreenProps<WardrobeStackParamList, 'AddItemDetails'>;

export function AddItemDetailsScreen({ navigation, route }: Props) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const [draft, setDraft] = useState<DraftWardrobeItem>(() => ({
    deduplicationKey: createManualDeduplicationKey(),
    imageKey: route.params.imageKey,
    imageUrl: '',
    name: '',
    category: '',
    subcategory: '',
    primaryColor: '',
    secondaryColor: '',
    size: '',
    pattern: '',
    material: '',
    brand: '',
    season: '',
    occasion: '',
    notes: '',
    price: '',
    currency: '',
    isFavorite: false,
    sourceType: 'manual',
    sourceUrl: '',
    ...route.params.initialDraft,
  }));
  const [errors, setErrors] = useState<ManualWardrobeItemErrors>({});

  function updateDraft<K extends keyof DraftWardrobeItem>(key: K, value: DraftWardrobeItem[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
    if (key in errors) {
      setErrors((current) => {
        const next = { ...current };
        delete next[key as keyof ManualWardrobeItemErrors];
        return next;
      });
    }
  }

  const continueToReview = () => {
    const nextErrors = validateManualWardrobeItem(draft);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    navigation.navigate(WARDROBE_ROUTES.ADD_ITEM_REVIEW, {
      draft: {
        ...draft,
        name: draft.name.trim(),
        category: draft.category.trim(),
        currency: draft.currency.trim().toUpperCase(),
      },
    });
  };

  const requiredMissing = !draft.name.trim() || !draft.category.trim();

  return (
    <AppScreen onBack={navigation.goBack} title="Add manually">
      <Text style={styles.requiredNote}>Required fields are marked *</Text>
      <FormTextInput
        error={errors.name}
        label="Item name *"
        maxLength={180}
        onChangeText={(value) => updateDraft('name', value)}
        placeholder="e.g. Navy relaxed blazer"
        value={draft.name}
      />
      <SelectField
        error={errors.category}
        label="Category *"
        onChange={(value) => updateDraft('category', value)}
        options={wardrobeCategories.slice(1).map((item) => item.label)}
        value={draft.category}
      />
      <FormTextInput
        autoCapitalize="none"
        autoCorrect={false}
        error={errors.imageUrl}
        keyboardType="url"
        label="Product image URL"
        maxLength={2048}
        onChangeText={(value) => updateDraft('imageUrl', value)}
        placeholder="Optional HTTPS image URL"
        value={draft.imageUrl}
      />

      <View style={styles.twoColumn}>
        <View style={styles.fieldColumn}>
          <SelectField
            label="Subcategory"
            onChange={(value) => updateDraft('subcategory', value)}
            options={['Basic', 'Layer', 'Statement', 'Tailored', 'Casual']}
            value={draft.subcategory}
          />
        </View>
        <View style={styles.fieldColumn}>
          <FormTextInput
            label="Brand"
            maxLength={120}
            onChangeText={(value) => updateDraft('brand', value)}
            placeholder="Optional"
            value={draft.brand}
          />
        </View>
      </View>

      <FormTextInput
        label="Size"
        maxLength={100}
        onChangeText={(value) => updateDraft('size', value)}
        placeholder="Optional"
        value={draft.size}
      />

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

      <View style={styles.twoColumn}>
        <View style={styles.fieldColumn}>
          <SelectField
            label="Pattern"
            onChange={(value) => updateDraft('pattern', value)}
            options={['Solid', 'Striped', 'Checked', 'Floral', 'Graphic', 'Textured']}
            value={draft.pattern}
          />
        </View>
        <View style={styles.fieldColumn}>
          <SelectField
            label="Material"
            onChange={(value) => updateDraft('material', value)}
            options={[
              'Cotton',
              'Linen',
              'Wool',
              'Denim',
              'Leather',
              'Synthetic',
              'Blend',
              'Unknown',
            ]}
            value={draft.material}
          />
        </View>
      </View>

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

      <Text accessibilityRole="header" style={styles.groupHeading}>
        Purchase information
      </Text>
      {draft.sourceUrl ? (
        <Text style={styles.sourceNote}>Source retained from {draft.sourceUrl}</Text>
      ) : null}
      <View style={styles.twoColumn}>
        <View style={styles.fieldColumn}>
          <FormTextInput
            error={errors.price}
            keyboardType="decimal-pad"
            label="Price"
            maxLength={16}
            onChangeText={(value) => updateDraft('price', value)}
            placeholder="Optional"
            value={draft.price}
          />
        </View>
        <View style={styles.fieldColumn}>
          <FormTextInput
            autoCapitalize="characters"
            autoCorrect={false}
            error={errors.currency}
            label="Currency"
            maxLength={3}
            onChangeText={(value) => updateDraft('currency', value.toUpperCase())}
            placeholder="MYR"
            value={draft.currency}
          />
        </View>
      </View>

      <FormTextInput
        label="Notes"
        maxLength={2000}
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
      <ActionButton disabled={requiredMissing} label="Review item" onPress={continueToReview} />
      <ActionButton label="Cancel" onPress={navigation.popToTop} variant="text" />
    </AppScreen>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    requiredNote: {
      color: theme.colors.textMuted,
      fontFamily: theme.typography.fontFamily.regular,
      fontSize: theme.typography.fontSize.xs,
      lineHeight: theme.typography.lineHeight.xs,
    },
    sourceNote: {
      color: theme.colors.textMuted,
      fontFamily: theme.typography.fontFamily.regular,
      fontSize: theme.typography.fontSize.xs,
      lineHeight: theme.typography.lineHeight.xs,
    },
    groupHeading: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.semibold,
      letterSpacing: 1.2,
      textTransform: 'uppercase',
    },
    twoColumn: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.md },
    fieldColumn: { flex: 1, minWidth: 220 },
  });
}

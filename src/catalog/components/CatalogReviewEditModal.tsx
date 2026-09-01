import { useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { CatalogProductEditPatch } from '@supabase/functions/_shared/catalog/management-actions';

import type { CatalogReviewItem } from '@/catalog/types';
import { ActionButton } from '@/components/ActionButton';
import { FormTextInput } from '@/components/FormTextInput';
import { ToggleRow } from '@/components/ui/ToggleRow';
import { useAppTheme, type AppTheme } from '@/theme';

type Props = {
  item: CatalogReviewItem | null;
  visible: boolean;
  pending: boolean;
  onDismiss: () => void;
  onSave: (patch: CatalogProductEditPatch) => Promise<boolean>;
};

export function CatalogReviewEditModal({ item, visible, pending, onDismiss, onSave }: Props) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const [name, setName] = useState(item?.product_name ?? '');
  const [category, setCategory] = useState(item?.category_slug ?? '');
  const [subcategory, setSubcategory] = useState(item?.subcategory_slug ?? '');
  const [primaryColor, setPrimaryColor] = useState(item?.primary_color ?? '');
  const [colorFamily, setColorFamily] = useState(item?.color_family ?? '');
  const [materialSummary, setMaterialSummary] = useState(item?.material_summary ?? '');
  const [price, setPrice] = useState(
    item?.current_price === null || item?.current_price === undefined
      ? ''
      : String(item.current_price),
  );
  const [currency, setCurrency] = useState(item?.currency ?? '');
  const [priceUnavailable, setPriceUnavailable] = useState(item?.price_unavailable ?? false);
  const [formError, setFormError] = useState<string | null>(null);

  const submit = async () => {
    if (!name.trim() || !category.trim()) {
      setFormError('Name and canonical category slug are required.');
      return;
    }
    const parsedPrice = price.trim() ? Number(price.trim()) : null;
    if (
      (parsedPrice === null && !priceUnavailable) ||
      (parsedPrice !== null && (!Number.isFinite(parsedPrice) || parsedPrice < 0))
    ) {
      setFormError('Enter a non-negative price or mark the price explicitly unavailable.');
      return;
    }
    const saved = await onSave({
      name: name.trim(),
      categorySlug: category.trim(),
      subcategorySlug: subcategory.trim() || null,
      primaryColor: primaryColor.trim() || null,
      colorFamily: colorFamily.trim() || null,
      materialSummary: materialSummary.trim() || null,
      currentPrice: parsedPrice,
      currency: currency.trim().toUpperCase() || null,
      priceUnavailable,
    });
    if (saved) onDismiss();
  };

  return (
    <Modal animationType="slide" onRequestClose={onDismiss} visible={visible}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <View style={styles.copy}>
              <Text accessibilityRole="header" style={styles.title}>
                Edit review product
              </Text>
              <Text style={styles.subtitle}>{item?.brand_name}</Text>
            </View>
            <ActionButton disabled={pending} label="Close" onPress={onDismiss} variant="text" />
          </View>
          <FormTextInput
            editable={!pending}
            label="Product name"
            onChangeText={setName}
            value={name}
          />
          <FormTextInput
            autoCapitalize="none"
            editable={!pending}
            label="Category slug"
            onChangeText={setCategory}
            value={category}
          />
          <FormTextInput
            autoCapitalize="none"
            editable={!pending}
            label="Subcategory slug"
            onChangeText={setSubcategory}
            value={subcategory}
          />
          <FormTextInput
            editable={!pending}
            label="Primary colour"
            onChangeText={setPrimaryColor}
            value={primaryColor}
          />
          <FormTextInput
            editable={!pending}
            label="Colour family"
            onChangeText={setColorFamily}
            value={colorFamily}
          />
          <FormTextInput
            editable={!pending}
            label="Material summary"
            onChangeText={setMaterialSummary}
            value={materialSummary}
          />
          <FormTextInput
            editable={!pending && !priceUnavailable}
            keyboardType="decimal-pad"
            label="Current price"
            onChangeText={setPrice}
            value={price}
          />
          <FormTextInput
            autoCapitalize="characters"
            editable={!pending}
            label="Currency"
            maxLength={3}
            onChangeText={setCurrency}
            value={currency}
          />
          <ToggleRow
            description="Use only when the public source explicitly has no usable price."
            label="Price unavailable"
            onValueChange={setPriceUnavailable}
            value={priceUnavailable}
          />
          {formError ? <Text style={styles.error}>{formError}</Text> : null}
          <ActionButton
            label="Save review changes"
            loading={pending}
            onPress={() => void submit()}
          />
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    safeArea: { backgroundColor: theme.colors.background, flex: 1 },
    content: {
      alignSelf: 'center',
      gap: theme.spacing.md,
      maxWidth: 720,
      padding: theme.spacing.lg,
      paddingBottom: theme.spacing.xxxl,
      width: '100%',
    },
    header: { alignItems: 'flex-start', flexDirection: 'row', gap: theme.spacing.md },
    copy: { flex: 1 },
    title: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSize.xl,
      fontWeight: theme.typography.fontWeight.bold,
    },
    subtitle: { color: theme.colors.textMuted },
    error: { color: theme.colors.danger, fontSize: theme.typography.fontSize.sm },
  });
}

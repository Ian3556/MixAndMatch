import { useRef, useState } from 'react';
import { Modal, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { ActionButton } from '@/components/ActionButton';
import { FormTextInput } from '@/components/FormTextInput';
import { SelectField } from '@/components/ui/SelectField';
import { wardrobeCategories } from '@/fixtures/categories';
import type { ImportedProductCandidate } from '@supabase/functions/_shared/wardrobe-import/types';
import { useAppTheme, type AppTheme } from '@/theme';

type Props = {
  candidate: ImportedProductCandidate | null;
  onCancel: () => void;
  onSave: (candidate: ImportedProductCandidate) => void;
};

type EditFields = {
  name: string;
  category: string;
  subcategory: string;
  brand: string;
  color: string;
  imageUrl: string;
  notes: string;
};

export function EditImportedProductModal({ candidate, onCancel, onSave }: Props) {
  if (!candidate) return null;
  return (
    <EditImportedProductForm
      candidate={candidate}
      key={`${candidate.productUrl}:${candidate.name}`}
      onCancel={onCancel}
      onSave={onSave}
    />
  );
}

function EditImportedProductForm({
  candidate,
  onCancel,
  onSave,
}: Omit<Props, 'candidate'> & {
  candidate: ImportedProductCandidate;
}) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const nameRef = useRef<TextInput>(null);
  const [fields, setFields] = useState<EditFields>(() => ({
    name: candidate.name,
    category: candidate.category ?? '',
    subcategory: candidate.subcategory ?? '',
    brand: candidate.brand ?? '',
    color: candidate.color ?? '',
    imageUrl: candidate.imageUrl ?? '',
    notes: candidate.description ?? '',
  }));
  const [nameError, setNameError] = useState<string>();

  const update = (key: keyof EditFields, value: string) =>
    setFields((current) => ({ ...current, [key]: value }));

  const save = () => {
    if (!fields.name.trim()) {
      setNameError('Enter an item name.');
      return;
    }
    onSave({
      ...candidate,
      name: fields.name.trim(),
      category: fields.category.trim(),
      subcategory: fields.subcategory.trim(),
      brand: fields.brand.trim(),
      color: fields.color.trim(),
      imageUrl: fields.imageUrl.trim(),
      description: fields.notes.trim(),
    });
  };

  return (
    <Modal
      animationType="slide"
      onRequestClose={onCancel}
      onShow={() => nameRef.current?.focus()}
      transparent
      visible
    >
      <SafeAreaView style={styles.backdrop}>
        <View accessibilityViewIsModal style={styles.sheet}>
          <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            <View style={styles.heading}>
              <View style={styles.headingCopy}>
                <Text accessibilityRole="header" style={styles.title}>
                  Edit imported product
                </Text>
                <Text style={styles.subtitle}>Correct the detected details before saving.</Text>
              </View>
              <ActionButton label="Cancel" onPress={onCancel} variant="text" />
            </View>
            <FormTextInput
              error={nameError}
              label="Item name"
              onChangeText={(value) => {
                update('name', value);
                setNameError(undefined);
              }}
              ref={nameRef}
              value={fields.name}
            />
            <SelectField
              label="Category"
              onChange={(value) => update('category', value)}
              options={wardrobeCategories.slice(1).map((item) => item.label)}
              value={fields.category}
            />
            <FormTextInput
              label="Subcategory"
              onChangeText={(value) => update('subcategory', value)}
              value={fields.subcategory}
            />
            <FormTextInput
              label="Brand"
              onChangeText={(value) => update('brand', value)}
              value={fields.brand}
            />
            <FormTextInput
              label="Colour"
              onChangeText={(value) => update('color', value)}
              value={fields.color}
            />
            <FormTextInput
              autoCapitalize="none"
              keyboardType="url"
              label="Image URL"
              onChangeText={(value) => update('imageUrl', value)}
              value={fields.imageUrl}
            />
            <FormTextInput
              label="Notes"
              multiline
              numberOfLines={4}
              onChangeText={(value) => update('notes', value)}
              textAlignVertical="top"
              value={fields.notes}
            />
            <ActionButton label="Save changes" onPress={save} />
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    backdrop: { backgroundColor: theme.colors.overlay, flex: 1, justifyContent: 'flex-end' },
    sheet: {
      backgroundColor: theme.colors.background,
      borderTopLeftRadius: theme.radii.xl,
      borderTopRightRadius: theme.radii.xl,
      maxHeight: '92%',
      width: '100%',
    },
    content: {
      alignSelf: 'center',
      gap: theme.spacing.md,
      maxWidth: 720,
      padding: theme.spacing.lg,
      width: '100%',
    },
    heading: { alignItems: 'flex-start', flexDirection: 'row', gap: theme.spacing.md },
    headingCopy: { flex: 1 },
    title: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSize.xl,
      fontWeight: theme.typography.fontWeight.bold,
    },
    subtitle: { color: theme.colors.textMuted, fontSize: theme.typography.fontSize.sm },
  });
}

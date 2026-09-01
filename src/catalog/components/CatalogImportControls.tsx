import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { CatalogManagementAction } from '@supabase/functions/_shared/catalog/management-actions';

import { ActionButton } from '@/components/ActionButton';
import { FormTextInput } from '@/components/FormTextInput';
import { useAppTheme, type AppTheme } from '@/theme';

type Props = {
  brandName: string | null;
  brandSlug: string | null;
  pending: boolean;
  onAction: (action: CatalogManagementAction) => void;
};

export function CatalogImportControls({ brandName, brandSlug, pending, onAction }: Props) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const [sourceUrl, setSourceUrl] = useState('');
  const disabled = pending || !brandSlug;

  const startImport = () => {
    if (!brandSlug) return;
    const url = sourceUrl.trim();
    onAction({
      action: 'start_import',
      brandSlug,
      ...(url ? { urls: [url] } : {}),
    });
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Import controls</Text>
      <Text style={styles.description}>
        {brandName
          ? `Selected brand: ${brandName}. Imports use one approved checkpoint per request.`
          : 'Select a brand progress card before starting an operation.'}
      </Text>
      <FormTextInput
        autoCapitalize="none"
        autoCorrect={false}
        editable={!pending}
        keyboardType="url"
        label="Approved product or listing URL (optional)"
        onChangeText={setSourceUrl}
        placeholder="Use the source's configured entry URLs when blank"
        value={sourceUrl}
      />
      <View style={styles.actions}>
        <ActionButton
          disabled={disabled}
          label="Import brand"
          loading={pending}
          onPress={startImport}
        />
        <ActionButton
          disabled={disabled}
          label="Revalidate"
          onPress={() =>
            brandSlug &&
            onAction({ action: 'start_maintenance', brandSlug, operation: 'revalidate' })
          }
          variant="secondary"
        />
        <ActionButton
          disabled={disabled}
          label="Re-enrich"
          onPress={() =>
            brandSlug && onAction({ action: 'start_maintenance', brandSlug, operation: 'reenrich' })
          }
          variant="secondary"
        />
      </View>
      <Text style={styles.safety}>
        A source must be enabled, domain-allowlisted, and have recorded terms and robots reviews.
        This screen cannot bypass those server checks.
      </Text>
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
      gap: theme.spacing.md,
      padding: theme.spacing.lg,
    },
    title: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSize.lg,
      fontWeight: theme.typography.fontWeight.bold,
    },
    description: { color: theme.colors.textMuted, lineHeight: theme.typography.lineHeight.sm },
    actions: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
    safety: { color: theme.colors.warning, fontSize: theme.typography.fontSize.xs },
  });
}

import { StyleSheet, Text, View } from 'react-native';

import { ActionButton } from '@/components/ActionButton';
import { FormTextInput } from '@/components/FormTextInput';
import { AppScreen } from '@/components/ui/AppScreen';
import { WardrobeImportClientError } from '@/services/wardrobeImportService';
import type { UrlValidationResult } from '@supabase/functions/_shared/wardrobe-import/validate-url';
import { useAppTheme, type AppTheme } from '@/theme';

import { ImportErrorPanel } from './ImportErrorPanel';

type Props = {
  attempted: boolean;
  error: WardrobeImportClientError | null;
  isImporting: boolean;
  onAnalyze: () => void;
  onCancel: () => void;
  onClear: () => void;
  onManual: () => void;
  onPaste: () => void;
  onTryAnother: () => void;
  onUrlChange: (value: string) => void;
  url: string;
  validation: UrlValidationResult;
};

export function ImportUrlInputStep({
  attempted,
  error,
  isImporting,
  onAnalyze,
  onCancel,
  onClear,
  onManual,
  onPaste,
  onTryAnother,
  onUrlChange,
  url,
  validation,
}: Props) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const inputError = attempted && !validation.ok ? validation.message : undefined;

  return (
    <AppScreen
      onBack={onCancel}
      subtitle="Import a public product, category, collection, or search-results page."
      title="Import from website"
    >
      <View style={styles.notice}>
        <Text style={styles.noticeTitle}>Supported pages</Text>
        <Text style={styles.bodyText}>
          Mix & Match reads public server-visible product metadata and HTML. Retailers that need
          login, browser scripts, CAPTCHA, or block automated access may not work.
        </Text>
      </View>
      <FormTextInput
        autoCapitalize="none"
        autoCorrect={false}
        error={inputError}
        keyboardType="url"
        label="Retailer URL"
        onChangeText={onUrlChange}
        onSubmitEditing={onAnalyze}
        placeholder="https://shop.example.com/products/item"
        returnKeyType="go"
        value={url}
      />
      <View style={styles.inlineActions}>
        <View style={styles.flexAction}>
          <ActionButton label="Paste" onPress={onPaste} variant="secondary" />
        </View>
        <View style={styles.flexAction}>
          <ActionButton disabled={!url} label="Clear" onPress={onClear} variant="secondary" />
        </View>
      </View>
      {error ? (
        <ImportErrorPanel
          error={error}
          onRetry={error.code === 'NO_PRODUCTS_FOUND' ? onTryAnother : onAnalyze}
        />
      ) : null}
      <ActionButton
        disabled={!validation.ok}
        label="Analyse URL"
        loading={isImporting}
        onPress={onAnalyze}
      />
      <ActionButton label="Cancel" onPress={onCancel} variant="text" />
      {error?.code === 'NO_PRODUCTS_FOUND' || error?.code === 'ACCESS_DENIED' ? (
        <ActionButton label="Add item manually" onPress={onManual} variant="secondary" />
      ) : null}
    </AppScreen>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    notice: {
      backgroundColor: theme.colors.primarySoft,
      borderColor: theme.colors.primary,
      borderRadius: theme.radii.md,
      borderWidth: 1,
      gap: theme.spacing.xs,
      padding: theme.spacing.md,
    },
    noticeTitle: { color: theme.colors.primary, fontWeight: theme.typography.fontWeight.bold },
    bodyText: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSize.sm,
      lineHeight: theme.typography.lineHeight.sm,
    },
    inlineActions: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
    flexAction: { flex: 1, minWidth: 140 },
  });
}

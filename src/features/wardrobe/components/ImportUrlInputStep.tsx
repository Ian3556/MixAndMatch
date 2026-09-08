import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, View } from 'react-native';

import { ActionButton } from '@/components/ActionButton';
import { FormTextInput } from '@/components/FormTextInput';
import { AppScreen } from '@/components/ui/AppScreen';
import { WardrobeImportClientError } from '@/services/wardrobeImportService';
import { useAppTheme, type AppTheme } from '@/theme';
import type { UrlValidationResult } from '@supabase/functions/_shared/wardrobe-import/validate-url';

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

const supportedPages = [
  { supported: true, label: 'Public individual product pages' },
  { supported: true, label: 'Public category or collection pages with product markup' },
  { supported: true, label: 'Retailer or brand pages that expose product metadata' },
  { supported: false, label: 'Homepages without product information' },
  { supported: false, label: 'Login-only, private, or CAPTCHA-protected pages' },
  { supported: false, label: 'JavaScript-only or access-blocked websites' },
] as const;

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
    <AppScreen onBack={onCancel} title="Import from website">
      <View style={styles.supportedSection}>
        <Text accessibilityRole="header" style={styles.supportedTitle}>
          Supported pages
        </Text>
        <View>
          {supportedPages.map((item) => (
            <View key={item.label} style={styles.supportRow}>
              <Ionicons
                color={item.supported ? theme.colors.success : theme.colors.danger}
                name={item.supported ? 'checkmark-outline' : 'close-outline'}
                size={20}
              />
              <Text style={styles.supportLabel}>{item.label}</Text>
            </View>
          ))}
        </View>
      </View>
      <FormTextInput
        autoCapitalize="none"
        autoCorrect={false}
        error={inputError}
        keyboardType="url"
        label="Retailer URL"
        maxLength={2048}
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
      <ActionButton label="Analyse URL" loading={isImporting} onPress={onAnalyze} />
      <ActionButton label="Cancel" onPress={onCancel} variant="text" />
      {error?.code === 'NO_PRODUCTS_FOUND' || error?.code === 'ACCESS_DENIED' ? (
        <ActionButton label="Add item manually" onPress={onManual} variant="secondary" />
      ) : null}
    </AppScreen>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    supportedSection: { gap: theme.spacing.sm },
    supportedTitle: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.semibold,
      letterSpacing: 1.2,
      textTransform: 'uppercase',
    },
    supportRow: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: theme.spacing.sm,
      minHeight: 36,
    },
    supportLabel: {
      color: theme.colors.text,
      flex: 1,
      fontFamily: theme.typography.fontFamily.regular,
      fontSize: theme.typography.fontSize.sm,
      lineHeight: theme.typography.lineHeight.sm,
    },
    inlineActions: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
    flexAction: { flex: 1, minWidth: 140 },
  });
}

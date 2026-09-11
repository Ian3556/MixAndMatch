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
  'Individual product pages',
  'Public fashion product pages',
  'Pages with structured product data',
] as const;
const unsupportedPages = [
  'Home or search pages',
  'Shopping carts',
  'Login-protected or private pages',
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
        <View style={styles.indicatorGroup}>
          <Text style={styles.indicatorHeading}>Supported</Text>
          {supportedPages.map((label) => (
            <SupportIndicator key={label} label={label} supported />
          ))}
        </View>
        <View style={styles.indicatorGroup}>
          <Text style={styles.indicatorHeading}>Not supported</Text>
          {unsupportedPages.map((label) => (
            <SupportIndicator key={label} label={label} supported={false} />
          ))}
        </View>
      </View>
      <FormTextInput
        autoCapitalize="none"
        autoCorrect={false}
        error={inputError}
        keyboardType="url"
        label="Paste product URL"
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
      <ActionButton label="Import product" loading={isImporting} onPress={onAnalyze} />
      <ActionButton label="Cancel" onPress={onCancel} variant="text" />
      {error ? (
        <ActionButton label="Continue manually" onPress={onManual} variant="secondary" />
      ) : null}
    </AppScreen>
  );
}

function SupportIndicator({ label, supported }: { label: string; supported: boolean }) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  return (
    <View style={styles.supportRow}>
      <Ionicons
        color={supported ? theme.colors.success : theme.colors.danger}
        name={supported ? 'checkmark-outline' : 'close-outline'}
        size={20}
      />
      <Text style={styles.supportLabel}>{label}</Text>
    </View>
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
    indicatorGroup: { gap: theme.spacing.xs },
    indicatorHeading: {
      color: theme.colors.textMuted,
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.xs,
      letterSpacing: 1,
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

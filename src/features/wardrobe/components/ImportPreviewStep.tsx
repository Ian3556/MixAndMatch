import * as Linking from 'expo-linking';
import type { Dispatch, SetStateAction } from 'react';
import { useState } from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { ActionButton } from '@/components/ActionButton';
import { AppScreen } from '@/components/ui/AppScreen';
import {
  setAllSelected,
  toggleImportSelection,
  updateImportCandidate,
  type ImportPreviewItem,
} from '@/features/wardrobe/import/importWorkflow';
import { WardrobeImportClientError } from '@/services/wardrobeImportService';
import type {
  ImportedProductCandidate,
  WardrobeImportResponse,
} from '@supabase/functions/_shared/wardrobe-import/types';
import { useAppTheme, type AppTheme } from '@/theme';
import { getGridColumnCount, getGridItemWidth } from '@/utils/layout';

import { EditImportedProductModal } from './EditImportedProductModal';
import { ImportErrorPanel } from './ImportErrorPanel';
import type { ImportSaveSummary } from './ImportCompleteStep';
import { ImportedProductCard } from './ImportedProductCard';

type Props = {
  error: WardrobeImportClientError | null;
  isSaving: boolean;
  onBack: () => void;
  onCancel: () => void;
  onError: (error: WardrobeImportClientError) => void;
  onSave: () => void;
  products: ImportPreviewItem[];
  response: WardrobeImportResponse;
  saveSummary: ImportSaveSummary | null;
  setProducts: Dispatch<SetStateAction<ImportPreviewItem[]>>;
};

export function ImportPreviewStep({
  error,
  isSaving,
  onBack,
  onCancel,
  onError,
  onSave,
  products,
  response,
  saveSummary,
  setProducts,
}: Props) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const { width } = useWindowDimensions();
  const [editingId, setEditingId] = useState<string | null>(null);
  const selectedCount = products.filter((product) => product.selected).length;
  const duplicateCount = products.filter((product) => product.duplicate).length;
  const incompleteCount = products.filter((product) => product.incomplete).length;
  const columns = getGridColumnCount(Math.min(width, 900));
  const itemWidth = getGridItemWidth(
    Math.min(width, 900),
    columns,
    theme.spacing.md,
    theme.spacing.md,
  );
  const editingProduct = products.find((product) => product.id === editingId)?.candidate ?? null;

  return (
    <AppScreen
      {...(isSaving ? {} : { onBack })}
      subtitle={`${response.sourceDomain} Â· ${response.pageType}`}
      title="Review imported products"
    >
      <View accessibilityLiveRegion="polite" style={styles.metrics}>
        <Metric label="Products found" value={products.length} />
        <Metric label="Selected" value={selectedCount} />
        <Metric label="Already saved" value={duplicateCount} />
        <Metric label="Need review" value={incompleteCount} />
      </View>
      {response.warnings.map((warning) => (
        <View key={warning} style={styles.warningNotice}>
          <Text style={styles.bodyText}>{warning}</Text>
        </View>
      ))}
      {saveSummary ? (
        <View style={styles.notice}>
          <Text style={styles.noticeTitle}>Latest save attempt</Text>
          <Text style={styles.bodyText}>
            {saveSummary.added} added Â· {saveSummary.duplicate} duplicate Â· {saveSummary.failed}{' '}
            failed
          </Text>
        </View>
      ) : null}
      {error ? <ImportErrorPanel error={error} onRetry={onSave} /> : null}
      <View style={styles.inlineActions}>
        <View style={styles.flexAction}>
          <ActionButton
            disabled={isSaving}
            label="Select all"
            onPress={() => setProducts((current) => setAllSelected(current, true))}
            variant="secondary"
          />
        </View>
        <View style={styles.flexAction}>
          <ActionButton
            disabled={isSaving}
            label="Deselect all"
            onPress={() => setProducts((current) => setAllSelected(current, false))}
            variant="secondary"
          />
        </View>
      </View>
      <View style={styles.grid}>
        {products.map((item) => (
          <ImportedProductCard
            item={item}
            disabled={isSaving}
            key={item.id}
            onEdit={() => setEditingId(item.id)}
            onOpenSource={() =>
              void Linking.openURL(item.candidate.productUrl).catch(() =>
                onError(
                  new WardrobeImportClientError(
                    'IMPORT_FAILED',
                    'The source link could not be opened on this device.',
                  ),
                ),
              )
            }
            onToggle={() => setProducts((current) => toggleImportSelection(current, item.id))}
            width={itemWidth}
          />
        ))}
      </View>
      <ActionButton
        disabled={selectedCount === 0}
        label={`Add selected to wardrobe (${selectedCount})`}
        loading={isSaving}
        onPress={onSave}
      />
      <ActionButton disabled={isSaving} label="Back" onPress={onBack} variant="secondary" />
      <ActionButton disabled={isSaving} label="Cancel" onPress={onCancel} variant="text" />
      <EditImportedProductModal
        candidate={editingProduct}
        onCancel={() => setEditingId(null)}
        onSave={(candidate: ImportedProductCandidate) => {
          if (editingId) {
            setProducts((current) => updateImportCandidate(current, editingId, candidate));
          }
          setEditingId(null);
        }}
      />
    </AppScreen>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  const theme = useAppTheme();
  return (
    <View style={{ gap: theme.spacing.xs, minWidth: 120 }}>
      <Text style={{ color: theme.colors.text, fontSize: theme.typography.fontSize.xl }}>
        {value}
      </Text>
      <Text style={{ color: theme.colors.textMuted, fontSize: theme.typography.fontSize.sm }}>
        {label}
      </Text>
    </View>
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
    warningNotice: {
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.warning,
      borderRadius: theme.radii.md,
      borderWidth: 1,
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
    metrics: {
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
      borderRadius: theme.radii.lg,
      borderWidth: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.lg,
      padding: theme.spacing.md,
    },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.md },
  });
}

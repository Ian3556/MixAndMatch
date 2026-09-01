import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { CatalogManagementAction } from '@supabase/functions/_shared/catalog/management-actions';

import { CatalogBrandProgressCard } from '@/catalog/components/CatalogBrandProgressCard';
import { CatalogImportControls } from '@/catalog/components/CatalogImportControls';
import { CatalogJobCard } from '@/catalog/components/CatalogJobCard';
import { CatalogMetricCard } from '@/catalog/components/CatalogMetricCard';
import { CatalogReviewCard } from '@/catalog/components/CatalogReviewCard';
import { CatalogReviewEditModal } from '@/catalog/components/CatalogReviewEditModal';
import { useCatalogAdminStore } from '@/catalog/store/catalogAdminStore';
import type { CatalogReviewItem } from '@/catalog/types';
import { ActionButton } from '@/components/ActionButton';
import { ErrorBanner } from '@/components/ErrorBanner';
import { AppScreen } from '@/components/ui/AppScreen';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/StateViews';
import { isCatalogDevToolsEnabled } from '@/constants/catalogDevTools';
import type { ProfileStackParamList } from '@/navigation/types';
import { useAppTheme, type AppTheme } from '@/theme';

type Props = NativeStackScreenProps<ProfileStackParamList, 'CatalogDevelopment'>;

export function CatalogDevelopmentScreen({ navigation }: Props) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const store = useCatalogAdminStore();
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<CatalogReviewItem | null>(null);
  const enabled = isCatalogDevToolsEnabled();

  useEffect(() => {
    if (enabled && store.status === 'idle') void store.refresh();
  }, [enabled, store]);

  if (!enabled) {
    return (
      <AppScreen onBack={navigation.goBack} title="Catalogue developer tools">
        <ErrorState
          message="This route is available only in a development build with the explicit catalogue tools flag."
          title="Developer tools disabled"
        />
      </AppScreen>
    );
  }

  const effectiveSelectedBrandId = selectedBrandId ?? store.data?.brands[0]?.brand_id ?? null;
  const selectedBrand =
    store.data?.brands.find((brand) => brand.brand_id === effectiveSelectedBrandId) ?? null;
  const runAction = (action: CatalogManagementAction) => void store.runAction(action);

  return (
    <AppScreen
      actions={
        <ActionButton
          disabled={store.status === 'loading'}
          label="Refresh"
          onPress={() => void store.refresh()}
          variant="text"
        />
      }
      eyebrow="Development only"
      onBack={navigation.goBack}
      subtitle="Observe imports, validate catalogue quality, and review source evidence."
      title="Catalogue operations"
    >
      <View style={styles.notice}>
        <Text style={styles.noticeTitle}>No automatic crawling</Text>
        <Text style={styles.noticeBody}>
          Jobs run only from explicit controls. Server-side source approval, URL allowlists, request
          bounds, checkpoints, and developer membership remain mandatory.
        </Text>
      </View>

      {store.actionError ? <ErrorBanner message={store.actionError} /> : null}
      {store.status === 'loading' && !store.data ? (
        <LoadingState
          message="Reading catalogue progress and review queues."
          title="Loading catalogue"
        />
      ) : null}
      {store.status === 'error' && !store.data ? (
        <ErrorState
          action={{ label: 'Retry', onPress: () => void store.refresh() }}
          message={store.error ?? 'The catalogue dashboard could not load.'}
          title="Catalogue unavailable"
        />
      ) : null}

      {store.data ? (
        <>
          <View style={styles.section}>
            <SectionHeader subtitle="Counts come from server-side catalogue RPCs" title="Overall" />
            <View style={styles.metrics}>
              <CatalogMetricCard label="Brands" value={store.data.overview.total_brands} />
              <CatalogMetricCard
                label="Enabled brands"
                value={store.data.overview.enabled_brands}
              />
              <CatalogMetricCard label="All products" value={store.data.overview.total_products} />
              <CatalogMetricCard label="Raw" value={store.data.overview.raw_products} />
              <CatalogMetricCard label="Validated" value={store.data.overview.validated_products} />
              <CatalogMetricCard
                label="Needs review"
                value={store.data.overview.needs_review_products}
              />
              <CatalogMetricCard label="Rejected" value={store.data.overview.rejected_products} />
              <CatalogMetricCard
                label="Failed imports"
                value={store.data.overview.failed_imports}
              />
              <CatalogMetricCard label="Duplicates" value={store.data.overview.duplicate_imports} />
            </View>
          </View>

          <CatalogImportControls
            brandName={selectedBrand?.brand_name ?? null}
            brandSlug={selectedBrand?.brand_slug ?? null}
            onAction={runAction}
            pending={store.actionPending}
          />

          <View style={styles.section}>
            <SectionHeader
              subtitle="Select a card to target import or maintenance controls"
              title="Brand progress and diversity"
            />
            <View style={styles.brandGrid}>
              {store.data.brands.map((brand) => (
                <CatalogBrandProgressCard
                  brand={brand}
                  key={brand.brand_id}
                  onSelect={() => setSelectedBrandId(brand.brand_id)}
                  selected={brand.brand_id === effectiveSelectedBrandId}
                />
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <SectionHeader title="Recent import jobs" />
            {store.data.recentJobs.length > 0 ? (
              store.data.recentJobs.map((job) => (
                <CatalogJobCard
                  job={job}
                  key={job.job_id}
                  onAction={runAction}
                  onViewErrors={() => void store.showErrorsForJob(job.job_id)}
                  pending={store.actionPending}
                />
              ))
            ) : (
              <EmptyState
                message="Start an approved Phase A import when a source is configured."
                title="No jobs yet"
              />
            )}
          </View>

          {store.data.importErrors.length > 0 ? (
            <View style={styles.section}>
              {store.selectedErrorJobId ? (
                <SectionHeader
                  actionLabel="Show all"
                  onAction={() => void store.showErrorsForJob(null)}
                  subtitle={`Filtered to job ${store.selectedErrorJobId}`}
                  title="Import errors"
                />
              ) : (
                <SectionHeader subtitle="Latest errors across jobs" title="Import errors" />
              )}
              {store.data.importErrors.map((error) => (
                <View key={error.error_id} style={styles.errorCard}>
                  <Text style={styles.errorType}>{error.error_type}</Text>
                  <Text style={styles.errorMessage}>{error.message}</Text>
                  <Text style={styles.errorMeta}>
                    {error.retryable ? 'Retryable' : 'Terminal'} ·{' '}
                    {new Date(error.created_at).toLocaleString()}
                  </Text>
                </View>
              ))}
            </View>
          ) : null}

          <View style={styles.section}>
            <SectionHeader
              subtitle="Only products requiring a human decision appear here"
              title="Product review queue"
            />
            {store.data.reviewQueue.length > 0 ? (
              store.data.reviewQueue.map((item) => (
                <CatalogReviewCard
                  item={item}
                  key={item.product_id}
                  onAction={runAction}
                  onEdit={() => setEditingItem(item)}
                  pending={store.actionPending}
                />
              ))
            ) : (
              <EmptyState
                message="Low-confidence products will appear after an import or maintenance job."
                title="Review queue empty"
              />
            )}
          </View>
        </>
      ) : null}

      <CatalogReviewEditModal
        item={editingItem}
        key={editingItem?.product_id ?? 'catalog-review-editor'}
        onDismiss={() => setEditingItem(null)}
        onSave={(patch) =>
          editingItem
            ? store.runAction({ action: 'edit_product', productId: editingItem.product_id, patch })
            : Promise.resolve(false)
        }
        pending={store.actionPending}
        visible={editingItem !== null}
      />
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
    noticeBody: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSize.sm,
      lineHeight: theme.typography.lineHeight.sm,
    },
    section: { gap: theme.spacing.md },
    metrics: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
    brandGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.md },
    errorCard: {
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.danger,
      borderRadius: theme.radii.md,
      borderWidth: 1,
      gap: theme.spacing.xs,
      padding: theme.spacing.md,
    },
    errorType: { color: theme.colors.danger, fontWeight: theme.typography.fontWeight.semibold },
    errorMessage: { color: theme.colors.text },
    errorMeta: { color: theme.colors.textMuted, fontSize: theme.typography.fontSize.xs },
  });
}

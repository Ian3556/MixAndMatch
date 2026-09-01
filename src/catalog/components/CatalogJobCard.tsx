import { StyleSheet, Text, View } from 'react-native';

import type { CatalogManagementAction } from '@supabase/functions/_shared/catalog/management-actions';

import type { CatalogRecentJob } from '@/catalog/types';
import { ActionButton } from '@/components/ActionButton';
import { useAppTheme, type AppTheme } from '@/theme';

type Props = {
  job: CatalogRecentJob;
  pending: boolean;
  onAction: (action: CatalogManagementAction) => void;
  onViewErrors: () => void;
};

export function CatalogJobCard({ job, pending, onAction, onViewErrors }: Props) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const terminal = ['completed', 'completed_with_errors', 'failed', 'stopped'].includes(job.status);
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.copy}>
          <Text style={styles.title}>{job.brand_name}</Text>
          <Text style={styles.meta}>
            {job.operation} · {job.status.replaceAll('_', ' ')}
          </Text>
        </View>
        <Text style={styles.count}>Imported {job.imported_count}</Text>
      </View>
      <Text style={styles.summary}>
        Requested checkpoints {job.requested_count} · Discovered {job.discovered_count} · Validated{' '}
        {job.validated_count} · Rejected {job.rejected_count} · Duplicates {job.duplicate_count} ·
        Failed {job.failed_count}
      </Text>
      {job.error_summary ? <Text style={styles.error}>{job.error_summary}</Text> : null}
      <View style={styles.actions}>
        {!terminal ? (
          <ActionButton
            disabled={pending}
            label="Continue"
            onPress={() => onAction({ action: 'continue_import', jobId: job.job_id })}
            variant="secondary"
          />
        ) : null}
        {job.failed_count > 0 || job.rejected_count > 0 ? (
          <ActionButton
            disabled={pending}
            label="Retry failed"
            onPress={() => onAction({ action: 'retry_failed', jobId: job.job_id })}
            variant="secondary"
          />
        ) : null}
        {!terminal ? (
          <>
            <ActionButton
              disabled={pending}
              label="Pause"
              onPress={() => onAction({ action: 'pause', jobId: job.job_id })}
              variant="text"
            />
            <ActionButton
              disabled={pending}
              label="Stop"
              onPress={() => onAction({ action: 'stop', jobId: job.job_id })}
              variant="text"
            />
          </>
        ) : null}
        {job.failed_count > 0 ? (
          <ActionButton
            disabled={pending}
            label="View errors"
            onPress={onViewErrors}
            variant="text"
          />
        ) : null}
      </View>
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    card: {
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
      borderRadius: theme.radii.md,
      borderWidth: 1,
      gap: theme.spacing.sm,
      padding: theme.spacing.md,
    },
    header: { alignItems: 'flex-start', flexDirection: 'row', gap: theme.spacing.md },
    copy: { flex: 1 },
    title: { color: theme.colors.text, fontWeight: theme.typography.fontWeight.bold },
    meta: { color: theme.colors.textMuted, fontSize: theme.typography.fontSize.sm },
    count: { color: theme.colors.primary, fontWeight: theme.typography.fontWeight.semibold },
    summary: { color: theme.colors.textMuted, fontSize: theme.typography.fontSize.sm },
    error: { color: theme.colors.danger, fontSize: theme.typography.fontSize.sm },
    actions: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.xs },
  });
}

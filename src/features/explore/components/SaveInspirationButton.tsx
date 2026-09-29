import { Text, View } from 'react-native';
import { ActionButton } from '@/components/ActionButton';
import { useAppTheme } from '@/theme';
import { useSavedInspirations } from '../hooks/useSavedInspirations';

export function SaveInspirationButton({
  inspirationId,
  title,
}: {
  inspirationId: string;
  title: string;
}) {
  const saved = useSavedInspirations();
  const theme = useAppTheme();
  const isSaved = saved.items.some((item) => item.inspirationId === inspirationId);
  const error = saved.error ?? saved.actionErrors[inspirationId];
  const pending = saved.pendingIds.includes(inspirationId);
  return (
    <View style={{ gap: theme.spacing.sm }}>
      <ActionButton
        accessibilityLabel={`${isSaved ? 'Remove saved inspiration' : 'Save inspiration'}: ${title}`}
        accessibilityState={{
          disabled: saved.status !== 'ready' || pending,
          busy: pending,
          selected: isSaved,
        }}
        disabled={saved.status !== 'ready'}
        label={isSaved ? 'Saved · Remove' : 'Save inspiration'}
        loading={pending}
        onPress={() => saved.toggle(inspirationId)}
        square
        variant="secondary"
      />
      {saved.status === 'loading' ? (
        <Text style={{ color: theme.colors.textMuted }}>Loading saved status…</Text>
      ) : null}
      {error ? (
        <>
          <Text accessibilityLiveRegion="polite" style={{ color: theme.colors.danger }}>
            {error}
          </Text>
          <ActionButton
            label={saved.status === 'error' ? 'Retry loading saved status' : 'Retry save'}
            onPress={saved.status === 'error' ? saved.retry : () => saved.toggle(inspirationId)}
            square
            variant="text"
          />
        </>
      ) : null}
    </View>
  );
}

import { StyleSheet, Text, View } from 'react-native';

import { ActionButton } from '@/components/ActionButton';
import { AppScreen } from '@/components/ui/AppScreen';
import { useAppTheme, type AppTheme } from '@/theme';

export type ImportSaveSummary = { added: number; duplicate: number; failed: number };

type Props = {
  onImportAnother: () => void;
  onReturn: () => void;
  summary: ImportSaveSummary;
};

export function ImportCompleteStep({ onImportAnother, onReturn, summary }: Props) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  return (
    <AppScreen title="Import complete">
      <View accessibilityLiveRegion="polite" style={styles.completion}>
        <Text accessibilityRole="header" style={styles.title}>
          {summary.added} item{summary.added === 1 ? '' : 's'} added to your wardrobe.
        </Text>
        {summary.duplicate > 0 ? (
          <Text style={styles.body}>
            {summary.duplicate} item{summary.duplicate === 1 ? ' was' : 's were'} skipped because{' '}
            {summary.duplicate === 1 ? 'it is' : 'they are'} already saved.
          </Text>
        ) : null}
      </View>
      <ActionButton label="Return to wardrobe" onPress={onReturn} />
      <ActionButton label="Import another website" onPress={onImportAnother} variant="secondary" />
    </AppScreen>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    completion: {
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.success,
      borderRadius: theme.radii.xl,
      borderWidth: 1,
      gap: theme.spacing.sm,
      padding: theme.spacing.xl,
    },
    title: {
      color: theme.colors.success,
      fontSize: theme.typography.fontSize.xl,
      fontWeight: theme.typography.fontWeight.bold,
      textAlign: 'center',
    },
    body: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSize.sm,
      lineHeight: theme.typography.lineHeight.sm,
      textAlign: 'center',
    },
  });
}

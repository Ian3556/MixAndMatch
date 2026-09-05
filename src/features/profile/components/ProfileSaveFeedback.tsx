import { StyleSheet, Text, View } from 'react-native';

import { ErrorBanner } from '@/components/ErrorBanner';
import { useAppTheme, type AppTheme } from '@/theme';

export function ProfileSaveFeedback({
  error,
  isSaved,
}: {
  error: string | null;
  isSaved: boolean;
}) {
  const styles = createStyles(useAppTheme());
  return (
    <>
      {error ? <ErrorBanner message={error} /> : null}
      {isSaved ? (
        <View accessibilityLiveRegion="polite" style={styles.success}>
          <Text style={styles.successText}>Saved.</Text>
        </View>
      ) : null}
    </>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    success: {
      borderColor: theme.colors.success,
      borderWidth: 1,
      padding: theme.spacing.md,
    },
    successText: { color: theme.colors.success },
  });
}

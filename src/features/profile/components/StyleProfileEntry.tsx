import { StyleSheet, Text, View } from 'react-native';

import { useAppTheme, type AppTheme } from '@/theme';

import { ProfileDirectoryRow } from './ProfileSettingsDirectory';

export function StyleProfileEntry({ onPress }: { onPress: () => void }) {
  const styles = createStyles(useAppTheme());
  return (
    <View style={styles.section}>
      <Text accessibilityRole="header" style={styles.heading}>
        STYLE PROFILE
      </Text>
      <ProfileDirectoryRow label="Style Profile" onPress={onPress} />
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    section: { gap: theme.spacing.lg },
    heading: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.md,
      fontWeight: theme.typography.fontWeight.semibold,
      letterSpacing: 1.4,
      lineHeight: theme.typography.lineHeight.md,
    },
  });
}

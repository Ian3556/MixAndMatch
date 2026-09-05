import Ionicons from '@expo/vector-icons/Ionicons';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

import { useAppTheme, type AppTheme } from '@/theme';

export function SignOutRow({
  isSigningOut,
  onPress,
}: {
  isSigningOut: boolean;
  onPress: () => void;
}) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  return (
    <Pressable
      accessibilityLabel="Sign out"
      accessibilityRole="button"
      accessibilityState={{ busy: isSigningOut, disabled: isSigningOut }}
      disabled={isSigningOut}
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed ? styles.pressed : null]}
    >
      {isSigningOut ? (
        <ActivityIndicator color={theme.colors.danger} size="small" />
      ) : (
        <Ionicons color={theme.colors.danger} name="log-out-outline" size={19} />
      )}
      <Text style={styles.label}>{isSigningOut ? 'Signing out…' : 'Sign Out'}</Text>
    </Pressable>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    row: {
      alignItems: 'center',
      borderTopColor: theme.colors.border,
      borderTopWidth: StyleSheet.hairlineWidth,
      flexDirection: 'row',
      gap: theme.spacing.md,
      minHeight: 58,
      paddingBottom: theme.spacing.xl,
      paddingTop: theme.spacing.lg,
    },
    label: {
      color: theme.colors.danger,
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.md,
      fontWeight: theme.typography.fontWeight.medium,
    },
    pressed: { opacity: 0.58 },
  });
}

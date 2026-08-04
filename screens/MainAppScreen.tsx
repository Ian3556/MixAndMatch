import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ActionButton } from '@/components/ActionButton';
import { ErrorBanner } from '@/components/ErrorBanner';
import { ScreenContainer } from '@/components/ScreenContainer';
import { useAuthStore } from '@/store/authStore';
import { useAppTheme, type AppTheme } from '@/theme';

export function MainAppScreen() {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const profile = useAuthStore((state) => state.profile);
  const signOut = useAuthStore((state) => state.signOut);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState<string | null>(null);

  const handleSignOut = async () => {
    if (isSigningOut) return;
    setIsSigningOut(true);
    setSignOutError(null);
    const result = await signOut();

    if (!result.ok) {
      setSignOutError(result.error.message);
    }

    setIsSigningOut(false);
  };

  return (
    <ScreenContainer
      description="Your identity, session, and profile foundation are ready. Wardrobe features begin in a later phase."
      title={`Welcome${profile?.displayName ? `, ${profile.displayName}` : ''}`}
    >
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Phase 1 complete state</Text>
        <Text style={styles.cardBody}>
          You are signed in, your email is verified, and profile onboarding is complete.
        </Text>
      </View>
      {signOutError ? <ErrorBanner message={signOutError} /> : null}
      <ActionButton
        label="Sign out"
        loading={isSigningOut}
        onPress={() => void handleSignOut()}
        variant="secondary"
      />
    </ScreenContainer>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    card: {
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
      borderRadius: theme.radii.lg,
      borderWidth: 1,
      gap: theme.spacing.sm,
      padding: theme.spacing.lg,
    },
    cardTitle: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.md,
      fontWeight: theme.typography.fontWeight.semibold,
      lineHeight: theme.typography.lineHeight.md,
    },
    cardBody: {
      color: theme.colors.textMuted,
      fontFamily: theme.typography.fontFamily.regular,
      fontSize: theme.typography.fontSize.sm,
      lineHeight: theme.typography.lineHeight.sm,
    },
  });
}

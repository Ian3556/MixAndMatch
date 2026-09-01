import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ActionButton } from '@/components/ActionButton';
import { ErrorBanner } from '@/components/ErrorBanner';
import { ScreenContainer } from '@/components/ScreenContainer';
import { useAuthStore } from '@/store/authStore';
import { useAppTheme, type AppTheme } from '@/theme';

const RESEND_COOLDOWN_SECONDS = 60;

export function EmailVerificationScreen() {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const session = useAuthStore((state) => state.session);
  const user = useAuthStore((state) => state.user);
  const pendingEmail = useAuthStore((state) => state.pendingVerificationEmail);
  const authError = useAuthStore((state) => state.authError);
  const resendVerification = useAuthStore((state) => state.resendVerification);
  const checkEmailVerification = useAuthStore((state) => state.checkEmailVerification);
  const returnToSignIn = useAuthStore((state) => state.returnToSignIn);
  const [cooldown, setCooldown] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [resendSucceeded, setResendSucceeded] = useState(false);
  const email = user?.email ?? pendingEmail;

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((value) => Math.max(0, value - 1)), 1_000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleResend = async () => {
    if (isResending || cooldown > 0) return;
    setIsResending(true);
    setResendSucceeded(false);
    const result = await resendVerification();
    setIsResending(false);

    if (result.ok) {
      setResendSucceeded(true);
      setCooldown(RESEND_COOLDOWN_SECONDS);
    }
  };

  const handleCheck = async () => {
    if (isChecking) return;
    setIsChecking(true);
    await checkEmailVerification();
    setIsChecking(false);
  };

  return (
    <ScreenContainer
      description="Open the message from Mix & Match and follow its secure confirmation link."
      title="Verify your email"
    >
      <View style={styles.emailCard}>
        <Text style={styles.emailLabel}>Verification email</Text>
        <Text style={styles.emailValue}>{email ?? 'Your account email'}</Text>
      </View>
      <Text style={styles.helpText}>
        Email confirmation depends on your Supabase project settings. The app will continue
        automatically when a valid confirmation link returns here.
      </Text>
      {resendSucceeded ? (
        <Text accessibilityLiveRegion="polite" style={styles.successText}>
          A new verification request was sent.
        </Text>
      ) : null}
      {authError ? <ErrorBanner message={authError.message} /> : null}
      <ActionButton
        disabled={!email || cooldown > 0}
        label={cooldown > 0 ? `Resend available in ${cooldown}s` : 'Resend verification email'}
        loading={isResending}
        onPress={() => void handleResend()}
        variant="secondary"
      />
      {session ? (
        <ActionButton
          label="Check verification status"
          loading={isChecking}
          onPress={() => void handleCheck()}
        />
      ) : null}
      <ActionButton
        label={session ? 'Sign out' : 'Return to sign in'}
        onPress={() => void returnToSignIn()}
        variant="text"
      />
    </ScreenContainer>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    emailCard: {
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
      borderRadius: theme.radii.md,
      borderWidth: 1,
      gap: theme.spacing.xs,
      padding: theme.spacing.md,
    },
    emailLabel: {
      color: theme.colors.textMuted,
      fontFamily: theme.typography.fontFamily.regular,
      fontSize: theme.typography.fontSize.xs,
      lineHeight: theme.typography.lineHeight.xs,
    },
    emailValue: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.md,
      fontWeight: theme.typography.fontWeight.semibold,
      lineHeight: theme.typography.lineHeight.md,
    },
    helpText: {
      color: theme.colors.textMuted,
      fontFamily: theme.typography.fontFamily.regular,
      fontSize: theme.typography.fontSize.sm,
      lineHeight: theme.typography.lineHeight.sm,
    },
    successText: {
      color: theme.colors.success,
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.semibold,
      lineHeight: theme.typography.lineHeight.sm,
    },
  });
}

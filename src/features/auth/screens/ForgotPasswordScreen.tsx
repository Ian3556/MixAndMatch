import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ActionButton } from '@/components/ActionButton';
import { ErrorBanner } from '@/components/ErrorBanner';
import { FormTextInput } from '@/components/FormTextInput';
import { ScreenContainer } from '@/components/ScreenContainer';
import { AUTH_ROUTES } from '@/navigation/routes';
import type { AuthStackParamList } from '@/navigation/types';
import { useAuthStore } from '@/store/authStore';
import { useAppTheme, type AppTheme } from '@/theme';
import { normalizeEmail, validateEmail } from '@/utils/validation/authValidation';

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

export function ForgotPasswordScreen({ navigation }: Props) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const requestPasswordReset = useAuthStore((state) => state.requestPasswordReset);
  const cancelPasswordRecovery = useAuthStore((state) => state.cancelPasswordRecovery);
  const isRecoveryFlow = useAuthStore((state) => state.recoveryState.status !== 'idle');
  const authError = useAuthStore((state) => state.authError);
  const clearAuthError = useAuthStore((state) => state.clearAuthError);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const returnToSignIn = () => {
    if (isRecoveryFlow) {
      void cancelPasswordRecovery();
    } else {
      navigation.navigate(AUTH_ROUTES.SIGN_IN);
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    const validationError = validateEmail(email);
    setEmailError(validationError);
    if (validationError) return;

    clearAuthError();
    setIsSubmitting(true);
    const result = await requestPasswordReset(normalizeEmail(email));
    setIsSubmitting(false);

    if (result.ok) {
      setIsSent(true);
    }
  };

  if (isSent) {
    return (
      <ScreenContainer
        description="If an account can receive a reset email, instructions will arrive shortly. Check spam or junk folders too."
        title="Check your email"
      >
        <View accessibilityLiveRegion="polite" style={styles.successCard}>
          <Text style={styles.successTitle}>Request received</Text>
          <Text style={styles.successBody}>
            For privacy, this response is the same whether or not an account exists.
          </Text>
        </View>
        <ActionButton label="Return to sign in" onPress={returnToSignIn} variant="secondary" />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer
      description="Enter your account email and we’ll send a secure password-recovery link."
      footer={<ActionButton label="Return to sign in" onPress={returnToSignIn} variant="text" />}
      title="Reset your password"
    >
      {authError ? <ErrorBanner message={authError.message} /> : null}
      <FormTextInput
        autoCapitalize="none"
        autoComplete="email"
        autoCorrect={false}
        error={emailError ?? undefined}
        keyboardType="email-address"
        label="Email"
        onChangeText={(value) => {
          setEmail(value);
          setEmailError(null);
        }}
        onSubmitEditing={() => void handleSubmit()}
        placeholder="you@example.com"
        returnKeyType="send"
        textContentType="emailAddress"
        value={email}
      />
      <ActionButton
        label="Send recovery email"
        loading={isSubmitting}
        onPress={() => void handleSubmit()}
      />
    </ScreenContainer>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    successCard: {
      backgroundColor: theme.isDark ? '#143426' : '#ECF8F1',
      borderColor: theme.colors.success,
      borderRadius: theme.radii.md,
      borderWidth: 1,
      gap: theme.spacing.xs,
      padding: theme.spacing.md,
    },
    successTitle: {
      color: theme.colors.success,
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.semibold,
      lineHeight: theme.typography.lineHeight.sm,
    },
    successBody: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.regular,
      fontSize: theme.typography.fontSize.sm,
      lineHeight: theme.typography.lineHeight.sm,
    },
  });
}

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { ActionButton } from '@/components/ActionButton';
import { ErrorBanner } from '@/components/ErrorBanner';
import { FormTextInput } from '@/components/FormTextInput';
import { ScreenContainer } from '@/components/ScreenContainer';
import { AUTH_ROUTES } from '@/navigation/routes';
import type { AuthStackParamList } from '@/navigation/types';
import { InitializationScreen } from '@/screens/InitializationScreen';
import { useAuthStore } from '@/store/authStore';
import { useAppTheme, type AppTheme } from '@/theme';
import type { FieldErrors } from '@/utils/validation/authValidation';
import { validatePassword, validatePasswordConfirmation } from '@/utils/validation/authValidation';

type Props = NativeStackScreenProps<AuthStackParamList, 'ResetPassword'>;
type ResetField = 'password' | 'confirmation';

export function ResetPasswordScreen({ navigation }: Props) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const recoveryState = useAuthStore((state) => state.recoveryState);
  const authError = useAuthStore((state) => state.authError);
  const updatePassword = useAuthStore((state) => state.updatePassword);
  const finishPasswordRecovery = useAuthStore((state) => state.finishPasswordRecovery);
  const cancelPasswordRecovery = useAuthStore((state) => state.cancelPasswordRecovery);
  const clearAuthError = useAuthStore((state) => state.clearAuthError);
  const confirmationRef = useRef<TextInput>(null);
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [errors, setErrors] = useState<FieldErrors<ResetField>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);

  const handleSubmit = async () => {
    if (isSubmitting) return;
    const nextErrors: FieldErrors<ResetField> = {};
    const passwordError = validatePassword(password);
    const confirmationError = validatePasswordConfirmation(password, confirmation);
    if (passwordError) nextErrors.password = passwordError;
    if (confirmationError) nextErrors.confirmation = confirmationError;
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    clearAuthError();
    setIsSubmitting(true);
    const result = await updatePassword(password);
    setIsSubmitting(false);

    if (result.ok) {
      setIsUpdated(true);
    }
  };

  if (recoveryState.status === 'processing') {
    return <InitializationScreen />;
  }

  if (recoveryState.status === 'error') {
    return (
      <ScreenContainer
        description="Recovery links are single-use and expire. Request a fresh email to try again safely."
        title="Recovery link unavailable"
      >
        <ErrorBanner message={recoveryState.error.message} />
        <ActionButton
          label="Request a new recovery email"
          onPress={() => navigation.navigate(AUTH_ROUTES.FORGOT_PASSWORD)}
        />
        <ActionButton
          label="Return to sign in"
          onPress={() => void cancelPasswordRecovery()}
          variant="secondary"
        />
      </ScreenContainer>
    );
  }

  if (isUpdated) {
    return (
      <ScreenContainer
        description="Your password has been updated. Continue to your account using the secure recovery session."
        title="Password updated"
      >
        <View accessibilityLiveRegion="polite" style={styles.successCard}>
          <Text style={styles.successTitle}>Update complete</Text>
          <Text style={styles.successBody}>Use your new password the next time you sign in.</Text>
        </View>
        <ActionButton label="Continue" onPress={() => void finishPasswordRecovery()} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer
      description="Choose a new password for your account. This recovery session is valid only for this update."
      title="Create a new password"
    >
      {authError ? <ErrorBanner message={authError.message} /> : null}
      <FormTextInput
        autoCapitalize="none"
        autoComplete="new-password"
        blurOnSubmit={false}
        error={errors.password}
        label="New password"
        onChangeText={(value) => {
          setPassword(value);
          setErrors((current) => omitField(current, 'password'));
        }}
        onSubmitEditing={() => confirmationRef.current?.focus()}
        placeholder="At least 8 characters"
        returnKeyType="next"
        secureTextEntry
        textContentType="newPassword"
        value={password}
      />
      <FormTextInput
        ref={confirmationRef}
        autoCapitalize="none"
        autoComplete="new-password"
        error={errors.confirmation}
        label="Confirm new password"
        onChangeText={(value) => {
          setConfirmation(value);
          setErrors((current) => omitField(current, 'confirmation'));
        }}
        onSubmitEditing={() => void handleSubmit()}
        placeholder="Repeat your new password"
        returnKeyType="done"
        secureTextEntry
        textContentType="newPassword"
        value={confirmation}
      />
      <ActionButton
        label="Update password"
        loading={isSubmitting}
        onPress={() => void handleSubmit()}
      />
    </ScreenContainer>
  );
}

function omitField(errors: FieldErrors<ResetField>, field: ResetField): FieldErrors<ResetField> {
  const nextErrors = { ...errors };
  delete nextErrors[field];
  return nextErrors;
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

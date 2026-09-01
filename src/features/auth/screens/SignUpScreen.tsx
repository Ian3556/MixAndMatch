import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useRef, useState } from 'react';
import { TextInput } from 'react-native';

import { ActionButton } from '@/components/ActionButton';
import { ErrorBanner } from '@/components/ErrorBanner';
import { FormTextInput } from '@/components/FormTextInput';
import { ScreenContainer } from '@/components/ScreenContainer';
import { AUTH_ROUTES } from '@/navigation/routes';
import type { AuthStackParamList } from '@/navigation/types';
import { useAuthStore } from '@/store/authStore';
import type { FieldErrors } from '@/utils/validation/authValidation';
import {
  normalizeEmail,
  validateEmail,
  validatePassword,
  validatePasswordConfirmation,
} from '@/utils/validation/authValidation';

type Props = NativeStackScreenProps<AuthStackParamList, 'SignUp'>;
type SignUpField = 'email' | 'password' | 'confirmation';

export function SignUpScreen({ navigation }: Props) {
  const signUp = useAuthStore((state) => state.signUp);
  const authError = useAuthStore((state) => state.authError);
  const clearAuthError = useAuthStore((state) => state.clearAuthError);
  const passwordRef = useRef<TextInput>(null);
  const confirmationRef = useRef<TextInput>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [errors, setErrors] = useState<FieldErrors<SignUpField>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (isSubmitting) return;

    const nextErrors: FieldErrors<SignUpField> = {};
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const confirmationError = validatePasswordConfirmation(password, confirmation);

    if (emailError) nextErrors.email = emailError;
    if (passwordError) nextErrors.password = passwordError;
    if (confirmationError) nextErrors.confirmation = confirmationError;

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    clearAuthError();
    setIsSubmitting(true);
    await signUp(normalizeEmail(email), password);
    setIsSubmitting(false);
  };

  return (
    <ScreenContainer
      description="Use email and password. We’ll ask for only the profile information required to start."
      footer={
        <ActionButton
          label="Already have an account? Sign in"
          onPress={() => navigation.navigate(AUTH_ROUTES.SIGN_IN)}
          variant="text"
        />
      }
      title="Create your account"
    >
      {authError ? <ErrorBanner message={authError.message} /> : null}
      <FormTextInput
        autoCapitalize="none"
        autoComplete="email"
        autoCorrect={false}
        blurOnSubmit={false}
        error={errors.email}
        keyboardType="email-address"
        label="Email"
        onChangeText={(value) => {
          setEmail(value);
          setErrors((current) => omitField(current, 'email'));
        }}
        onSubmitEditing={() => passwordRef.current?.focus()}
        placeholder="you@example.com"
        returnKeyType="next"
        textContentType="emailAddress"
        value={email}
      />
      <FormTextInput
        ref={passwordRef}
        autoCapitalize="none"
        autoComplete="new-password"
        blurOnSubmit={false}
        error={errors.password}
        label="Password"
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
        label="Confirm password"
        onChangeText={(value) => {
          setConfirmation(value);
          setErrors((current) => omitField(current, 'confirmation'));
        }}
        onSubmitEditing={() => void handleSubmit()}
        placeholder="Repeat your password"
        returnKeyType="done"
        secureTextEntry
        textContentType="newPassword"
        value={confirmation}
      />
      <ActionButton
        label="Create Account"
        loading={isSubmitting}
        onPress={() => void handleSubmit()}
      />
    </ScreenContainer>
  );
}

function omitField(errors: FieldErrors<SignUpField>, field: SignUpField): FieldErrors<SignUpField> {
  const nextErrors = { ...errors };
  delete nextErrors[field];
  return nextErrors;
}

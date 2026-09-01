import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useRef, useState } from 'react';
import { TextInput } from 'react-native';

import { ActionButton } from '@/components/ActionButton';
import { ErrorBanner } from '@/components/ErrorBanner';
import { FormTextInput } from '@/components/FormTextInput';
import { ScreenContainer } from '@/components/ScreenContainer';
import { getDevelopmentQuickLoginCredentials } from '@/constants/developmentQuickLogin';
import { AUTH_ROUTES } from '@/navigation/routes';
import type { AuthStackParamList } from '@/navigation/types';
import { useAuthStore } from '@/store/authStore';
import type { FieldErrors } from '@/utils/validation/authValidation';
import { normalizeEmail, validateEmail } from '@/utils/validation/authValidation';

import { DevelopmentQuickLogin } from '../components/DevelopmentQuickLogin';

type Props = NativeStackScreenProps<AuthStackParamList, 'SignIn'>;
type SignInField = 'email' | 'password';
type SubmitSource = 'form' | 'quickLogin';

export function SignInScreen({ navigation }: Props) {
  const signIn = useAuthStore((state) => state.signIn);
  const authError = useAuthStore((state) => state.authError);
  const clearAuthError = useAuthStore((state) => state.clearAuthError);
  const passwordRef = useRef<TextInput>(null);
  const isSubmittingRef = useRef(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FieldErrors<SignInField>>({});
  const [submitSource, setSubmitSource] = useState<SubmitSource | null>(null);
  const quickLoginCredentials = getDevelopmentQuickLoginCredentials();
  const isSubmitting = submitSource !== null;

  const submitCredentials = async (
    credentials: { email: string; password: string },
    source: SubmitSource,
  ) => {
    if (isSubmittingRef.current) return;

    isSubmittingRef.current = true;
    clearAuthError();
    setSubmitSource(source);
    try {
      await signIn(normalizeEmail(credentials.email), credentials.password);
    } finally {
      isSubmittingRef.current = false;
      setSubmitSource(null);
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    const nextErrors: FieldErrors<SignInField> = {};
    const emailError = validateEmail(email);
    if (emailError) nextErrors.email = emailError;
    if (!password) nextErrors.password = 'Password is required.';

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    await submitCredentials({ email, password }, 'form');
  };

  const handleQuickLogin = async () => {
    if (!quickLoginCredentials || isSubmitting) return;
    setErrors({});
    await submitCredentials(quickLoginCredentials, 'quickLogin');
  };

  return (
    <ScreenContainer
      description="Sign in to restore your private profile and continue where you left off."
      footer={
        <ActionButton
          label="Need an account? Create one"
          onPress={() => navigation.navigate(AUTH_ROUTES.SIGN_UP)}
          variant="text"
        />
      }
      title="Welcome back"
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
        autoComplete="current-password"
        error={errors.password}
        label="Password"
        onChangeText={(value) => {
          setPassword(value);
          setErrors((current) => omitField(current, 'password'));
        }}
        onSubmitEditing={() => void handleSubmit()}
        placeholder="Your password"
        returnKeyType="done"
        secureTextEntry
        textContentType="password"
        value={password}
      />
      <ActionButton
        label="Forgot Password?"
        onPress={() => navigation.navigate(AUTH_ROUTES.FORGOT_PASSWORD)}
        variant="text"
      />
      <ActionButton
        disabled={isSubmitting}
        label="Sign In"
        loading={submitSource === 'form'}
        onPress={() => void handleSubmit()}
      />
      <DevelopmentQuickLogin
        configured={quickLoginCredentials !== null}
        disabled={isSubmitting}
        loading={submitSource === 'quickLogin'}
        onPress={() => void handleQuickLogin()}
      />
    </ScreenContainer>
  );
}

function omitField(errors: FieldErrors<SignInField>, field: SignInField): FieldErrors<SignInField> {
  const nextErrors = { ...errors };
  delete nextErrors[field];
  return nextErrors;
}

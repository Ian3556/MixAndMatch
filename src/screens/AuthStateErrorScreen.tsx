import { ActionButton } from '@/components/ActionButton';
import { ErrorBanner } from '@/components/ErrorBanner';
import { ScreenContainer } from '@/components/ScreenContainer';
import { useAuthStore } from '@/store/authStore';

export function AuthStateErrorScreen() {
  const error = useAuthStore((state) => state.authError);
  const retryAuthState = useAuthStore((state) => state.retryAuthState);
  const returnToSignIn = useAuthStore((state) => state.returnToSignIn);
  const isConfigurationError = error?.domain === 'configuration';

  return (
    <ScreenContainer
      description="The app protected your account data and stopped before showing the wrong navigation state."
      title={isConfigurationError ? 'Configuration required' : 'We could not restore your account'}
    >
      <ErrorBanner message={error?.message ?? 'Authentication state is unavailable.'} />
      <ActionButton label="Try again" onPress={() => void retryAuthState()} />
      {!isConfigurationError ? (
        <ActionButton
          label="Return to sign in"
          onPress={() => void returnToSignIn()}
          variant="secondary"
        />
      ) : null}
    </ScreenContainer>
  );
}

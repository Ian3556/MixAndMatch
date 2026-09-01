import { useState } from 'react';

import { ActionButton } from '@/components/ActionButton';
import { ErrorBanner } from '@/components/ErrorBanner';
import { FormTextInput } from '@/components/FormTextInput';
import { ScreenContainer } from '@/components/ScreenContainer';
import { useAuthStore } from '@/store/authStore';
import { normalizeDisplayName, validateDisplayName } from '@/utils/validation/authValidation';

export function ProfileSetupScreen() {
  const profile = useAuthStore((state) => state.profile);
  const authError = useAuthStore((state) => state.authError);
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const signOut = useAuthStore((state) => state.signOut);
  const clearAuthError = useAuthStore((state) => state.clearAuthError);
  const [displayName, setDisplayName] = useState(profile?.displayName ?? '');
  const [displayNameError, setDisplayNameError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (isSubmitting) return;
    const validationError = validateDisplayName(displayName);
    setDisplayNameError(validationError);
    if (validationError) return;

    clearAuthError();
    setIsSubmitting(true);
    await updateProfile({ displayName: normalizeDisplayName(displayName) });
    setIsSubmitting(false);
  };

  return (
    <ScreenContainer
      description="Choose the name shown inside your private Mix & Match account. You can change it later."
      title="Set up your profile"
    >
      {authError ? <ErrorBanner message={authError.message} /> : null}
      <FormTextInput
        autoCapitalize="words"
        autoComplete="name"
        error={displayNameError ?? undefined}
        label="Display name"
        maxLength={50}
        onChangeText={(value) => {
          setDisplayName(value);
          setDisplayNameError(null);
        }}
        onSubmitEditing={() => void handleSubmit()}
        placeholder="How should we address you?"
        returnKeyType="done"
        textContentType="name"
        value={displayName}
      />
      <ActionButton
        label="Complete profile"
        loading={isSubmitting}
        onPress={() => void handleSubmit()}
      />
      <ActionButton label="Sign out" onPress={() => void signOut()} variant="text" />
    </ScreenContainer>
  );
}

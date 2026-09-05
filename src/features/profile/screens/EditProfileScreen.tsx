import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { View } from 'react-native';

import { ActionButton } from '@/components/ActionButton';
import { FormTextInput } from '@/components/FormTextInput';
import { AppScreen } from '@/components/ui/AppScreen';
import { Avatar } from '@/components/ui/ProfilePrimitives';
import { ProfileSaveFeedback } from '@/features/profile/components/ProfileSaveFeedback';
import type { ProfileStackParamList } from '@/navigation/types';
import { useAuthStore } from '@/store/authStore';
import { normalizeDisplayName, validateDisplayName } from '@/utils/validation/authValidation';

type Props = NativeStackScreenProps<ProfileStackParamList, 'EditProfile'>;

export function EditProfileScreen({ navigation }: Props) {
  const profile = useAuthStore((state) => state.profile);
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const [displayName, setDisplayName] = useState(profile?.displayName ?? '');
  const [displayNameError, setDisplayNameError] = useState<string | undefined>();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const save = async () => {
    if (isSubmitting) return;
    const validationError = validateDisplayName(displayName);
    if (validationError) {
      setDisplayNameError(validationError);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setIsSaved(false);
    const result = await updateProfile({
      displayName: normalizeDisplayName(displayName),
    });
    if (result.ok) setIsSaved(true);
    else setSubmitError(result.error.message);
    setIsSubmitting(false);
  };

  return (
    <AppScreen onBack={navigation.goBack} title="EDIT PROFILE">
      <View>
        <Avatar
          imageUrl={profile?.avatarUrl ?? null}
          name={displayName || 'Mix & Match member'}
          size={72}
        />
      </View>
      <FormTextInput
        autoCapitalize="words"
        autoComplete="name"
        error={displayNameError}
        label="Display name"
        maxLength={50}
        onChangeText={(value) => {
          setDisplayName(value);
          setDisplayNameError(undefined);
          setIsSaved(false);
        }}
        value={displayName}
      />
      <ProfileSaveFeedback error={submitError} isSaved={isSaved} />
      <ActionButton label="Save" loading={isSubmitting} onPress={() => void save()} />
    </AppScreen>
  );
}

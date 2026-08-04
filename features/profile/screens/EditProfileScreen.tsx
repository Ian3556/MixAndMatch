import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ActionButton } from '@/components/ActionButton';
import { ErrorBanner } from '@/components/ErrorBanner';
import { FormTextInput } from '@/components/FormTextInput';
import { AppScreen } from '@/components/ui/AppScreen';
import { Avatar } from '@/components/ui/ProfilePrimitives';
import { DeferredNotice } from '@/components/ui/StateViews';
import type { ProfileStackParamList } from '@/navigation/types';
import { useAuthStore } from '@/store/authStore';
import { useAppTheme, type AppTheme } from '@/theme';
import { showDeferredNotice } from '@/utils/deferred';
import { normalizeDisplayName, validateDisplayName } from '@/utils/validation/authValidation';

type Props = NativeStackScreenProps<ProfileStackParamList, 'EditProfile'>;

export function EditProfileScreen({ navigation }: Props) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
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
    const result = await updateProfile({ displayName: normalizeDisplayName(displayName) });
    if (result.ok) setIsSaved(true);
    else setSubmitError(result.error.message);
    setIsSubmitting(false);
  };

  return (
    <AppScreen
      onBack={navigation.goBack}
      subtitle="Connected to the existing Phase 1 profile service"
      title="Edit profile"
    >
      <View style={styles.avatarRow}>
        <Avatar name={displayName || 'Mix & Match member'} />
        <View style={styles.avatarCopy}>
          <Text style={styles.avatarTitle}>Profile image</Text>
          <Text style={styles.avatarBody}>
            {profile?.avatarUrl ? 'An avatar URL exists on your profile.' : 'No avatar URL is set.'}
          </Text>
        </View>
        <ActionButton
          label="Change"
          onPress={() => showDeferredNotice('Avatar upload')}
          variant="secondary"
        />
      </View>
      <DeferredNotice>
        Avatar upload is deferred. Only the existing display-name field can be updated here.
      </DeferredNotice>
      {submitError ? <ErrorBanner message={submitError} /> : null}
      {isSaved ? (
        <View accessibilityLiveRegion="polite" style={styles.success}>
          <Text style={styles.successText}>Display name updated.</Text>
        </View>
      ) : null}
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
      <ActionButton label="Save profile" loading={isSubmitting} onPress={() => void save()} />
    </AppScreen>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    avatarRow: {
      alignItems: 'center',
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.md,
    },
    avatarCopy: { flex: 1, minWidth: 160 },
    avatarTitle: { color: theme.colors.text, fontWeight: theme.typography.fontWeight.semibold },
    avatarBody: { color: theme.colors.textMuted, fontSize: theme.typography.fontSize.sm },
    success: {
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.success,
      borderRadius: theme.radii.md,
      borderWidth: 1,
      padding: theme.spacing.md,
    },
    successText: { color: theme.colors.success },
  });
}

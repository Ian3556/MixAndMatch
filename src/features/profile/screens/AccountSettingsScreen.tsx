import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { ActionButton } from '@/components/ActionButton';
import { ErrorBanner } from '@/components/ErrorBanner';
import { AppScreen } from '@/components/ui/AppScreen';
import { SettingRow } from '@/components/ui/SettingRow';
import { SettingsGroup } from '@/components/ui/SettingsGroup';
import type { ProfileStackParamList } from '@/navigation/types';
import { useAuthStore } from '@/store/authStore';

import { useSignOutAction } from '../useSignOutAction';

type Props = NativeStackScreenProps<ProfileStackParamList, 'AccountSettings'>;

export function AccountSettingsScreen({ navigation }: Props) {
  const user = useAuthStore((state) => state.user);
  const { handleSignOut, isSigningOut, signOutError } = useSignOutAction();
  return (
    <AppScreen onBack={navigation.goBack} title="ACCOUNT SETTINGS">
      <SettingsGroup title="Identity">
        <SettingRow label="Email" value={user?.email ?? 'Unavailable'} />
      </SettingsGroup>
      {signOutError ? <ErrorBanner message={signOutError} /> : null}
      <ActionButton
        label="Sign out"
        loading={isSigningOut}
        onPress={() => void handleSignOut()}
        variant="secondary"
      />
    </AppScreen>
  );
}

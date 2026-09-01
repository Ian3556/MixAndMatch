import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { ActionButton } from '@/components/ActionButton';
import { ErrorBanner } from '@/components/ErrorBanner';
import { AppScreen } from '@/components/ui/AppScreen';
import { SettingRow } from '@/components/ui/SettingRow';
import { SettingsGroup } from '@/components/ui/SettingsGroup';
import { DeferredNotice } from '@/components/ui/StateViews';
import type { ProfileStackParamList } from '@/navigation/types';
import { useAuthStore } from '@/store/authStore';
import { showDeferredNotice } from '@/utils/deferred';

import { useSignOutAction } from '../useSignOutAction';

type Props = NativeStackScreenProps<ProfileStackParamList, 'AccountSettings'>;

export function AccountSettingsScreen({ navigation }: Props) {
  const user = useAuthStore((state) => state.user);
  const { handleSignOut, isSigningOut, signOutError } = useSignOutAction();
  return (
    <AppScreen onBack={navigation.goBack} subtitle="Identity and session controls" title="Account">
      <SettingsGroup title="Identity">
        <SettingRow label="Email" value={user?.email ?? 'Unavailable'} />
        <SettingRow
          description="Entry point only; signed-in password change is not wired in Phase 1."
          label="Change password"
          onPress={() => showDeferredNotice('Signed-in password change')}
        />
      </SettingsGroup>
      <DeferredNotice>
        Sign-out is fully connected. Account deletion remains a protected later-phase workflow and
        no deletion request is made here.
      </DeferredNotice>
      {signOutError ? <ErrorBanner message={signOutError} /> : null}
      <ActionButton
        label="Sign out"
        loading={isSigningOut}
        onPress={() => void handleSignOut()}
        variant="secondary"
      />
      <SettingsGroup title="Danger zone">
        <SettingRow
          description="Unavailable in Phase 3"
          destructive
          label="Delete account"
          onPress={() => showDeferredNotice('Account deletion')}
        />
      </SettingsGroup>
    </AppScreen>
  );
}

import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AppScreen } from '@/components/ui/AppScreen';
import { SettingRow } from '@/components/ui/SettingRow';
import { SettingsGroup } from '@/components/ui/SettingsGroup';
import { DeferredNotice } from '@/components/ui/StateViews';
import type { ProfileStackParamList } from '@/navigation/types';
import { showDeferredNotice } from '@/utils/deferred';

type Props = NativeStackScreenProps<ProfileStackParamList, 'PrivacySettings'>;

export function PrivacySettingsScreen({ navigation }: Props) {
  return (
    <AppScreen
      onBack={navigation.goBack}
      subtitle="Future privacy controls and disclosures"
      title="Privacy"
    >
      <DeferredNotice>
        These are structured entry points only. They do not change consent, data use, or account
        records.
      </DeferredNotice>
      <SettingsGroup title="Your data">
        <SettingRow label="Data usage" onPress={() => showDeferredNotice('Data usage details')} />
        <SettingRow
          label="Personalisation"
          onPress={() => showDeferredNotice('Personalisation controls')}
        />
        <SettingRow
          label="Image handling"
          onPress={() => showDeferredNotice('Image handling details')}
        />
        <SettingRow label="Account data" onPress={() => showDeferredNotice('Account data tools')} />
      </SettingsGroup>
      <SettingsGroup title="Policies">
        <SettingRow label="Privacy policy" onPress={() => showDeferredNotice('Privacy policy')} />
      </SettingsGroup>
    </AppScreen>
  );
}

import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import appConfig from '@/app.json';
import { AppScreen } from '@/components/ui/AppScreen';
import { SettingRow } from '@/components/ui/SettingRow';
import { SettingsGroup } from '@/components/ui/SettingsGroup';
import { DeferredNotice } from '@/components/ui/StateViews';
import type { ProfileStackParamList } from '@/navigation/types';
import { showDeferredNotice } from '@/utils/deferred';

type Props = NativeStackScreenProps<ProfileStackParamList, 'About'>;

export function AboutScreen({ navigation }: Props) {
  return (
    <AppScreen onBack={navigation.goBack} subtitle="Mix & Match product information" title="About">
      <SettingsGroup title="Application">
        <SettingRow label="Version" value={appConfig.expo.version} />
        <SettingRow label="Build phase" value="Phase 2 UI shell" />
      </SettingsGroup>
      <SettingsGroup title="Legal">
        <SettingRow label="Terms" onPress={() => showDeferredNotice('Terms')} />
        <SettingRow label="Privacy policy" onPress={() => showDeferredNotice('Privacy policy')} />
        <SettingRow label="Licences" onPress={() => showDeferredNotice('Open-source licences')} />
      </SettingsGroup>
      <DeferredNotice>
        Legal and licence documents require final product review before they are linked from the
        application.
      </DeferredNotice>
    </AppScreen>
  );
}

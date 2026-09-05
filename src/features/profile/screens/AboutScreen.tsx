import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import appConfig from '@root/app.json';
import { AppScreen } from '@/components/ui/AppScreen';
import { SettingRow } from '@/components/ui/SettingRow';
import { SettingsGroup } from '@/components/ui/SettingsGroup';
import type { ProfileStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<ProfileStackParamList, 'About'>;

export function AboutScreen({ navigation }: Props) {
  return (
    <AppScreen onBack={navigation.goBack} title="ABOUT">
      <SettingsGroup title="Application">
        <SettingRow label="Version" value={appConfig.expo.version} />
      </SettingsGroup>
      <SettingsGroup title="Legal">
        <SettingRow label="Terms" value="Not published" />
        <SettingRow label="Privacy policy" value="Not published" />
        <SettingRow label="Licences" value="Not published" />
      </SettingsGroup>
    </AppScreen>
  );
}

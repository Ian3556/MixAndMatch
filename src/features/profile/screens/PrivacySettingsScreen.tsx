import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AppScreen } from '@/components/ui/AppScreen';
import { SettingRow } from '@/components/ui/SettingRow';
import { SettingsGroup } from '@/components/ui/SettingsGroup';
import type { ProfileStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<ProfileStackParamList, 'PrivacySettings'>;

export function PrivacySettingsScreen({ navigation }: Props) {
  return (
    <AppScreen onBack={navigation.goBack} title="PRIVACY">
      <SettingsGroup title="Your data">
        <SettingRow label="Profile and preferences" value="Private" />
        <SettingRow label="Wardrobe" value="Private" />
        <SettingRow label="Recommendations" value="Account only" />
      </SettingsGroup>
      <SettingsGroup title="Policies">
        <SettingRow label="Privacy policy" value="Not published" />
      </SettingsGroup>
    </AppScreen>
  );
}

import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AppScreen } from '@/components/ui/AppScreen';
import { SettingRow } from '@/components/ui/SettingRow';
import { SettingsGroup } from '@/components/ui/SettingsGroup';
import type { ProfileStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<ProfileStackParamList, 'NotificationSettings'>;

export function NotificationSettingsScreen({ navigation }: Props) {
  return (
    <AppScreen onBack={navigation.goBack} title="NOTIFICATIONS">
      <SettingsGroup title="Preferences">
        <SettingRow label="Notification preferences" value="Not available" />
      </SettingsGroup>
    </AppScreen>
  );
}

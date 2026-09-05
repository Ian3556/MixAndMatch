import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AppScreen } from '@/components/ui/AppScreen';
import { SettingRow } from '@/components/ui/SettingRow';
import { SettingsGroup } from '@/components/ui/SettingsGroup';
import type { ProfileStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<ProfileStackParamList, 'HelpAndSupport'>;

export function HelpAndSupportScreen({ navigation }: Props) {
  return (
    <AppScreen onBack={navigation.goBack} title="HELP">
      <SettingsGroup>
        <SettingRow label="Frequently asked questions" value="Not available" />
        <SettingRow label="Contact support" value="Not available" />
        <SettingRow label="Report a problem" value="Not available" />
        <SettingRow label="App guide" value="Not available" />
      </SettingsGroup>
    </AppScreen>
  );
}

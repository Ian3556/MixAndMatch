import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AppScreen } from '@/components/ui/AppScreen';
import { SettingRow } from '@/components/ui/SettingRow';
import { SettingsGroup } from '@/components/ui/SettingsGroup';
import type { ProfileStackParamList } from '@/navigation/types';
import { useAppTheme, type ThemePreference } from '@/theme';

type Props = NativeStackScreenProps<ProfileStackParamList, 'AppearanceSettings'>;

const themeOptions: readonly { value: ThemePreference; label: string }[] = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

export function AppearanceSettingsScreen({ navigation }: Props) {
  const { preference, setPreference } = useAppTheme();
  return (
    <AppScreen onBack={navigation.goBack} title="APPEARANCE">
      <SettingsGroup title="Theme">
        {themeOptions.map((option) => (
          <SettingRow
            key={option.value}
            label={option.label}
            onPress={() => setPreference(option.value)}
            symbol={preference === option.value ? '✓' : '○'}
            value={preference === option.value ? 'Selected' : undefined}
          />
        ))}
      </SettingsGroup>
    </AppScreen>
  );
}

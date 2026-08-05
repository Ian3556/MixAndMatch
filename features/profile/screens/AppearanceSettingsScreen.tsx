import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AppScreen } from '@/components/ui/AppScreen';
import { SettingRow } from '@/components/ui/SettingRow';
import { SettingsGroup } from '@/components/ui/SettingsGroup';
import { DeferredNotice } from '@/components/ui/StateViews';
import type { ProfileStackParamList } from '@/navigation/types';
import { useAppTheme, type ThemePreference } from '@/theme';

type Props = NativeStackScreenProps<ProfileStackParamList, 'AppearanceSettings'>;

const themeOptions: readonly { value: ThemePreference; label: string; description: string }[] = [
  { value: 'system', label: 'System theme', description: 'Follow the device appearance setting' },
  { value: 'light', label: 'Light theme', description: 'Use the light colour tokens' },
  { value: 'dark', label: 'Dark theme', description: 'Use the dark colour tokens' },
];

export function AppearanceSettingsScreen({ navigation }: Props) {
  const { preference, setPreference } = useAppTheme();
  return (
    <AppScreen
      onBack={navigation.goBack}
      subtitle="Uses the existing Phase 0 token system"
      title="Appearance"
    >
      <SettingsGroup title="Theme">
        {themeOptions.map((option) => (
          <SettingRow
            description={option.description}
            key={option.value}
            label={option.label}
            onPress={() => setPreference(option.value)}
            symbol={preference === option.value ? '✓' : '○'}
            value={preference === option.value ? 'Selected' : undefined}
          />
        ))}
      </SettingsGroup>
      <DeferredNotice>
        Theme selection applies immediately for this app session. Persistence across restarts is
        intentionally not added in Phase 3.
      </DeferredNotice>
    </AppScreen>
  );
}

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';

import { AppScreen } from '@/components/ui/AppScreen';
import { SettingsGroup } from '@/components/ui/SettingsGroup';
import { DeferredNotice } from '@/components/ui/StateViews';
import { ToggleRow } from '@/components/ui/ToggleRow';
import type { ProfileStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<ProfileStackParamList, 'NotificationSettings'>;
type NotificationKey = 'outfit' | 'style' | 'weather' | 'inspiration' | 'product';

const rows: readonly { key: NotificationKey; label: string; description: string }[] = [
  { key: 'outfit', label: 'Outfit reminders', description: 'Future reminders for planned looks' },
  {
    key: 'style',
    label: 'Style suggestions',
    description: 'Future styling recommendation updates',
  },
  {
    key: 'weather',
    label: 'Weather-based recommendations',
    description: 'Future context-aware prompts',
  },
  {
    key: 'inspiration',
    label: 'New inspiration',
    description: 'Future editorial and discovery updates',
  },
  { key: 'product', label: 'Product updates', description: 'Important Mix & Match product news' },
];

export function NotificationSettingsScreen({ navigation }: Props) {
  const [values, setValues] = useState<Record<NotificationKey, boolean>>({
    outfit: false,
    style: false,
    weather: false,
    inspiration: false,
    product: false,
  });
  return (
    <AppScreen onBack={navigation.goBack} subtitle="Local UI controls only" title="Notifications">
      <DeferredNotice>
        Toggles reset when this screen unmounts. No permission is requested and no preference is
        saved.
      </DeferredNotice>
      <SettingsGroup title="Future notifications">
        {rows.map((row) => (
          <ToggleRow
            description={row.description}
            key={row.key}
            label={row.label}
            onValueChange={(value) => setValues((current) => ({ ...current, [row.key]: value }))}
            value={values[row.key]}
          />
        ))}
      </SettingsGroup>
    </AppScreen>
  );
}

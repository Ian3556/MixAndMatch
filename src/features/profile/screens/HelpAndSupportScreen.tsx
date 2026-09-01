import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AppScreen } from '@/components/ui/AppScreen';
import { SettingRow } from '@/components/ui/SettingRow';
import { SettingsGroup } from '@/components/ui/SettingsGroup';
import { DeferredNotice } from '@/components/ui/StateViews';
import type { ProfileStackParamList } from '@/navigation/types';
import { showDeferredNotice } from '@/utils/deferred';

type Props = NativeStackScreenProps<ProfileStackParamList, 'HelpAndSupport'>;

export function HelpAndSupportScreen({ navigation }: Props) {
  return (
    <AppScreen
      onBack={navigation.goBack}
      subtitle="Support structure for future content"
      title="Help & support"
    >
      <SettingsGroup>
        <SettingRow label="Frequently asked questions" onPress={() => showDeferredNotice('FAQs')} />
        <SettingRow label="Contact support" onPress={() => showDeferredNotice('Contact support')} />
        <SettingRow
          label="Report a problem"
          onPress={() => showDeferredNotice('Problem reports')}
        />
        <SettingRow label="App guide" onPress={() => showDeferredNotice('App guide')} />
      </SettingsGroup>
      <DeferredNotice>
        No message, issue report, or support ticket is sent from these unavailable entry points.
      </DeferredNotice>
    </AppScreen>
  );
}

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { View } from 'react-native';

import { AppScreen } from '@/components/ui/AppScreen';
import { ProfileDirectoryRow } from '@/features/profile/components/ProfileSettingsDirectory';
import { PROFILE_ROUTES } from '@/navigation/routes';
import type { ProfileStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<ProfileStackParamList, 'StyleProfile'>;

export function StyleProfileScreen({ navigation }: Props) {
  return (
    <AppScreen onBack={navigation.goBack} title="STYLE PROFILE">
      <View>
        <ProfileDirectoryRow
          label="Body Profile"
          onPress={() => navigation.navigate(PROFILE_ROUTES.BODY_PROFILE)}
        />
        <ProfileDirectoryRow
          label="Preferred Styles"
          onPress={() => navigation.navigate(PROFILE_ROUTES.PREFERRED_STYLES)}
        />
        <ProfileDirectoryRow
          label="Color"
          onPress={() => navigation.navigate(PROFILE_ROUTES.COLOR)}
        />
        <ProfileDirectoryRow
          label="Occasions"
          onPress={() => navigation.navigate(PROFILE_ROUTES.OCCASIONS)}
        />
        <ProfileDirectoryRow
          label="Fit Preferences"
          onPress={() => navigation.navigate(PROFILE_ROUTES.FIT_PREFERENCES)}
        />
      </View>
    </AppScreen>
  );
}

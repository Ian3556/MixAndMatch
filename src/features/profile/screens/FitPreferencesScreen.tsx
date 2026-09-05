import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { PreferenceSelectionScreen } from '@/features/profile/components/PreferenceSelectionScreen';
import { fitOptions } from '@/features/profile/styleProfileOptions';
import type { ProfileStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<ProfileStackParamList, 'FitPreferences'>;

export function FitPreferencesScreen({ navigation }: Props) {
  return (
    <PreferenceSelectionScreen
      emptyMessage="No fit preferences added."
      field="fitPreferences"
      navigation={navigation}
      options={fitOptions}
      title="FIT PREFERENCES"
    />
  );
}

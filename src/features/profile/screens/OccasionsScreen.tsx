import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { PreferenceSelectionScreen } from '@/features/profile/components/PreferenceSelectionScreen';
import { occasionOptions } from '@/features/profile/styleProfileOptions';
import type { ProfileStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<ProfileStackParamList, 'Occasions'>;

export function OccasionsScreen({ navigation }: Props) {
  return (
    <PreferenceSelectionScreen
      emptyMessage="No occasions added."
      field="occasions"
      navigation={navigation}
      options={occasionOptions}
      title="OCCASIONS"
    />
  );
}

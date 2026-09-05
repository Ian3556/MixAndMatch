import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { PreferenceSelectionScreen } from '@/features/profile/components/PreferenceSelectionScreen';
import { preferredStyleOptions } from '@/features/profile/styleProfileOptions';
import type { ProfileStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<ProfileStackParamList, 'PreferredStyles'>;

export function PreferredStylesScreen({ navigation }: Props) {
  return (
    <PreferenceSelectionScreen
      emptyMessage="No preferred styles added."
      field="preferredStyles"
      navigation={navigation}
      options={preferredStyleOptions}
      title="PREFERRED STYLES"
    />
  );
}

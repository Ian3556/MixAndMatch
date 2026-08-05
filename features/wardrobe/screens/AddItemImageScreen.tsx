import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text } from 'react-native';

import { ActionButton } from '@/components/ActionButton';
import { AppScreen } from '@/components/ui/AppScreen';
import { PlaceholderArtwork } from '@/components/ui/PlaceholderArtwork';
import { DeferredNotice } from '@/components/ui/StateViews';
import { neutralGarmentArtworkColors } from '@/fixtures/wardrobe';
import { WARDROBE_ROUTES } from '@/navigation/routes';
import type { WardrobeStackParamList } from '@/navigation/types';
import { useAppTheme, type AppTheme } from '@/theme';

type Props = NativeStackScreenProps<WardrobeStackParamList, 'AddItemImage'>;

export function AddItemImageScreen({ navigation, route }: Props) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const imageKey = `placeholder-${route.params.source}`;
  return (
    <AppScreen
      onBack={navigation.goBack}
      subtitle="Review the image surface before adding details."
      title="Item image"
    >
      <PlaceholderArtwork
        aspectRatio={1}
        colors={neutralGarmentArtworkColors}
        label="Garment preview"
      />
      <DeferredNotice>
        Manual items use local placeholder artwork in Phase 3. Camera, upload, crop, and background
        removal controls are intentionally unavailable.
      </DeferredNotice>
      <Text style={styles.source}>Entry choice: {route.params.source}</Text>
      <ActionButton
        label="Continue to details"
        onPress={() => navigation.navigate(WARDROBE_ROUTES.ADD_ITEM_DETAILS, { imageKey })}
      />
    </AppScreen>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    source: { color: theme.colors.textMuted, fontSize: theme.typography.fontSize.sm },
  });
}

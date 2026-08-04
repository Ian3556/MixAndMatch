import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';

import { ActionButton } from '@/components/ActionButton';
import { AppScreen } from '@/components/ui/AppScreen';
import { PlaceholderArtwork } from '@/components/ui/PlaceholderArtwork';
import { DeferredNotice } from '@/components/ui/StateViews';
import { neutralGarmentArtworkColors } from '@/fixtures/wardrobe';
import { WARDROBE_ROUTES } from '@/navigation/routes';
import type { WardrobeStackParamList } from '@/navigation/types';
import { useAppTheme, type AppTheme } from '@/theme';
import { showDeferredNotice } from '@/utils/deferred';

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
      <View style={styles.actions}>
        <ActionButton
          label="Replace image"
          onPress={() => showDeferredNotice('Image replacement')}
          variant="secondary"
        />
        <ActionButton
          label="Crop image"
          onPress={() => showDeferredNotice('Image cropping')}
          variant="secondary"
        />
        <ActionButton
          label="Remove background"
          onPress={() => showDeferredNotice('Background removal')}
          variant="secondary"
        />
      </View>
      <DeferredNotice>
        The preview is local artwork. No image was captured, selected, uploaded, cropped, or
        analysed.
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
    actions: { gap: theme.spacing.sm },
    source: { color: theme.colors.textMuted, fontSize: theme.typography.fontSize.sm },
  });
}

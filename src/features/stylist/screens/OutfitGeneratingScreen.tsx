import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';

import { ActionButton } from '@/components/ActionButton';
import { AppScreen } from '@/components/ui/AppScreen';
import { DeferredNotice, LoadingState } from '@/components/ui/StateViews';
import { outfitConcepts } from '@/fixtures/outfits';
import { STYLIST_ROUTES } from '@/navigation/routes';
import type { StylistStackParamList } from '@/navigation/types';
import { useAppTheme, type AppTheme } from '@/theme';

type Props = NativeStackScreenProps<StylistStackParamList, 'OutfitGenerating'>;

export function OutfitGeneratingScreen({ navigation, route }: Props) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const previewOutfit = outfitConcepts[0];

  return (
    <AppScreen
      onBack={navigation.goBack}
      subtitle="Processing-state UI preview"
      title="Building the look"
    >
      <LoadingState
        message={`The final engine would interpret a ${route.params.style.toLowerCase()} brief for ${route.params.occasion.toLowerCase()}. No request is running.`}
        title="Generation shell ready"
      />
      <View style={styles.statusList}>
        {[
          'Review the occasion and comfort goal',
          'Compare suitable wardrobe pieces',
          'Balance colour, proportion, and layers',
        ].map((status, index) => (
          <View key={status} style={styles.statusRow}>
            <Text style={styles.statusNumber}>{index + 1}</Text>
            <Text style={styles.statusText}>{status}</Text>
          </View>
        ))}
      </View>
      <DeferredNotice>
        There is no artificial delay, rotating timer, AI request, or background task. Continue to
        inspect a clearly labelled fixture result.
      </DeferredNotice>
      <ActionButton
        disabled={!previewOutfit}
        label="Preview static result"
        onPress={() => {
          if (previewOutfit) {
            navigation.navigate(STYLIST_ROUTES.OUTFIT_RESULT, { outfitId: previewOutfit.id });
          }
        }}
      />
      <ActionButton label="Cancel" onPress={navigation.goBack} variant="text" />
    </AppScreen>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    statusList: { gap: theme.spacing.sm },
    statusRow: {
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
      borderRadius: theme.radii.md,
      borderWidth: 1,
      flexDirection: 'row',
      gap: theme.spacing.md,
      minHeight: 56,
      padding: theme.spacing.md,
    },
    statusNumber: {
      color: theme.colors.primary,
      fontWeight: theme.typography.fontWeight.bold,
      width: 24,
    },
    statusText: { color: theme.colors.text, flex: 1 },
  });
}

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';

import { ActionButton } from '@/components/ActionButton';
import { AppScreen } from '@/components/ui/AppScreen';
import { Badge } from '@/components/ui/ProfilePrimitives';
import { PlaceholderArtwork } from '@/components/ui/PlaceholderArtwork';
import { DeferredNotice, ErrorState } from '@/components/ui/StateViews';
import { outfitConcepts } from '@/fixtures/outfits';
import { STYLIST_ROUTES } from '@/navigation/routes';
import type { StylistStackParamList } from '@/navigation/types';
import { useAppTheme, type AppTheme } from '@/theme';
import { showDeferredNotice } from '@/utils/deferred';

type Props = NativeStackScreenProps<StylistStackParamList, 'OutfitResult'>;

export function OutfitResultScreen({ navigation, route }: Props) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const outfit = outfitConcepts.find((candidate) => candidate.id === route.params.outfitId);

  if (!outfit) {
    return (
      <AppScreen onBack={navigation.goBack} title="Result unavailable">
        <ErrorState
          action={{ label: 'Go back', onPress: navigation.goBack }}
          message="The local result fixture is missing. No generation request was made."
          title="Missing outfit concept"
        />
      </AppScreen>
    );
  }

  return (
    <AppScreen
      onBack={navigation.goBack}
      subtitle="Static fixture result—not an AI recommendation"
      title={outfit.name}
    >
      <PlaceholderArtwork aspectRatio={4 / 3} colors={outfit.colors} label={outfit.name} />
      <View style={styles.badges}>
        <Badge label={outfit.occasion} />
        <Badge label={outfit.style} />
      </View>
      <View style={styles.section}>
        <Text accessibilityRole="header" style={styles.heading}>
          Garment breakdown
        </Text>
        <View style={styles.garments}>
          {outfit.garments.map((garment, index) => (
            <View key={garment} style={styles.garmentCard}>
              <PlaceholderArtwork
                aspectRatio={1}
                colors={[outfit.colors[index % outfit.colors.length] ?? theme.colors.surfaceMuted]}
                compact
                label={garment}
              />
              <Text style={styles.garmentName}>{garment}</Text>
              <ActionButton
                label="Alternative"
                onPress={() => showDeferredNotice('Alternative garment selection')}
                variant="text"
              />
            </View>
          ))}
        </View>
      </View>
      <View style={styles.section}>
        <Text accessibilityRole="header" style={styles.heading}>
          Styling instructions
        </Text>
        {outfit.instructions.map((instruction, index) => (
          <View key={instruction} style={styles.instruction}>
            <Text style={styles.number}>{index + 1}</Text>
            <Text style={styles.instructionText}>{instruction}</Text>
          </View>
        ))}
      </View>
      <DeferredNotice>
        The explanation above is static fixture copy and is not evidence of personalisation, AI
        analysis, or wardrobe matching.
      </DeferredNotice>
      <ActionButton
        label="View outfit details"
        onPress={() => navigation.navigate(STYLIST_ROUTES.OUTFIT_DETAIL, { outfitId: outfit.id })}
      />
      <ActionButton
        label="Save outfit"
        onPress={() => showDeferredNotice('Saved outfits')}
        variant="secondary"
      />
      <ActionButton
        label="Try another outfit"
        onPress={() => navigation.navigate(STYLIST_ROUTES.OUTFIT_GOAL)}
        variant="secondary"
      />
      <ActionButton
        label="3D preview unavailable"
        onPress={() => showDeferredNotice('3D outfit preview')}
        variant="text"
      />
    </AppScreen>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    badges: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
    section: { gap: theme.spacing.md },
    heading: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSize.lg,
      fontWeight: theme.typography.fontWeight.bold,
    },
    garments: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.md },
    garmentCard: { flexGrow: 1, gap: theme.spacing.sm, minWidth: 170, width: '30%' },
    garmentName: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.semibold,
    },
    instruction: {
      alignItems: 'flex-start',
      flexDirection: 'row',
      gap: theme.spacing.md,
    },
    number: {
      color: theme.colors.primary,
      fontWeight: theme.typography.fontWeight.bold,
      width: 24,
    },
    instructionText: {
      color: theme.colors.textMuted,
      flex: 1,
      fontSize: theme.typography.fontSize.md,
      lineHeight: theme.typography.lineHeight.md,
    },
  });
}

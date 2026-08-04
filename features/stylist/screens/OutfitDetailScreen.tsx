import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';

import { ActionButton } from '@/components/ActionButton';
import { AppScreen } from '@/components/ui/AppScreen';
import { Badge } from '@/components/ui/ProfilePrimitives';
import { PlaceholderArtwork } from '@/components/ui/PlaceholderArtwork';
import { DeferredNotice, ErrorState } from '@/components/ui/StateViews';
import { outfitConcepts } from '@/fixtures/outfits';
import type { StylistStackParamList } from '@/navigation/types';
import { useAppTheme, type AppTheme } from '@/theme';
import { showDeferredNotice } from '@/utils/deferred';

type Props = NativeStackScreenProps<StylistStackParamList, 'OutfitDetail'>;

export function OutfitDetailScreen({ navigation, route }: Props) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const outfit = outfitConcepts.find((candidate) => candidate.id === route.params.outfitId);

  if (!outfit) {
    return (
      <AppScreen onBack={navigation.goBack} title="Outfit unavailable">
        <ErrorState
          action={{ label: 'Go back', onPress: navigation.goBack }}
          message="This static outfit concept is not in the local fixture set."
          title="Missing outfit concept"
        />
      </AppScreen>
    );
  }

  const notes = [
    ['Colour rationale', outfit.colorRationale],
    ['Layering notes', outfit.layeringNotes],
    ['Footwear notes', outfit.footwearNotes],
    ['Accessories', outfit.accessories],
  ] as const;

  return (
    <AppScreen onBack={navigation.goBack} subtitle={outfit.occasion} title={outfit.name}>
      <PlaceholderArtwork aspectRatio={16 / 10} colors={outfit.colors} label={outfit.name} />
      <View style={styles.badges}>
        <Badge label={outfit.style} />
        <Badge label="Fixture concept" />
      </View>
      <View style={styles.section}>
        <Text accessibilityRole="header" style={styles.heading}>
          Garments
        </Text>
        {outfit.garments.map((garment) => (
          <View key={garment} style={styles.garmentRow}>
            <Text style={styles.bullet}>◇</Text>
            <Text style={styles.garmentText}>{garment}</Text>
          </View>
        ))}
      </View>
      <View style={styles.section}>
        <Text accessibilityRole="header" style={styles.heading}>
          Styling notes
        </Text>
        {notes.map(([label, value]) => (
          <View key={label} style={styles.noteCard}>
            <Text style={styles.noteLabel}>{label}</Text>
            <Text style={styles.noteBody}>{value}</Text>
          </View>
        ))}
      </View>
      <DeferredNotice>
        Saving, editing, sharing, and 3D preview remain deferred. These actions cannot mutate or
        publish data.
      </DeferredNotice>
      <ActionButton label="Save outfit" onPress={() => showDeferredNotice('Saved outfits')} />
      <ActionButton
        label="Edit outfit"
        onPress={() => showDeferredNotice('Outfit editing')}
        variant="secondary"
      />
      <ActionButton
        label="Share outfit"
        onPress={() => showDeferredNotice('Outfit sharing')}
        variant="secondary"
      />
      <ActionButton
        label="Open 3D preview"
        onPress={() => showDeferredNotice('3D outfit preview')}
        variant="text"
      />
    </AppScreen>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    badges: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
    section: { gap: theme.spacing.sm },
    heading: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSize.lg,
      fontWeight: theme.typography.fontWeight.bold,
    },
    garmentRow: {
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radii.md,
      flexDirection: 'row',
      gap: theme.spacing.sm,
      minHeight: 48,
      paddingHorizontal: theme.spacing.md,
    },
    bullet: { color: theme.colors.primary },
    garmentText: { color: theme.colors.text, flex: 1 },
    noteCard: {
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
      borderRadius: theme.radii.md,
      borderWidth: 1,
      gap: theme.spacing.xs,
      padding: theme.spacing.md,
    },
    noteLabel: { color: theme.colors.primary, fontWeight: theme.typography.fontWeight.semibold },
    noteBody: {
      color: theme.colors.textMuted,
      fontSize: theme.typography.fontSize.sm,
      lineHeight: theme.typography.lineHeight.sm,
    },
  });
}

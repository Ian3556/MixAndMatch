import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';

import { ActionButton } from '@/components/ActionButton';
import { AppScreen } from '@/components/ui/AppScreen';
import { IconButton } from '@/components/ui/IconButton';
import { OutfitCard } from '@/components/ui/OutfitCard';
import { PlaceholderArtwork } from '@/components/ui/PlaceholderArtwork';
import { EmptyState, ErrorState } from '@/components/ui/StateViews';
import { outfitConcepts } from '@/fixtures/outfits';
import { wardrobeItems } from '@/fixtures/wardrobe';
import { MAIN_ROUTES, STYLIST_ROUTES } from '@/navigation/routes';
import type { MainTabParamList, WardrobeStackParamList } from '@/navigation/types';
import { useAppTheme, type AppTheme } from '@/theme';
import { showDeferredNotice } from '@/utils/deferred';

type Props = NativeStackScreenProps<WardrobeStackParamList, 'WardrobeItemDetail'>;

export function WardrobeItemDetailScreen({ navigation, route }: Props) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const item = wardrobeItems.find((candidate) => candidate.id === route.params.itemId);

  if (!item) {
    return (
      <AppScreen onBack={navigation.goBack} title="Item unavailable">
        <ErrorState
          action={{ label: 'Return to wardrobe', onPress: navigation.goBack }}
          message="This local fixture could not be found. No wardrobe service was queried."
          title="Missing fixture item"
        />
      </AppScreen>
    );
  }

  const details = [
    ['Category', item.category],
    ['Colour', item.color],
    ['Material', item.material],
    ['Brand', item.brand],
    ['Season', item.season],
    ['Occasion', item.occasion],
    ['Notes', item.notes],
  ] as const;

  const styleItem = () =>
    navigation
      .getParent<BottomTabNavigationProp<MainTabParamList>>()
      ?.navigate(MAIN_ROUTES.STYLIST_TAB, { screen: STYLIST_ROUTES.OUTFIT_GOAL });

  return (
    <AppScreen
      actions={
        <IconButton
          label={`${item.isFavorite ? 'Remove from' : 'Add to'} favourites`}
          onPress={() => showDeferredNotice('Wardrobe favourites')}
          selected={item.isFavorite}
          symbol={item.isFavorite ? '♥' : '♡'}
        />
      }
      onBack={navigation.goBack}
      subtitle={`${item.category} · ${item.color}`}
      title={item.name}
    >
      <PlaceholderArtwork
        aspectRatio={4 / 3}
        colors={[item.tone, theme.colors.surfaceMuted]}
        label={item.name}
      />
      <View style={styles.details}>
        {details.map(([label, value]) => (
          <View key={label} style={styles.detailRow}>
            <Text style={styles.detailLabel}>{label}</Text>
            <Text style={styles.detailValue}>{value}</Text>
          </View>
        ))}
      </View>
      <View style={styles.actions}>
        <ActionButton label="Style this item" onPress={styleItem} />
        <ActionButton
          label="Edit item"
          onPress={() => showDeferredNotice('Wardrobe editing')}
          variant="secondary"
        />
        <ActionButton
          label="Delete item"
          onPress={() => showDeferredNotice('Wardrobe deletion')}
          variant="text"
        />
      </View>
      <View style={styles.section}>
        <Text accessibilityRole="header" style={styles.sectionTitle}>
          Related outfit concept
        </Text>
        {outfitConcepts[0] ? (
          <OutfitCard
            compact
            onPress={() => showDeferredNotice('Related outfit navigation')}
            outfit={outfitConcepts[0]}
          />
        ) : null}
      </View>
      <EmptyState
        message="Wear tracking will appear here after a real wardrobe and outfit history service exists."
        symbol="↻"
        title="No usage history yet"
      />
    </AppScreen>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    details: {
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
      borderRadius: theme.radii.lg,
      borderWidth: 1,
      overflow: 'hidden',
    },
    detailRow: {
      borderBottomColor: theme.colors.border,
      borderBottomWidth: StyleSheet.hairlineWidth,
      flexDirection: 'row',
      gap: theme.spacing.md,
      padding: theme.spacing.md,
    },
    detailLabel: { color: theme.colors.textMuted, width: 100 },
    detailValue: { color: theme.colors.text, flex: 1, textAlign: 'right' },
    actions: { gap: theme.spacing.sm },
    section: { gap: theme.spacing.md },
    sectionTitle: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSize.lg,
      fontWeight: theme.typography.fontWeight.bold,
    },
  });
}

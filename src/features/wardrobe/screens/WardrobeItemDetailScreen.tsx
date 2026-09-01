import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as Linking from 'expo-linking';
import { useEffect, useState } from 'react';
import { Alert, Image, StyleSheet, Text, View } from 'react-native';

import { ActionButton } from '@/components/ActionButton';
import { AppScreen } from '@/components/ui/AppScreen';
import { IconButton } from '@/components/ui/IconButton';
import { OutfitCard } from '@/components/ui/OutfitCard';
import { PlaceholderArtwork } from '@/components/ui/PlaceholderArtwork';
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/StateViews';
import { outfitConcepts } from '@/fixtures/outfits';
import { MAIN_ROUTES, STYLIST_ROUTES } from '@/navigation/routes';
import type { MainTabParamList, WardrobeStackParamList } from '@/navigation/types';
import { useAuthStore } from '@/store/authStore';
import { useWardrobeStore } from '@/store/wardrobeStore';
import { useAppTheme, type AppTheme } from '@/theme';
import { showDeferredNotice } from '@/utils/deferred';

type Props = NativeStackScreenProps<WardrobeStackParamList, 'WardrobeItemDetail'>;

export function WardrobeItemDetailScreen({ navigation, route }: Props) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const user = useAuthStore((state) => state.user);
  const item = useWardrobeStore((state) =>
    state.loadedUserId === user?.id
      ? state.items.find((candidate) => candidate.id === route.params.itemId)
      : undefined,
  );
  const wardrobeStatus = useWardrobeStore((state) => state.status);
  const loadedUserId = useWardrobeStore((state) => state.loadedUserId);
  const refresh = useWardrobeStore((state) => state.refresh);
  const toggleFavorite = useWardrobeStore((state) => state.toggleFavorite);
  const deleteItem = useWardrobeStore((state) => state.deleteItem);
  const [error, setError] = useState<string | null>(null);
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    if (user && loadedUserId !== user.id) void refresh(user.id);
  }, [loadedUserId, refresh, user]);

  if (user && (loadedUserId !== user.id || wardrobeStatus === 'loading')) {
    return (
      <AppScreen onBack={navigation.goBack} title="Wardrobe item">
        <LoadingState message="Loading the saved item." title="Opening itemâ€¦" />
      </AppScreen>
    );
  }

  if (!item) {
    return (
      <AppScreen onBack={navigation.goBack} title="Item unavailable">
        <ErrorState
          action={{ label: 'Return to wardrobe', onPress: navigation.goBack }}
          message="This saved wardrobe item could not be found. It may have been removed."
          title="Item not found"
        />
      </AppScreen>
    );
  }

  const details = [
    ['Category', item.category],
    ['Subcategory', item.subcategory],
    ['Colour', item.primaryColor],
    ['Material', item.material],
    ['Brand', item.brand],
    ['Season', item.season],
    ['Occasion', item.occasion],
    [
      'Price',
      item.price === null ? null : `${item.currency ?? ''} ${item.price.toFixed(2)}`.trim(),
    ],
    ['Source', item.sourceDomain],
    ['Notes', item.notes],
  ] as const;

  const styleItem = () =>
    navigation
      .getParent<BottomTabNavigationProp<MainTabParamList>>()
      ?.navigate(MAIN_ROUTES.STYLIST_TAB, { screen: STYLIST_ROUTES.OUTFIT_GOAL });

  const confirmDelete = () => {
    Alert.alert('Delete wardrobe item?', `${item.name} will be permanently removed.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          if (!user) return;
          void deleteItem(user.id, item.id)
            .then(() => navigation.goBack())
            .catch((caught: unknown) =>
              setError(caught instanceof Error ? caught.message : 'The item could not be deleted.'),
            );
        },
      },
    ]);
  };

  return (
    <AppScreen
      actions={
        <IconButton
          label={`${item.isFavorite ? 'Remove from' : 'Add to'} favourites`}
          onPress={() => {
            if (!user) return;
            void toggleFavorite(user.id, item.id).catch((caught: unknown) =>
              setError(
                caught instanceof Error ? caught.message : 'The favourite could not be updated.',
              ),
            );
          }}
          selected={item.isFavorite}
          symbol={item.isFavorite ? 'â™¥' : 'â™¡'}
        />
      }
      onBack={navigation.goBack}
      subtitle={[item.category, item.primaryColor].filter(Boolean).join(' Â· ')}
      title={item.name}
    >
      {item.imageUrl && !imageFailed ? (
        <Image
          accessibilityLabel={`${item.name} wardrobe image`}
          onError={() => setImageFailed(true)}
          resizeMode="contain"
          source={{ uri: item.imageUrl }}
          style={styles.image}
        />
      ) : (
        <PlaceholderArtwork
          aspectRatio={4 / 3}
          colors={[theme.colors.primarySoft, theme.colors.surfaceMuted, theme.colors.surface]}
          label={item.name}
        />
      )}
      {error ? (
        <ErrorState
          action={{ label: 'Dismiss', onPress: () => setError(null) }}
          message={error}
          title="Action failed"
        />
      ) : null}
      <View style={styles.details}>
        {details.map(([label, value]) => (
          <View key={label} style={styles.detailRow}>
            <Text style={styles.detailLabel}>{label}</Text>
            <Text style={styles.detailValue}>{value || 'Not specified'}</Text>
          </View>
        ))}
      </View>
      <View style={styles.actions}>
        <ActionButton label="Style this item" onPress={styleItem} />
        {item.sourceUrl ? (
          <ActionButton
            label="Open source"
            onPress={() =>
              void Linking.openURL(item.sourceUrl!).catch(() =>
                setError('The source link could not be opened on this device.'),
              )
            }
            variant="secondary"
          />
        ) : null}
        <ActionButton
          label="Edit item (unavailable)"
          onPress={() => showDeferredNotice('Wardrobe editing')}
          variant="secondary"
        />
        <ActionButton label="Delete item" onPress={confirmDelete} variant="text" />
      </View>
      <View style={styles.section}>
        <Text accessibilityRole="header" style={styles.sectionTitle}>
          Related outfit concept
        </Text>
        {outfitConcepts[0] ? (
          <OutfitCard
            compact
            onPress={() =>
              navigation
                .getParent<BottomTabNavigationProp<MainTabParamList>>()
                ?.navigate(MAIN_ROUTES.STYLIST_TAB, {
                  screen: STYLIST_ROUTES.OUTFIT_DETAIL,
                  params: { outfitId: outfitConcepts[0]!.id },
                })
            }
            outfit={outfitConcepts[0]}
          />
        ) : null}
      </View>
      <EmptyState
        message="Wear tracking remains outside Phase 3 and no history is fabricated."
        symbol="â†»"
        title="No usage history yet"
      />
    </AppScreen>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    image: {
      aspectRatio: 4 / 3,
      backgroundColor: theme.colors.surfaceMuted,
      borderRadius: theme.radii.lg,
      width: '100%',
    },
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

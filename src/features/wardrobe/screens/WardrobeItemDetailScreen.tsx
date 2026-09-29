import Ionicons from '@expo/vector-icons/Ionicons';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as Linking from 'expo-linking';
import { useEffect, useState } from 'react';
import { Alert, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { ActionButton } from '@/components/ActionButton';
import { AppScreen } from '@/components/ui/AppScreen';
import { ErrorState, LoadingState } from '@/components/ui/StateViews';
import { WardrobeHeroImage } from '@/features/wardrobe/components/WardrobeHeroImage';
import { wardrobeDetailPresentation } from '@/features/wardrobe/detail/wardrobePresentation';
import { MAIN_ROUTES, STYLIST_ROUTES, WARDROBE_ROUTES } from '@/navigation/routes';
import type { MainTabParamList, WardrobeStackParamList } from '@/navigation/types';
import { useAuthStore } from '@/store/authStore';
import { useWardrobeStore } from '@/store/wardrobeStore';
import { useAppTheme, type AppTheme } from '@/theme';

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

  useEffect(() => {
    if (user && loadedUserId !== user.id) void refresh(user.id);
  }, [loadedUserId, refresh, user]);

  if (user && (loadedUserId !== user.id || wardrobeStatus === 'loading')) {
    return (
      <AppScreen onBack={navigation.goBack} title="Wardrobe item">
        <LoadingState message="Loading the saved item." title="Opening item" />
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

  const presentation = wardrobeDetailPresentation(item);
  const styleItem = () =>
    navigation
      .getParent<BottomTabNavigationProp<MainTabParamList>>()
      ?.navigate(MAIN_ROUTES.STYLIST_TAB, {
        screen: STYLIST_ROUTES.OUTFIT_GOAL,
        params: { selectedItemId: item.id },
      });

  const removeItem = () => {
    if (!user) return;
    void deleteItem(user.id, item.id)
      .then(() => navigation.goBack())
      .catch((caught: unknown) =>
        setError(caught instanceof Error ? caught.message : 'The item could not be deleted.'),
      );
  };
  const confirmDelete = () => {
    if (Platform.OS === 'web') {
      if (typeof confirm === 'function' && confirm(`Delete ${item.name} permanently?`))
        removeItem();
      return;
    }
    Alert.alert('Delete wardrobe item?', `${item.name} will be permanently removed.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: removeItem },
    ]);
  };

  return (
    <AppScreen hideHeader title="">
      <Pressable
        accessibilityLabel="Go back"
        accessibilityRole="button"
        hitSlop={10}
        onPress={navigation.goBack}
        style={styles.back}
      >
        <Ionicons color={theme.colors.text} name="arrow-back-outline" size={26} />
      </Pressable>

      <View style={styles.heading}>
        {item.brand ? <Text style={styles.brand}>{item.brand}</Text> : null}
        <Text accessibilityRole="header" style={styles.title}>
          {presentation.title}
        </Text>
      </View>

      <WardrobeHeroImage
        imageUrl={item.imageUrl}
        key={item.imageUrl ?? item.id}
        name={presentation.title}
      />

      <View style={styles.summary}>
        {presentation.color ? <Text style={styles.color}>{presentation.color}</Text> : null}
        {presentation.price ? <Text style={styles.price}>{presentation.price}</Text> : null}
        <Text style={styles.category}>{presentation.category}</Text>
      </View>

      {presentation.details.length > 0 ? (
        <View style={styles.section}>
          <Text accessibilityRole="header" style={styles.sectionTitle}>
            PRODUCT DETAILS
          </Text>
          <View style={styles.detailsGrid}>
            {presentation.details.map(([label, value]) => (
              <View key={label} style={styles.detail}>
                <Text style={styles.detailLabel}>{label}</Text>
                <Text style={styles.detailValue}>{value}</Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}

      {presentation.description ? (
        <View style={styles.section}>
          <Text accessibilityRole="header" style={styles.sectionTitle}>
            ABOUT
          </Text>
          <Text style={styles.body}>{presentation.description}</Text>
        </View>
      ) : null}
      {presentation.notes ? (
        <View style={styles.section}>
          <Text accessibilityRole="header" style={styles.sectionTitle}>
            MY NOTES
          </Text>
          <Text style={styles.body}>{presentation.notes}</Text>
        </View>
      ) : null}

      {item.sourceUrl ? (
        <View style={styles.section}>
          <Text accessibilityRole="header" style={styles.sectionTitle}>
            SOURCE
          </Text>
          {item.brand ? <Text style={styles.sourceBrand}>{item.brand}</Text> : null}
          <Pressable
            accessibilityLabel="Open original product"
            accessibilityRole="link"
            onPress={() =>
              void Linking.openURL(item.sourceUrl!).catch(() =>
                setError('The original product link could not be opened on this device.'),
              )
            }
            style={styles.sourceLink}
          >
            <Text style={styles.linkText}>{item.sourceDomain ?? 'Open original product'}</Text>
            <Ionicons color={theme.colors.text} name="open-outline" size={16} />
          </Pressable>
        </View>
      ) : null}

      {error ? (
        <ErrorState
          action={{ label: 'Dismiss', onPress: () => setError(null) }}
          message={error}
          title="Action failed"
        />
      ) : null}

      <View style={styles.actions}>
        <ActionButton label="STYLE THIS ITEM" onPress={styleItem} square />
        <ActionButton
          label="Edit Item"
          onPress={() => navigation.navigate(WARDROBE_ROUTES.EDIT_ITEM, { itemId: item.id })}
          square
          variant="secondary"
        />
        <Pressable
          accessibilityLabel={item.isFavorite ? 'Remove from favourites' : 'Add to favourites'}
          accessibilityRole="button"
          onPress={() => {
            if (!user) return;
            void toggleFavorite(user.id, item.id).catch((caught: unknown) =>
              setError(
                caught instanceof Error ? caught.message : 'The favourite could not be updated.',
              ),
            );
          }}
          style={styles.favorite}
        >
          <Ionicons
            color={theme.colors.textMuted}
            name={item.isFavorite ? 'heart' : 'heart-outline'}
            size={18}
          />
          <Text style={styles.favoriteText}>
            {item.isFavorite ? 'Saved to favourites' : 'Add to favourites'}
          </Text>
        </Pressable>
        <Pressable accessibilityRole="button" onPress={confirmDelete} style={styles.delete}>
          <Text style={styles.deleteText}>Delete Item</Text>
        </Pressable>
      </View>
    </AppScreen>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    back: { alignItems: 'center', height: 44, justifyContent: 'center', width: 44 },
    heading: { gap: theme.spacing.xs },
    brand: {
      color: theme.colors.textMuted,
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.sm,
      letterSpacing: 1.8,
      textTransform: 'uppercase',
    },
    title: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.editorial,
      fontSize: theme.typography.fontSize.xxl,
      lineHeight: theme.typography.lineHeight.xxl,
    },
    summary: { gap: theme.spacing.sm },
    color: {
      color: theme.colors.textMuted,
      fontSize: theme.typography.fontSize.sm,
      letterSpacing: 1.1,
      textTransform: 'uppercase',
    },
    price: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.editorial,
      fontSize: theme.typography.fontSize.xl,
    },
    category: {
      color: theme.colors.textMuted,
      fontSize: theme.typography.fontSize.sm,
      letterSpacing: 1,
      textTransform: 'uppercase',
    },
    section: {
      borderTopColor: theme.colors.border,
      borderTopWidth: StyleSheet.hairlineWidth,
      gap: theme.spacing.md,
      paddingTop: theme.spacing.lg,
    },
    sectionTitle: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.xs,
      fontWeight: theme.typography.fontWeight.semibold,
      letterSpacing: 1.5,
    },
    detailsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.lg },
    detail: { gap: theme.spacing.xs, minWidth: 180, width: '45%' },
    detailLabel: { color: theme.colors.textMuted, fontSize: theme.typography.fontSize.sm },
    detailValue: { color: theme.colors.text, fontSize: theme.typography.fontSize.md },
    body: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSize.md,
      lineHeight: theme.typography.lineHeight.md,
    },
    sourceBrand: { color: theme.colors.text, fontSize: theme.typography.fontSize.md },
    sourceLink: {
      alignItems: 'center',
      alignSelf: 'flex-start',
      flexDirection: 'row',
      gap: theme.spacing.xs,
      paddingVertical: theme.spacing.xs,
    },
    linkText: {
      color: theme.colors.textMuted,
      fontSize: theme.typography.fontSize.sm,
      textDecorationLine: 'underline',
    },
    actions: { gap: theme.spacing.sm, marginTop: theme.spacing.md },
    favorite: {
      alignItems: 'center',
      alignSelf: 'center',
      flexDirection: 'row',
      gap: theme.spacing.sm,
      minHeight: 44,
    },
    favoriteText: { color: theme.colors.textMuted, fontSize: theme.typography.fontSize.sm },
    delete: {
      alignSelf: 'center',
      borderTopColor: theme.colors.border,
      borderTopWidth: StyleSheet.hairlineWidth,
      marginTop: theme.spacing.lg,
      minHeight: 44,
      paddingTop: theme.spacing.md,
    },
    deleteText: { color: theme.colors.danger, fontSize: theme.typography.fontSize.sm },
  });
}

import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useNavigation, type NavigationProp, type ParamListBase } from '@react-navigation/native';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ActionButton } from '@/components/ActionButton';
import { ErrorState, SkeletonCard } from '@/components/ui/StateViews';
import { MAIN_ROUTES, PROFILE_ROUTES, STYLIST_ROUTES, WARDROBE_ROUTES } from '@/navigation/routes';
import type { MainTabParamList } from '@/navigation/types';
import { useStylistStore } from '@/store/stylistStore';
import { useAppTheme } from '@/theme';
import { FIRST_OUTFIT_REQUEST, getFirstOutfitProgress } from '../presentation/firstOutfitProgress';
import { getOutfitItems } from '../types';
import { useStylistData } from '../useStylistData';

export function FirstOutfitGuide() {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const tabs = navigation.getParent<BottomTabNavigationProp<MainTabParamList>>();
  const { user, profile, wardrobe, ready, error, retry } = useStylistData();
  const state = useStylistStore();
  const theme = useAppTheme();
  const progress = useMemo(
    () =>
      ready
        ? getFirstOutfitProgress(
            {
              wardrobe,
              styleProfile: profile?.styleProfile ?? null,
              preferenceModel: state.preferenceModel,
              history: state.history,
            },
            state,
          )
        : null,
    [ready, wardrobe, profile?.styleProfile, state],
  );
  if (!user) return null;
  if (error)
    return (
      <ErrorState
        title="First outfit guide unavailable"
        message={error}
        action={{ label: 'Try again', onPress: retry }}
        square
      />
    );
  if (!progress) return <SkeletonCard square />;
  if (progress.stage === 'complete') return null;
  const add = (category?: string) =>
    tabs?.navigate(MAIN_ROUTES.WARDROBE_TAB, {
      screen: WARDROBE_ROUTES.ADD_ITEM_DETAILS,
      params: { imageKey: 'manual', ...(category ? { initialDraft: { category } } : {}) },
      initial: false,
    });
  const generation = state.currentGeneration;
  const canReview =
    generation &&
    generation.recommendations.some((recommendation) =>
      getOutfitItems(recommendation.outfit).every(
        (item) =>
          wardrobe.some((owned) => owned.id === item.id) &&
          !state.preferenceModel.neverRecommendItemIds.includes(item.id),
      ),
    );
  return (
    <View
      style={{
        borderTopWidth: StyleSheet.hairlineWidth,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: theme.colors.border,
        paddingVertical: theme.spacing.lg,
        gap: theme.spacing.md,
      }}
    >
      <Text style={{ color: theme.colors.textMuted, fontSize: 12, letterSpacing: 1.4 }}>
        YOUR FIRST OUTFIT · {progress.stage === 'ready' ? 'STYLE & SAVE' : 'BUILD YOUR WARDROBE'}
      </Text>
      <Text
        accessibilityRole="header"
        style={{
          color: theme.colors.text,
          fontFamily: theme.typography.fontFamily.editorial,
          fontSize: 30,
          lineHeight: 36,
        }}
      >
        {progress.title}
      </Text>
      <Text style={{ color: theme.colors.textMuted, fontSize: 15, lineHeight: 23, maxWidth: 650 }}>
        {progress.message}
      </Text>
      {progress.stage === 'ready' ? (
        <>
          <ActionButton
            label={canReview ? 'Review your looks' : 'Create my first outfit'}
            onPress={() => {
              if (canReview && generation)
                tabs?.navigate(MAIN_ROUTES.STYLIST_TAB, {
                  screen: STYLIST_ROUTES.OUTFIT_RESULT,
                  params: { generationId: generation.id },
                  initial: false,
                });
              else
                tabs?.navigate(MAIN_ROUTES.STYLIST_TAB, {
                  screen: STYLIST_ROUTES.OUTFIT_GENERATING,
                  params: { request: FIRST_OUTFIT_REQUEST },
                  initial: false,
                });
            }}
            square
          />
          <Text style={{ color: theme.colors.textMuted, fontSize: 12 }}>
            Your saved outfits and wear history stay on this device.
          </Text>
        </>
      ) : (
        <>
          <ActionButton
            label={
              progress.stage === 'add'
                ? `Add ${progress.category === 'Tops' ? 'a top' : 'a bottom'}`
                : 'Add another piece'
            }
            onPress={() => add(progress.stage === 'add' ? progress.category : undefined)}
            square
          />
          <ActionButton
            label="Add a dress instead"
            onPress={() => add('Dresses')}
            square
            variant="secondary"
          />
          <ActionButton
            label="Import from a website"
            onPress={() =>
              tabs?.navigate(MAIN_ROUTES.WARDROBE_TAB, {
                screen: WARDROBE_ROUTES.IMPORT_WEBSITE,
                initial: false,
              })
            }
            square
            variant="text"
          />
          {progress.stage === 'blocked' ? (
            <ActionButton
              label="Review colour preferences"
              onPress={() =>
                tabs?.navigate(MAIN_ROUTES.PROFILE_TAB, {
                  screen: PROFILE_ROUTES.COLOR,
                  initial: false,
                })
              }
              square
              variant="text"
            />
          ) : null}
        </>
      )}
    </View>
  );
}

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { ActionButton } from '@/components/ActionButton';
import { AppScreen } from '@/components/ui/AppScreen';
import { EmptyState, ErrorState } from '@/components/ui/StateViews';
import { StylingRecommendationCard } from '@/features/stylist/components/StylingRecommendationCard';
import {
  StylistEditorialHeader,
  StylistNotice,
  StylistSectionHeading,
} from '@/features/stylist/components/StylistEditorial';
import type { ClothingItem, StylingRecommendation } from '@/features/stylist/types';
import { STYLIST_ROUTES } from '@/navigation/routes';
import type { StylistStackParamList } from '@/navigation/types';
import { useStylistStore } from '@/store/stylistStore';
import { useAppTheme, type AppTheme } from '@/theme';

import { useStylistData } from '../useStylistData';

type Props = NativeStackScreenProps<StylistStackParamList, 'OutfitResult'>;
type FeedbackAction = 'like' | 'dislike' | 'save' | 'wore';

export function OutfitResultScreen({ navigation, route }: Props) {
  const styles = createStyles(useAppTheme());
  const { width } = useWindowDimensions();
  const { user, profile, wardrobe, ready } = useStylistData();
  const generation = useStylistStore((state) => state.currentGeneration);
  const feedbackByOutfit = useStylistStore((state) => state.feedbackByOutfit);
  const savedLooks = useStylistStore((state) => state.savedLooks);
  const neverRecommendItemIds = useStylistStore(
    (state) => state.preferenceModel.neverRecommendItemIds,
  );
  const storeError = useStylistStore((state) => state.error);
  const clearError = useStylistStore((state) => state.clearError);
  const recordFeedback = useStylistStore((state) => state.recordFeedback);
  const neverRecommendItem = useStylistStore((state) => state.neverRecommendItem);
  const regenerate = useStylistStore((state) => state.regenerate);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const applyFeedback = async (recommendation: StylingRecommendation, action: FeedbackAction) => {
    if (!user || !generation) return;
    setBusy(true);
    setNotice(null);
    try {
      await recordFeedback(user.id, recommendation, generation.request, action);
      setNotice(feedbackMessage(action));
    } catch (caught) {
      setNotice(caught instanceof Error ? caught.message : 'The feedback could not be recorded.');
    } finally {
      setBusy(false);
    }
  };

  const excludeItem = async (item: ClothingItem) => {
    if (!user) return;
    setBusy(true);
    setNotice(null);
    try {
      await neverRecommendItem(user.id, item.id);
      setNotice(`${item.name} will be excluded from future recommendations.`);
    } catch (caught) {
      setNotice(caught instanceof Error ? caught.message : 'The item could not be excluded.');
    } finally {
      setBusy(false);
    }
  };

  const regenerateLooks = async () => {
    if (!user || !generation || !ready) return;
    setBusy(true);
    setNotice(null);
    try {
      await regenerate({
        userId: user.id,
        wardrobe,
        ...(profile ? { styleProfile: profile.styleProfile } : {}),
        request: generation.request,
      });
      setNotice('New looks generated with your latest feedback and wardrobe rotation.');
    } catch (caught) {
      setNotice(caught instanceof Error ? caught.message : 'The looks could not be regenerated.');
    } finally {
      setBusy(false);
    }
  };

  if (!generation) {
    return (
      <AppScreen hideHeader title="Recommendations unavailable">
        <StylistEditorialHeader
          eyebrow="THE STYLING EDIT"
          onBack={navigation.goBack}
          title="Recommendations unavailable."
        />
        <ErrorState
          action={{
            label: 'Create a new brief',
            onPress: () => navigation.navigate(STYLIST_ROUTES.OUTFIT_GOAL),
          }}
          message={`Generation ${route.params.generationId} is no longer available in this session.`}
          square
          title="Create the looks again"
        />
      </AppScreen>
    );
  }

  const primaryRecommendation = generation.recommendations[0];

  return (
    <AppScreen hideHeader title="Your looks">
      <StylistEditorialHeader
        eyebrow="THE STYLING EDIT"
        meta={`${generation.recommendations.length} DETERMINISTIC WARDROBE MATCHES`}
        onBack={() => navigation.navigate(STYLIST_ROUTES.STYLIST)}
        title="Your wardrobe, recut."
      />
      {storeError ? (
        <ErrorState
          action={{ label: 'Dismiss', onPress: clearError }}
          message={storeError}
          square
          title="Local save failed"
        />
      ) : null}
      {notice ? <StylistNotice>{notice}</StylistNotice> : null}
      {!primaryRecommendation ? (
        <>
          <EmptyState
            action={{
              label: 'Adjust filters',
              onPress: () => navigation.navigate(STYLIST_ROUTES.OUTFIT_GOAL),
            }}
            message="No strong match was found with the current wardrobe and hard filters. Add compatible pieces or change the brief."
            square
            title="No valid outfits"
          />
          {__DEV__ && generation.diagnostics.rejectedCandidates.length > 0 ? (
            <View style={styles.debugRejections}>
              <Text style={styles.debugTitle}>Development rejection diagnostics</Text>
              {generation.diagnostics.rejectedCandidates.slice(0, 8).map((rejection, index) => (
                <Text
                  key={`${rejection.outfitId}-${rejection.reason}-${index}`}
                  style={styles.debugText}
                >
                  {rejection.reason} · {rejection.itemId ?? rejection.outfitId}
                </Text>
              ))}
            </View>
          ) : null}
        </>
      ) : (
        <>
          <View style={styles.section}>
            <StylistSectionHeading eyebrow="01 · RECOMMENDED LOOK" title="The lead look." />
            <StylingRecommendationCard
              busy={busy}
              featured
              {...(feedbackByOutfit[primaryRecommendation.outfit.id]
                ? { feedback: feedbackByOutfit[primaryRecommendation.outfit.id] }
                : {})}
              index={0}
              neverRecommendItemIds={neverRecommendItemIds}
              onFeedback={(action) => void applyFeedback(primaryRecommendation, action)}
              onNeverRecommend={(item) => void excludeItem(item)}
              onOpen={() =>
                navigation.navigate(STYLIST_ROUTES.OUTFIT_DETAIL, {
                  outfitId: primaryRecommendation.outfit.id,
                })
              }
              recommendation={primaryRecommendation}
              saved={savedLooks.some(
                (look) => look.recommendation.outfit.id === primaryRecommendation.outfit.id,
              )}
            />
          </View>

          {generation.recommendations.length > 1 ? (
            <View style={styles.section}>
              <StylistSectionHeading
                eyebrow="02 · ALTERNATIVE LOOKS"
                title="Change the composition."
              />
              <View style={styles.alternativeGrid}>
                {generation.recommendations.slice(1).map((recommendation, index) => (
                  <View
                    key={recommendation.outfit.id}
                    style={[
                      styles.alternativeCard,
                      width >= 720 ? styles.alternativeCardWide : null,
                    ]}
                  >
                    <StylingRecommendationCard
                      busy={busy}
                      {...(feedbackByOutfit[recommendation.outfit.id]
                        ? { feedback: feedbackByOutfit[recommendation.outfit.id] }
                        : {})}
                      index={index + 1}
                      neverRecommendItemIds={neverRecommendItemIds}
                      onFeedback={(action) => void applyFeedback(recommendation, action)}
                      onNeverRecommend={(item) => void excludeItem(item)}
                      onOpen={() =>
                        navigation.navigate(STYLIST_ROUTES.OUTFIT_DETAIL, {
                          outfitId: recommendation.outfit.id,
                        })
                      }
                      recommendation={recommendation}
                      saved={savedLooks.some(
                        (look) => look.recommendation.outfit.id === recommendation.outfit.id,
                      )}
                    />
                  </View>
                ))}
              </View>
            </View>
          ) : null}
        </>
      )}
      {generation.recommendations.length > 0 ? (
        <View style={styles.actions}>
          <ActionButton
            label="Regenerate"
            loading={busy}
            onPress={() => void regenerateLooks()}
            square
          />
          <ActionButton
            label="Adjust filters"
            onPress={() => navigation.navigate(STYLIST_ROUTES.OUTFIT_GOAL)}
            square
            variant="secondary"
          />
        </View>
      ) : null}
    </AppScreen>
  );
}

function feedbackMessage(action: FeedbackAction): string {
  if (action === 'like') return 'Like recorded. Similar signals will score higher next time.';
  if (action === 'dislike') return 'Dislike recorded. These signals will score lower next time.';
  if (action === 'save') return 'Look saved on this device.';
  return 'Wear recorded. Rotation will reduce immediate repetition.';
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    section: { gap: theme.spacing.lg },
    alternativeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.xl },
    alternativeCard: { width: '100%' },
    alternativeCardWide: { flexGrow: 1, minWidth: 320, width: '47%' },
    actions: { gap: theme.spacing.sm },
    debugRejections: {
      borderColor: theme.colors.border,
      borderWidth: 1,
      gap: theme.spacing.xs,
      padding: theme.spacing.md,
    },
    debugTitle: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSize.xs,
      fontWeight: theme.typography.fontWeight.bold,
      textTransform: 'uppercase',
    },
    debugText: {
      color: theme.colors.textMuted,
      fontFamily: 'monospace',
      fontSize: theme.typography.fontSize.xs,
    },
  });
}

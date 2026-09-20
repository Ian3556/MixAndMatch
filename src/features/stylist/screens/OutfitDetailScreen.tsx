import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import { AppScreen } from '@/components/ui/AppScreen';
import { ErrorState } from '@/components/ui/StateViews';
import { StylingRecommendationCard } from '@/features/stylist/components/StylingRecommendationCard';
import {
  StylistEditorialHeader,
  StylistNotice,
} from '@/features/stylist/components/StylistEditorial';
import type { ClothingItem } from '@/features/stylist/types';
import type { StylistStackParamList } from '@/navigation/types';
import { useStylistStore } from '@/store/stylistStore';
import { useAppTheme, type AppTheme } from '@/theme';

import { useStylistData } from '../useStylistData';

type Props = NativeStackScreenProps<StylistStackParamList, 'OutfitDetail'>;
type FeedbackAction = 'like' | 'dislike' | 'save' | 'wore';

export function OutfitDetailScreen({ navigation, route }: Props) {
  const styles = createStyles(useAppTheme());
  const { user } = useStylistData();
  const currentGeneration = useStylistStore((state) => state.currentGeneration);
  const savedLooks = useStylistStore((state) => state.savedLooks);
  const feedback = useStylistStore((state) => state.feedbackByOutfit[route.params.outfitId]);
  const neverRecommendItemIds = useStylistStore(
    (state) => state.preferenceModel.neverRecommendItemIds,
  );
  const recordFeedback = useStylistStore((state) => state.recordFeedback);
  const neverRecommendItem = useStylistStore((state) => state.neverRecommendItem);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const savedLook = savedLooks.find(
    (look) => look.recommendation.outfit.id === route.params.outfitId,
  );
  const recommendation =
    currentGeneration?.recommendations.find(
      (candidate) => candidate.outfit.id === route.params.outfitId,
    ) ?? savedLook?.recommendation;
  const request = currentGeneration?.recommendations.some(
    (candidate) => candidate.outfit.id === route.params.outfitId,
  )
    ? currentGeneration.request
    : savedLook?.request;

  if (!recommendation || !request) {
    return (
      <AppScreen hideHeader title="Outfit unavailable">
        <StylistEditorialHeader
          eyebrow="LOOK DETAIL"
          onBack={navigation.goBack}
          title="Outfit unavailable."
        />
        <ErrorState
          action={{ label: 'Go back', onPress: navigation.goBack }}
          message="This recommendation is no longer in the current session or saved looks."
          square
          title="Look not found"
        />
      </AppScreen>
    );
  }

  const applyFeedback = async (action: FeedbackAction) => {
    if (!user) return;
    setBusy(true);
    try {
      await recordFeedback(user.id, recommendation, request, action);
      setNotice(action === 'save' ? 'Look saved on this device.' : 'Your feedback was recorded.');
    } catch (caught) {
      setNotice(caught instanceof Error ? caught.message : 'The feedback could not be recorded.');
    } finally {
      setBusy(false);
    }
  };

  const excludeItem = async (item: ClothingItem) => {
    if (!user) return;
    setBusy(true);
    try {
      await neverRecommendItem(user.id, item.id);
      setNotice(`${item.name} will not appear in future recommendations.`);
    } catch (caught) {
      setNotice(caught instanceof Error ? caught.message : 'The item could not be excluded.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <AppScreen hideHeader title="Outfit detail">
      <StylistEditorialHeader
        eyebrow="LOOK DETAIL"
        meta="DETERMINISTIC WARDROBE RECOMMENDATION"
        onBack={navigation.goBack}
        title="The full composition."
      />
      {notice ? <StylistNotice>{notice}</StylistNotice> : null}
      <StylingRecommendationCard
        busy={busy}
        featured
        {...(feedback ? { feedback } : {})}
        index={0}
        neverRecommendItemIds={neverRecommendItemIds}
        onFeedback={(action) => void applyFeedback(action)}
        onNeverRecommend={(item) => void excludeItem(item)}
        recommendation={recommendation}
        saved={Boolean(savedLook)}
      />
      <Text style={styles.futureBoundary}>3D preview unavailable in Styling Engine V1.</Text>
    </AppScreen>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    futureBoundary: {
      borderTopColor: theme.colors.border,
      borderTopWidth: StyleSheet.hairlineWidth,
      color: theme.colors.textMuted,
      fontSize: theme.typography.fontSize.xs,
      letterSpacing: 0.8,
      paddingTop: theme.spacing.md,
      textTransform: 'uppercase',
    },
  });
}

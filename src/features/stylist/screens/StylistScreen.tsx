import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';

import { AppScreen } from '@/components/ui/AppScreen';
import { EmptyState, ErrorState } from '@/components/ui/StateViews';
import type { OutfitDisplayItem } from '@/features/stylist/components/OutfitImageComposition';
import {
  stylistOccasionOptions,
  StylistLandingControls,
  vibeOptions,
} from '@/features/stylist/components/StylistLandingControls';
import {
  AlternativeLooksSection,
  RecommendedLookSection,
  SavedLookDirectory,
  StylistLandingHero,
} from '@/features/stylist/components/StylistLandingLooks';
import {
  StylistEditorialHeader,
  StylistEditorialSkeleton,
} from '@/features/stylist/components/StylistEditorial';
import { getOutfitItems } from '@/features/stylist/types';
import { MAIN_ROUTES, STYLIST_ROUTES } from '@/navigation/routes';
import type { MainTabParamList, StylistStackParamList } from '@/navigation/types';
import { useStylistStore } from '@/store/stylistStore';

import { useStylistData } from '../useStylistData';

type Props = NativeStackScreenProps<StylistStackParamList, 'Stylist'>;

export function StylistScreen({ navigation }: Props) {
  const { error, loading, ready, retry, wardrobe, profile } = useStylistData();
  const savedLooks = useStylistStore((state) => state.savedLooks);
  const currentGeneration = useStylistStore((state) => state.currentGeneration);
  const [styleOverride, setStyleOverride] = useState<string | null>(null);
  const [occasionOverride, setOccasionOverride] = useState<string | null>(null);
  const [weather, setWeather] = useState('Mild');
  const desiredStyle = styleOverride ?? profile?.styleProfile.preferredStyles[0] ?? vibeOptions[0];
  const occasion =
    occasionOverride ?? profile?.styleProfile.occasions[0] ?? stylistOccasionOptions[0];
  const featuredRecommendation = currentGeneration?.recommendations[0];
  const alternatives = currentGeneration?.recommendations.slice(1) ?? [];
  const coverItems: OutfitDisplayItem[] = featuredRecommendation
    ? getOutfitItems(featuredRecommendation.outfit)
    : wardrobe.slice(0, 3).map(toDisplayItem);

  const openWardrobe = () =>
    navigation
      .getParent<BottomTabNavigationProp<MainTabParamList>>()
      ?.navigate(MAIN_ROUTES.WARDROBE_TAB);

  const openLook = (outfitId: string) =>
    navigation.navigate(STYLIST_ROUTES.OUTFIT_DETAIL, { outfitId });

  const generateStyle = () =>
    navigation.navigate(STYLIST_ROUTES.OUTFIT_GENERATING, {
      request: { occasion, desiredStyle: [desiredStyle], weather },
    });

  return (
    <AppScreen hideHeader title="Styling">
      <StylistEditorialHeader
        eyebrow="THE STYLING EDIT"
        meta="REAL WARDROBE · LOCAL RECOMMENDATIONS"
        title="Dress the brief."
      />

      {loading ? (
        <StylistEditorialSkeleton />
      ) : error ? (
        <ErrorState
          action={{ label: 'Try again', onPress: retry }}
          message={error}
          square
          title="Styling unavailable"
        />
      ) : ready && wardrobe.length === 0 ? (
        <EmptyState
          action={{ label: 'Add clothes', onPress: openWardrobe }}
          message="Add a few tops, bottoms, dresses, or shoes before generating a look."
          square
          title="Your wardrobe is empty"
        />
      ) : (
        <>
          <StylistLandingHero
            desiredStyle={desiredStyle}
            items={coverItems}
            occasion={occasion}
            onOpenRecommendation={() => {
              if (featuredRecommendation) openLook(featuredRecommendation.outfit.id);
            }}
            {...(featuredRecommendation ? { recommendation: featuredRecommendation } : {})}
            wardrobeCount={wardrobe.length}
            weather={weather}
          />

          <StylistLandingControls
            desiredStyle={desiredStyle}
            favoriteColors={profile?.styleProfile.favoriteColors ?? []}
            fitPreferences={profile?.styleProfile.fitPreferences ?? []}
            occasion={occasion}
            onAdvanced={() =>
              navigation.navigate(STYLIST_ROUTES.OUTFIT_GOAL, {
                occasion,
                desiredStyle,
              })
            }
            onGenerate={generateStyle}
            onOccasionChange={setOccasionOverride}
            onStyleChange={setStyleOverride}
            onWeatherChange={setWeather}
            weather={weather}
          />

          {featuredRecommendation ? (
            <RecommendedLookSection
              onOpen={() => openLook(featuredRecommendation.outfit.id)}
              recommendation={featuredRecommendation}
            />
          ) : null}

          <AlternativeLooksSection onOpen={openLook} recommendations={alternatives} />

          <SavedLookDirectory
            looks={savedLooks.map((look) => look.recommendation)}
            onOpen={openLook}
          />
        </>
      )}
    </AppScreen>
  );
}

function toDisplayItem(item: {
  id: string;
  name: string;
  category: string;
  primaryColor: string | null;
  imageUrl: string | null;
}): OutfitDisplayItem {
  return {
    id: item.id,
    name: item.name,
    category: item.category,
    primaryColor: item.primaryColor,
    imageUrl: item.imageUrl,
  };
}

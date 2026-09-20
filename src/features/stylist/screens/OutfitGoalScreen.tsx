import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';

import { ActionButton } from '@/components/ActionButton';
import { AppScreen } from '@/components/ui/AppScreen';
import { SelectField } from '@/components/ui/SelectField';
import { EmptyState, ErrorState, SkeletonCard } from '@/components/ui/StateViews';
import { StylistEditorialHeader } from '@/features/stylist/components/StylistEditorial';
import { occasionOptions, preferredStyleOptions } from '@/features/profile/styleProfileOptions';
import { MAIN_ROUTES, STYLIST_ROUTES } from '@/navigation/routes';
import type { MainTabParamList, StylistStackParamList } from '@/navigation/types';

import { useStylistData } from '../useStylistData';

type Props = NativeStackScreenProps<StylistStackParamList, 'OutfitGoal'>;
const weatherOptions = ['Not set', 'Hot', 'Warm', 'Mild', 'Cool', 'Cold', 'Rainy'] as const;
const temperatureOptions = ['Not set', '15°C', '22°C', '30°C', '35°C'] as const;

export function OutfitGoalScreen({ navigation, route }: Props) {
  const { error, loading, ready, retry, wardrobe } = useStylistData();
  const [weather, setWeather] = useState('Not set');
  const [temperature, setTemperature] = useState('Not set');
  const occasion = route.params?.occasion ?? 'Everyday';
  const style = route.params?.desiredStyle ?? 'Smart Casual';
  const selectedItemId = route.params?.selectedItemId ?? '';
  const itemOptions = ['No specific item', ...wardrobe.map(itemLabel)];
  const selectedItem = wardrobe.find((item) => item.id === selectedItemId);
  const selectedLabel = selectedItem ? itemLabel(selectedItem) : 'No specific item';

  const openWardrobe = () =>
    navigation
      .getParent<BottomTabNavigationProp<MainTabParamList>>()
      ?.navigate(MAIN_ROUTES.WARDROBE_TAB);

  const continueToPreferences = () => {
    const numericTemperature =
      temperature === 'Not set' ? undefined : Number.parseInt(temperature, 10);
    navigation.navigate(STYLIST_ROUTES.OUTFIT_PREFERENCES, {
      request: {
        occasion,
        desiredStyle: [style],
        ...(weather === 'Not set' ? {} : { weather }),
        ...(numericTemperature === undefined ? {} : { temperature: numericTemperature }),
        ...(selectedItemId ? { selectedItems: [selectedItemId] } : {}),
      },
    });
  };

  return (
    <AppScreen hideHeader title="Style brief">
      <StylistEditorialHeader
        eyebrow="STYLE BRIEF · 01"
        meta="OCCASION · WEATHER · WARDROBE ANCHOR"
        onBack={navigation.goBack}
        title="Set the scene."
      />
      {loading ? (
        <SkeletonCard square />
      ) : error ? (
        <ErrorState
          action={{ label: 'Try again', onPress: retry }}
          message={error}
          square
          title="Wardrobe unavailable"
        />
      ) : ready && wardrobe.length === 0 ? (
        <EmptyState
          action={{ label: 'Add clothes', onPress: openWardrobe }}
          message="The engine needs wardrobe items before it can assemble a look."
          square
          title="Add clothes first"
        />
      ) : (
        <>
          <SelectField
            label="Occasion"
            onChange={(value) => navigation.setParams({ occasion: value })}
            options={occasionOptions}
            square
            value={occasion}
          />
          <SelectField
            label="Style / vibe"
            onChange={(value) => navigation.setParams({ desiredStyle: value })}
            options={preferredStyleOptions}
            square
            value={style}
          />
          <SelectField
            label="Weather"
            onChange={setWeather}
            options={weatherOptions}
            square
            value={weather}
          />
          <SelectField
            label="Temperature"
            onChange={setTemperature}
            options={temperatureOptions}
            square
            value={temperature}
          />
          <SelectField
            label="Item to style (optional)"
            onChange={(label) => {
              const selected = wardrobe.find((item) => itemLabel(item) === label);
              navigation.setParams({ selectedItemId: selected?.id ?? '' });
            }}
            options={itemOptions}
            square
            value={selectedLabel}
          />
          <ActionButton label="Continue to preferences" onPress={continueToPreferences} square />
        </>
      )}
    </AppScreen>
  );
}

function itemLabel(item: { id: string; name: string }): string {
  return `${item.name} · ${item.id.slice(0, 6)}`;
}

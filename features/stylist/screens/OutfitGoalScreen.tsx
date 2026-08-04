import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';

import { ActionButton } from '@/components/ActionButton';
import { AppScreen } from '@/components/ui/AppScreen';
import { SelectField } from '@/components/ui/SelectField';
import { DeferredNotice } from '@/components/ui/StateViews';
import { STYLIST_ROUTES } from '@/navigation/routes';
import type { StylistStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<StylistStackParamList, 'OutfitGoal'>;

export function OutfitGoalScreen({ navigation }: Props) {
  const [occasion, setOccasion] = useState('Everyday');
  const [style, setStyle] = useState('Smart casual');
  const [weather, setWeather] = useState('Mild');
  const [timeOfDay, setTimeOfDay] = useState('Daytime');
  const [comfort, setComfort] = useState('Balanced');

  return (
    <AppScreen
      onBack={navigation.goBack}
      subtitle="Describe the context for a future outfit request."
      title="What are we dressing for?"
    >
      <DeferredNotice>
        These selections create a local navigation brief only. They are not sent to an AI or stored.
      </DeferredNotice>
      <SelectField
        label="Occasion"
        onChange={setOccasion}
        options={['Everyday', 'Work', 'Dinner', 'Formal event', 'Travel', 'Weekend']}
        value={occasion}
      />
      <SelectField
        label="Style"
        onChange={setStyle}
        options={['Casual', 'Smart casual', 'Minimal', 'Streetwear', 'Formal', 'Vintage']}
        value={style}
      />
      <SelectField
        label="Weather"
        onChange={setWeather}
        options={['Hot', 'Warm', 'Mild', 'Cool', 'Cold', 'Rainy']}
        value={weather}
      />
      <SelectField
        label="Time of day"
        onChange={setTimeOfDay}
        options={['Morning', 'Daytime', 'Evening', 'Late night']}
        value={timeOfDay}
      />
      <SelectField
        label="Comfort level"
        onChange={setComfort}
        options={['Comfort first', 'Balanced', 'Polished first']}
        value={comfort}
      />
      <ActionButton
        label="Continue"
        onPress={() => navigation.navigate(STYLIST_ROUTES.OUTFIT_PREFERENCES, { occasion, style })}
      />
    </AppScreen>
  );
}

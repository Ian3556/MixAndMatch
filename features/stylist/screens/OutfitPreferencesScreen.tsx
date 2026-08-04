import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ActionButton } from '@/components/ActionButton';
import { AppScreen } from '@/components/ui/AppScreen';
import { Chip } from '@/components/ui/Chip';
import { SelectField } from '@/components/ui/SelectField';
import { DeferredNotice } from '@/components/ui/StateViews';
import { STYLIST_ROUTES } from '@/navigation/routes';
import type { StylistStackParamList } from '@/navigation/types';
import { useAppTheme, type AppTheme } from '@/theme';

type Props = NativeStackScreenProps<StylistStackParamList, 'OutfitPreferences'>;

export function OutfitPreferencesScreen({ navigation, route }: Props) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const [colors, setColors] = useState<string[]>(['Neutrals']);
  const [include, setInclude] = useState<string[]>([]);
  const [avoid, setAvoid] = useState<string[]>([]);
  const [formality, setFormality] = useState('Balanced');
  const [layering, setLayering] = useState('Optional');
  const [footwear, setFootwear] = useState('Any');
  const [accessories, setAccessories] = useState('Minimal');

  const toggle = (value: string, values: string[], setter: (next: string[]) => void) =>
    setter(values.includes(value) ? values.filter((item) => item !== value) : [...values, value]);

  return (
    <AppScreen
      onBack={navigation.goBack}
      subtitle={`${route.params.occasion} · ${route.params.style}`}
      title="Refine the outfit"
    >
      <DeferredNotice>
        Preferences remain on this screen only and are not interpreted by a recommendation engine.
      </DeferredNotice>
      <PreferenceChips
        label="Preferred colours"
        onPress={(value) => toggle(value, colors, setColors)}
        options={['Neutrals', 'Black', 'Blue', 'Green', 'Warm tones', 'Bright accent']}
        selected={colors}
        styles={styles}
      />
      <PreferenceChips
        label="Items to include"
        onPress={(value) => toggle(value, include, setInclude)}
        options={['Favourite jacket', 'Wide trousers', 'Loafers', 'Statement bag']}
        selected={include}
        styles={styles}
      />
      <PreferenceChips
        label="Items to avoid"
        onPress={(value) => toggle(value, avoid, setAvoid)}
        options={['Heels', 'Heavy layers', 'Bright colours', 'Formal tailoring']}
        selected={avoid}
        styles={styles}
      />
      <SelectField
        label="Formality"
        onChange={setFormality}
        options={['Relaxed', 'Balanced', 'Polished']}
        value={formality}
      />
      <SelectField
        label="Layering"
        onChange={setLayering}
        options={['Avoid', 'Optional', 'Preferred']}
        value={layering}
      />
      <SelectField
        label="Footwear"
        onChange={setFootwear}
        options={['Any', 'Trainers', 'Flats', 'Loafers', 'Boots', 'Heels']}
        value={footwear}
      />
      <SelectField
        label="Accessories"
        onChange={setAccessories}
        options={['None', 'Minimal', 'One statement piece', 'Layered']}
        value={accessories}
      />
      <ActionButton
        label="Preview generation state"
        onPress={() =>
          navigation.navigate(STYLIST_ROUTES.OUTFIT_GENERATING, {
            occasion: route.params.occasion,
            style: route.params.style,
          })
        }
      />
    </AppScreen>
  );
}

type PreferenceStyles = ReturnType<typeof createStyles>;

function PreferenceChips({
  label,
  options,
  selected,
  onPress,
  styles,
}: {
  label: string;
  options: readonly string[];
  selected: readonly string[];
  onPress: (value: string) => void;
  styles: PreferenceStyles;
}) {
  return (
    <View style={styles.group}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.chips}>
        {options.map((option) => (
          <Chip
            key={option}
            label={option}
            onPress={() => onPress(option)}
            selected={selected.includes(option)}
          />
        ))}
      </View>
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    group: { gap: theme.spacing.sm },
    label: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.semibold,
    },
    chips: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
  });
}

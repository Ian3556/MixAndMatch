import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ActionButton } from '@/components/ActionButton';
import { AppScreen } from '@/components/ui/AppScreen';
import { Chip } from '@/components/ui/Chip';
import { SelectField } from '@/components/ui/SelectField';
import {
  StylistEditorialHeader,
  StylistSectionHeading,
} from '@/features/stylist/components/StylistEditorial';
import { preferredStyleOptions } from '@/features/profile/styleProfileOptions';
import { STYLIST_ROUTES } from '@/navigation/routes';
import type { StylistStackParamList } from '@/navigation/types';
import { useAppTheme, type AppTheme } from '@/theme';

import { useStylistData } from '../useStylistData';

type Props = NativeStackScreenProps<StylistStackParamList, 'OutfitPreferences'>;
const formalityOptions = ['Relaxed', 'Balanced', 'Polished', 'Formal'] as const;
const formalityScores: Record<(typeof formalityOptions)[number], number> = {
  Relaxed: 2,
  Balanced: 5,
  Polished: 7,
  Formal: 10,
};

export function OutfitPreferencesScreen({ navigation, route }: Props) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const { wardrobe } = useStylistData();
  const [stylesWanted, setStylesWanted] = useState<string[]>(
    route.params.request.desiredStyle ?? [],
  );
  const [excludedItems, setExcludedItems] = useState<string[]>(
    route.params.request.excludedItems ?? [],
  );
  const [formality, setFormality] = useState<(typeof formalityOptions)[number]>(() =>
    initialFormality(route.params.request.occasion),
  );
  const selectedIds = new Set(route.params.request.selectedItems ?? []);

  const toggle = (value: string, values: string[], setter: (next: string[]) => void) =>
    setter(values.includes(value) ? values.filter((item) => item !== value) : [...values, value]);

  const request = {
    ...route.params.request,
    desiredStyle: stylesWanted,
    formality: formalityScores[formality],
    ...(excludedItems.length > 0 ? { excludedItems } : {}),
  };

  return (
    <AppScreen hideHeader title="Outfit preferences">
      <StylistEditorialHeader
        eyebrow="STYLE BRIEF · 02"
        meta={`${route.params.request.occasion ?? 'Any occasion'} · ${route.params.request.weather ?? 'Any weather'}`}
        onBack={navigation.goBack}
        title="Refine the edit."
      />
      <StylistSectionHeading eyebrow="CHOOSE YOUR VIBE" title="Layer the style signals." />
      <PreferenceChips
        label="Style signals"
        onPress={(value) => toggle(value, stylesWanted, setStylesWanted)}
        options={preferredStyleOptions}
        selected={stylesWanted}
        styles={styles}
      />
      <SelectField
        label="Formality"
        onChange={(value) => setFormality(value as (typeof formalityOptions)[number])}
        options={formalityOptions}
        square
        value={formality}
      />
      <View style={styles.group}>
        <Text style={styles.label}>Exclude items from this request</Text>
        <Text style={styles.helper}>Explicit exclusions are hard constraints.</Text>
        <View style={styles.chips}>
          {wardrobe
            .filter((item) => !selectedIds.has(item.id))
            .slice(0, 30)
            .map((item) => (
              <Chip
                key={item.id}
                label={item.name}
                onPress={() => toggle(item.id, excludedItems, setExcludedItems)}
                selected={excludedItems.includes(item.id)}
                square
              />
            ))}
        </View>
      </View>
      <ActionButton
        label="Generate style"
        onPress={() => navigation.navigate(STYLIST_ROUTES.OUTFIT_GENERATING, { request })}
        square
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
            square
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
    helper: { color: theme.colors.textMuted, fontSize: theme.typography.fontSize.xs },
    chips: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
  });
}

function initialFormality(occasion: string | undefined): (typeof formalityOptions)[number] {
  const normalized = occasion?.toLowerCase();
  if (normalized === 'formal' || normalized === 'events') return 'Formal';
  if (normalized === 'work' || normalized === 'dinner' || normalized === 'party') return 'Polished';
  if (normalized === 'everyday' || normalized === 'university' || normalized === 'travel') {
    return 'Relaxed';
  }
  return 'Balanced';
}

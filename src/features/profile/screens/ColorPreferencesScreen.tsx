import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import { ActionButton } from '@/components/ActionButton';
import { AppScreen } from '@/components/ui/AppScreen';
import {
  PreferenceChoiceGroup,
  togglePreference,
} from '@/features/profile/components/PreferenceChoiceGroup';
import { ProfileSaveFeedback } from '@/features/profile/components/ProfileSaveFeedback';
import { ProfileFormSkeleton } from '@/features/profile/components/ProfileSkeletons';
import { colorOptions } from '@/features/profile/styleProfileOptions';
import { useStyleProfileSave } from '@/features/profile/useStyleProfileSave';
import type { ProfileStackParamList } from '@/navigation/types';
import { useAppTheme, type AppTheme } from '@/theme';

type Props = NativeStackScreenProps<ProfileStackParamList, 'ColorPreferences'>;
const options = colorOptions.map((color) => color.name);

export function ColorPreferencesScreen({ navigation }: Props) {
  const styles = createStyles(useAppTheme());
  const { error, isSaved, isSubmitting, markDirty, profile, save } = useStyleProfileSave();
  const [favoriteDraft, setFavoriteDraft] = useState<string[] | null>(null);
  const [avoidDraft, setAvoidDraft] = useState<string[] | null>(null);
  const favorite = favoriteDraft ?? profile?.styleProfile.favoriteColors ?? [];
  const avoid = avoidDraft ?? profile?.styleProfile.avoidColors ?? [];

  const toggleFavorite = (value: string) => {
    setFavoriteDraft(togglePreference(favorite, value));
    setAvoidDraft(avoid.filter((color) => color !== value));
    markDirty();
  };

  const toggleAvoid = (value: string) => {
    setAvoidDraft(togglePreference(avoid, value));
    setFavoriteDraft(favorite.filter((color) => color !== value));
    markDirty();
  };

  return (
    <AppScreen onBack={navigation.goBack} title="COLOR">
      {!profile ? (
        <ProfileFormSkeleton rows={2} />
      ) : (
        <>
          {favorite.length === 0 ? (
            <Text style={styles.empty}>No favorite colors added.</Text>
          ) : null}
          <PreferenceChoiceGroup
            colors
            label="Favorite"
            onToggle={toggleFavorite}
            options={options}
            selected={favorite}
          />
          {avoid.length === 0 ? <Text style={styles.empty}>No colors to avoid added.</Text> : null}
          <PreferenceChoiceGroup
            colors
            label="Avoid"
            onToggle={toggleAvoid}
            options={options}
            selected={avoid}
          />
          <ProfileSaveFeedback error={error} isSaved={isSaved} />
          <ActionButton
            label="Save"
            loading={isSubmitting}
            onPress={() =>
              void save({ ...profile.styleProfile, favoriteColors: favorite, avoidColors: avoid })
            }
          />
        </>
      )}
    </AppScreen>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    empty: {
      color: theme.colors.textMuted,
      fontSize: theme.typography.fontSize.sm,
      lineHeight: theme.typography.lineHeight.sm,
    },
  });
}

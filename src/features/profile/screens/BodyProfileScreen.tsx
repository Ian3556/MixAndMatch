import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ActionButton } from '@/components/ActionButton';
import { ErrorBanner } from '@/components/ErrorBanner';
import { FormTextInput } from '@/components/FormTextInput';
import { AppScreen } from '@/components/ui/AppScreen';
import { PreferenceChoiceGroup } from '@/features/profile/components/PreferenceChoiceGroup';
import { ProfileSaveFeedback } from '@/features/profile/components/ProfileSaveFeedback';
import { ProfileFormSkeleton } from '@/features/profile/components/ProfileSkeletons';
import {
  bodyTypeOptions,
  faceShapeOptions,
  skinToneOptions,
  undertoneOptions,
} from '@/features/profile/styleProfileOptions';
import { useStyleProfileSave } from '@/features/profile/useStyleProfileSave';
import type { ProfileStackParamList } from '@/navigation/types';
import { useAppTheme, type AppTheme } from '@/theme';
import type { BodyProfile } from '@/types/profile';
import { createEmptyStyleProfile } from '@/types/profile';

type Props = NativeStackScreenProps<ProfileStackParamList, 'BodyProfile'>;
type BodyChoiceKey = 'faceShape' | 'bodyType' | 'skinTone' | 'skinUndertone';

export function BodyProfileScreen({ navigation }: Props) {
  const styles = createStyles(useAppTheme());
  const { error, isSaved, isSubmitting, markDirty, profile, save } = useStyleProfileSave();
  const [bodyDraft, setBodyDraft] = useState<BodyProfile | null>(null);
  const [heightCmDraft, setHeightCmDraft] = useState<string | null>(null);
  const [weightKgDraft, setWeightKgDraft] = useState<string | null>(null);
  const [measurementError, setMeasurementError] = useState<string | null>(null);
  const body = bodyDraft ?? profile?.styleProfile.body ?? createEmptyStyleProfile().body;
  const heightCm = heightCmDraft ?? toInputValue(profile?.styleProfile.body.heightCm);
  const weightKg = weightKgDraft ?? toInputValue(profile?.styleProfile.body.weightKg);

  const updateChoice = (field: BodyChoiceKey, value: string) => {
    setBodyDraft({ ...body, [field]: body[field] === value ? null : value });
    markDirty();
  };

  const saveBody = async () => {
    if (!profile) return;
    const height = parseMeasurement(heightCm, 80, 250);
    const weight = parseMeasurement(weightKg, 25, 350);
    if (height === undefined || weight === undefined) {
      setMeasurementError('Check height and weight, or leave them blank.');
      return;
    }
    setMeasurementError(null);
    await save({
      ...profile.styleProfile,
      body: { ...body, heightCm: height, weightKg: weight },
    });
  };

  return (
    <AppScreen onBack={navigation.goBack} title="BODY PROFILE">
      {!profile ? (
        <ProfileFormSkeleton />
      ) : (
        <>
          <PreferenceChoiceGroup
            label="Face Shape"
            onToggle={(value) => updateChoice('faceShape', value)}
            options={faceShapeOptions}
            selected={body.faceShape ? [body.faceShape] : []}
          />
          <PreferenceChoiceGroup
            label="Body Type"
            onToggle={(value) => updateChoice('bodyType', value)}
            options={bodyTypeOptions}
            selected={body.bodyType ? [body.bodyType] : []}
          />
          <View style={styles.measurements}>
            <View style={styles.measurementField}>
              <FormTextInput
                keyboardType="decimal-pad"
                label="Height (cm)"
                maxLength={6}
                onChangeText={(value) => {
                  setHeightCmDraft(value);
                  markDirty();
                }}
                value={heightCm}
              />
            </View>
            <View style={styles.measurementField}>
              <FormTextInput
                keyboardType="decimal-pad"
                label="Weight (kg)"
                maxLength={6}
                onChangeText={(value) => {
                  setWeightKgDraft(value);
                  markDirty();
                }}
                value={weightKg}
              />
            </View>
          </View>
          <PreferenceChoiceGroup
            label="Skin Tone"
            onToggle={(value) => updateChoice('skinTone', value)}
            options={skinToneOptions}
            selected={body.skinTone ? [body.skinTone] : []}
          />
          <PreferenceChoiceGroup
            label="Skin Undertone"
            onToggle={(value) => updateChoice('skinUndertone', value)}
            options={undertoneOptions}
            selected={body.skinUndertone ? [body.skinUndertone] : []}
          />
          {measurementError ? <ErrorBanner message={measurementError} /> : null}
          <ProfileSaveFeedback error={error} isSaved={isSaved} />
          <ActionButton label="Save" loading={isSubmitting} onPress={() => void saveBody()} />
        </>
      )}
    </AppScreen>
  );
}

function toInputValue(value: number | null | undefined): string {
  return value ? String(value) : '';
}

function parseMeasurement(
  value: string,
  minimum: number,
  maximum: number,
): number | null | undefined {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const measurement = Number(trimmed);
  if (!Number.isFinite(measurement) || measurement < minimum || measurement > maximum) {
    return undefined;
  }
  return Math.round(measurement * 10) / 10;
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    measurements: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.md },
    measurementField: { flex: 1, minWidth: 180 },
  });
}

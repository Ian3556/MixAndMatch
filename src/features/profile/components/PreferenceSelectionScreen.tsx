import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import { ActionButton } from '@/components/ActionButton';
import { AppScreen } from '@/components/ui/AppScreen';
import { useAppTheme, type AppTheme } from '@/theme';
import { useStyleProfileSave } from '../useStyleProfileSave';
import { PreferenceChoiceGroup, togglePreference } from './PreferenceChoiceGroup';
import { ProfileSaveFeedback } from './ProfileSaveFeedback';
import { ProfileFormSkeleton } from './ProfileSkeletons';

type ArrayPreferenceKey = 'preferredStyles' | 'occasions' | 'fitPreferences';

type PreferenceSelectionScreenProps = {
  emptyMessage: string;
  field: ArrayPreferenceKey;
  navigation: { goBack: () => void };
  options: readonly string[];
  title: string;
};

export function PreferenceSelectionScreen({
  emptyMessage,
  field,
  navigation,
  options,
  title,
}: PreferenceSelectionScreenProps) {
  const styles = createStyles(useAppTheme());
  const { error, isSaved, isSubmitting, markDirty, profile, save } = useStyleProfileSave();
  const [selectionDraft, setSelectionDraft] = useState<string[] | null>(null);
  const selected = selectionDraft ?? profile?.styleProfile[field] ?? [];

  const toggle = (value: string) => {
    setSelectionDraft(togglePreference(selected, value));
    markDirty();
  };

  return (
    <AppScreen onBack={navigation.goBack} title={title}>
      {!profile ? (
        <ProfileFormSkeleton rows={2} />
      ) : (
        <>
          {selected.length === 0 ? <Text style={styles.empty}>{emptyMessage}</Text> : null}
          <PreferenceChoiceGroup onToggle={toggle} options={options} selected={selected} />
          <ProfileSaveFeedback error={error} isSaved={isSaved} />
          <ActionButton
            label="Save"
            loading={isSubmitting}
            onPress={() => void save({ ...profile.styleProfile, [field]: selected })}
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

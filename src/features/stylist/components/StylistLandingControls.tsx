import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { ActionButton } from '@/components/ActionButton';
import { SelectField } from '@/components/ui/SelectField';
import { useAppTheme, type AppTheme } from '@/theme';

import { EditorialChoiceGrid, StylistSectionHeading } from './StylistEditorial';

export const vibeOptions = [
  'Minimalist',
  'Smart Casual',
  'Streetwear',
  'Casual',
  'Formal',
  'Quiet Luxury',
  'Vintage',
  'Old Money',
] as const;

export const stylistOccasionOptions = [
  'Everyday',
  'Work',
  'University',
  'Date',
  'Dinner',
  'Travel',
  'Party',
] as const;

export const stylistWeatherOptions = ['Hot', 'Warm', 'Mild', 'Cool', 'Cold', 'Rainy'] as const;

type Props = {
  desiredStyle: string;
  occasion: string;
  weather: string;
  favoriteColors: readonly string[];
  fitPreferences: readonly string[];
  onStyleChange: (value: string) => void;
  onOccasionChange: (value: string) => void;
  onWeatherChange: (value: string) => void;
  onAdvanced: () => void;
  onGenerate: () => void;
};

export function StylistLandingControls({
  desiredStyle,
  occasion,
  weather,
  favoriteColors,
  fitPreferences,
  onStyleChange,
  onOccasionChange,
  onWeatherChange,
  onAdvanced,
  onGenerate,
}: Props) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const { width } = useWindowDimensions();

  return (
    <>
      <View style={styles.section}>
        <StylistSectionHeading eyebrow="01 · CHOOSE YOUR VIBE" title="Set the point of view." />
        <EditorialChoiceGrid
          label="Choose your vibe"
          onSelect={onStyleChange}
          options={vibeOptions}
          selected={desiredStyle}
        />
      </View>

      <View style={styles.section}>
        <StylistSectionHeading eyebrow="02 · OCCASION / CONTEXT" title="Name the setting." />
        <View style={[styles.contextGrid, width >= 720 ? styles.contextGridWide : null]}>
          <View style={styles.contextField}>
            <SelectField
              label="Occasion"
              onChange={onOccasionChange}
              options={stylistOccasionOptions}
              square
              value={occasion}
            />
          </View>
          <View style={styles.contextField}>
            <SelectField
              label="Weather"
              onChange={onWeatherChange}
              options={stylistWeatherOptions}
              square
              value={weather}
            />
          </View>
        </View>
        <View style={styles.profileContext}>
          <ContextRow
            label="Preferred colors"
            value={profileValue(favoriteColors)}
            styles={styles}
          />
          <ContextRow label="Fit preference" value={profileValue(fitPreferences)} styles={styles} />
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={onAdvanced}
          style={({ pressed }) => [styles.textAction, pressed ? styles.pressed : null]}
        >
          <Text style={styles.textActionLabel}>ADD AN ITEM OR EXTRA CONSTRAINTS →</Text>
        </Pressable>
      </View>

      <View style={styles.generateSection}>
        <Text style={styles.kicker}>03 · GENERATE STYLE</Text>
        <ActionButton label="Generate style" onPress={onGenerate} square />
      </View>
    </>
  );
}

type Styles = ReturnType<typeof createStyles>;

function ContextRow({ label, value, styles }: { label: string; value: string; styles: Styles }) {
  return (
    <View style={styles.contextRow}>
      <Text style={styles.contextLabel}>{label}</Text>
      <Text numberOfLines={1} style={styles.contextValue}>
        {value}
      </Text>
    </View>
  );
}

function profileValue(values: readonly string[]): string {
  return values.length > 0 ? values.slice(0, 3).join(' · ') : 'Not set';
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    section: { gap: theme.spacing.lg },
    contextGrid: { gap: theme.spacing.md },
    contextGridWide: { flexDirection: 'row' },
    contextField: { flex: 1, minWidth: 220 },
    profileContext: {
      borderTopColor: theme.colors.border,
      borderTopWidth: StyleSheet.hairlineWidth,
    },
    contextRow: {
      alignItems: 'center',
      borderBottomColor: theme.colors.border,
      borderBottomWidth: StyleSheet.hairlineWidth,
      flexDirection: 'row',
      gap: theme.spacing.md,
      minHeight: 52,
    },
    contextLabel: {
      color: theme.colors.textMuted,
      fontSize: theme.typography.fontSize.xs,
      letterSpacing: 1,
      textTransform: 'uppercase',
      width: 126,
    },
    contextValue: {
      color: theme.colors.text,
      flex: 1,
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.sm,
      textTransform: 'capitalize',
    },
    textAction: { alignSelf: 'flex-start', justifyContent: 'center', minHeight: 44 },
    textActionLabel: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.xs,
      fontWeight: theme.typography.fontWeight.semibold,
      letterSpacing: 1,
    },
    generateSection: {
      borderBottomColor: theme.colors.text,
      borderBottomWidth: 1,
      borderTopColor: theme.colors.text,
      borderTopWidth: 1,
      gap: theme.spacing.md,
      paddingVertical: theme.spacing.lg,
    },
    kicker: {
      color: theme.colors.primary,
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.xs,
      fontWeight: theme.typography.fontWeight.semibold,
      letterSpacing: 1.5,
    },
    pressed: { opacity: 0.62 },
  });
}

import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { useAppTheme, type AppTheme } from '@/theme';

type HeaderProps = {
  eyebrow: string;
  title: string;
  meta?: string;
  onBack?: () => void;
  action?: ReactNode;
};

export function StylistEditorialHeader({ eyebrow, title, meta, onBack, action }: HeaderProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const { width } = useWindowDimensions();

  return (
    <View style={styles.header}>
      <View style={styles.headerRail}>
        {onBack ? (
          <Pressable
            accessibilityLabel="Go back"
            accessibilityRole="button"
            hitSlop={8}
            onPress={onBack}
            style={({ pressed }) => [styles.backAction, pressed ? styles.pressed : null]}
          >
            <Text style={styles.backLabel}>← BACK</Text>
          </Pressable>
        ) : (
          <Text style={styles.eyebrow}>{eyebrow}</Text>
        )}
        {onBack ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
        {action}
      </View>
      <Text
        accessibilityRole="header"
        style={[styles.headerTitle, width < 390 ? styles.headerTitleCompact : null]}
      >
        {title}
      </Text>
      {meta ? <Text style={styles.meta}>{meta}</Text> : null}
    </View>
  );
}

type SectionHeadingProps = {
  eyebrow: string;
  title?: string;
  action?: ReactNode;
};

export function StylistSectionHeading({ eyebrow, title, action }: SectionHeadingProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.sectionHeading}>
      <View style={styles.sectionCopy}>
        <Text style={styles.eyebrow}>{eyebrow}</Text>
        {title ? <Text style={styles.sectionTitle}>{title}</Text> : null}
      </View>
      {action}
    </View>
  );
}

type ChoiceGridProps = {
  label: string;
  options: readonly string[];
  selected: string;
  onSelect: (option: string) => void;
};

export function EditorialChoiceGrid({ label, options, selected, onSelect }: ChoiceGridProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <View accessibilityLabel={label} accessibilityRole="radiogroup" style={styles.choiceGrid}>
      {options.map((option, index) => {
        const isSelected = selected === option;
        return (
          <Pressable
            accessibilityRole="radio"
            accessibilityState={{ checked: isSelected }}
            key={option}
            onPress={() => onSelect(option)}
            style={({ pressed }) => [
              styles.choice,
              isSelected ? styles.choiceSelected : null,
              pressed ? styles.pressed : null,
            ]}
          >
            <Text style={styles.choiceIndex}>{String(index + 1).padStart(2, '0')}</Text>
            <Text style={[styles.choiceLabel, isSelected ? styles.choiceLabelSelected : null]}>
              {option}
            </Text>
            <Text style={styles.choiceCheck}>{isSelected ? '✓' : ''}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function StylistEditorialSkeleton() {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <View accessibilityLabel="Styling content loading" style={styles.skeletonLayout}>
      <View style={styles.skeletonHero} />
      <View style={styles.skeletonCopy}>
        <View style={styles.skeletonEyebrow} />
        <View style={styles.skeletonTitle} />
        <View style={styles.skeletonTitleShort} />
        <View style={styles.skeletonRule} />
      </View>
    </View>
  );
}

export function StylistNotice({ children }: { children: string }) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  return (
    <View accessibilityLiveRegion="polite" style={styles.notice}>
      <Text style={styles.noticeText}>{children}</Text>
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    header: {
      borderBottomColor: theme.colors.text,
      borderBottomWidth: 1,
      gap: theme.spacing.md,
      paddingBottom: theme.spacing.lg,
    },
    headerRail: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: theme.spacing.md,
      justifyContent: 'space-between',
      minHeight: 28,
    },
    backAction: { justifyContent: 'center', minHeight: 44 },
    backLabel: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.xs,
      fontWeight: theme.typography.fontWeight.semibold,
      letterSpacing: 1.4,
    },
    eyebrow: {
      color: theme.colors.primary,
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.xs,
      fontWeight: theme.typography.fontWeight.semibold,
      letterSpacing: 1.8,
      lineHeight: theme.typography.lineHeight.xs,
      textTransform: 'uppercase',
    },
    headerTitle: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.editorial,
      fontSize: 52,
      fontWeight: theme.typography.fontWeight.regular,
      letterSpacing: -1.8,
      lineHeight: 56,
      maxWidth: 760,
    },
    headerTitleCompact: { fontSize: 42, lineHeight: 46 },
    meta: {
      color: theme.colors.textMuted,
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.xs,
      letterSpacing: 1.2,
      lineHeight: theme.typography.lineHeight.xs,
      textTransform: 'uppercase',
    },
    sectionHeading: {
      alignItems: 'flex-end',
      borderTopColor: theme.colors.border,
      borderTopWidth: StyleSheet.hairlineWidth,
      flexDirection: 'row',
      gap: theme.spacing.md,
      justifyContent: 'space-between',
      paddingTop: theme.spacing.md,
    },
    sectionCopy: { flex: 1, gap: theme.spacing.xs },
    sectionTitle: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.editorial,
      fontSize: theme.typography.fontSize.xxl,
      fontWeight: theme.typography.fontWeight.regular,
      letterSpacing: -0.7,
      lineHeight: theme.typography.lineHeight.xxl,
    },
    choiceGrid: {
      borderTopColor: theme.colors.border,
      borderTopWidth: StyleSheet.hairlineWidth,
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    choice: {
      alignItems: 'center',
      borderBottomColor: theme.colors.border,
      borderBottomWidth: StyleSheet.hairlineWidth,
      flexDirection: 'row',
      gap: theme.spacing.sm,
      minHeight: 54,
      paddingHorizontal: theme.spacing.sm,
      width: '50%',
    },
    choiceSelected: { backgroundColor: theme.colors.primarySoft },
    choiceIndex: {
      color: theme.colors.textMuted,
      fontSize: theme.typography.fontSize.xs,
      fontVariant: ['tabular-nums'],
      width: 22,
    },
    choiceLabel: {
      color: theme.colors.text,
      flex: 1,
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.sm,
    },
    choiceLabelSelected: { color: theme.colors.primary, fontWeight: '600' },
    choiceCheck: { color: theme.colors.primary, fontSize: theme.typography.fontSize.sm, width: 16 },
    skeletonLayout: {
      alignItems: 'stretch',
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.lg,
    },
    skeletonHero: {
      aspectRatio: 4 / 5,
      backgroundColor: theme.colors.surfaceMuted,
      flexGrow: 2,
      minWidth: 240,
    },
    skeletonCopy: {
      flexGrow: 1,
      gap: theme.spacing.md,
      justifyContent: 'center',
      minWidth: 220,
    },
    skeletonEyebrow: { backgroundColor: theme.colors.surfaceMuted, height: 10, width: 94 },
    skeletonTitle: { backgroundColor: theme.colors.surfaceMuted, height: 34, width: '100%' },
    skeletonTitleShort: { backgroundColor: theme.colors.surfaceMuted, height: 34, width: '68%' },
    skeletonRule: {
      backgroundColor: theme.colors.surfaceMuted,
      height: 1,
      marginTop: theme.spacing.md,
      width: '100%',
    },
    notice: {
      borderLeftColor: theme.colors.primary,
      borderLeftWidth: 3,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
    },
    noticeText: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSize.sm,
      lineHeight: theme.typography.lineHeight.sm,
    },
    pressed: { opacity: 0.62 },
  });
}

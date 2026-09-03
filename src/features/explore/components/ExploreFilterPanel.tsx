import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppTheme, type AppTheme } from '@/theme';

import {
  EXPLORE_CATEGORY_OPTIONS,
  EXPLORE_STYLE_OPTIONS,
  type ExploreCategoryId,
  type ExploreStyle,
} from '../types/discovery';

type Props = {
  visible: boolean;
  categoryIds: readonly ExploreCategoryId[];
  styles: readonly ExploreStyle[];
  resultCount: number;
  onToggleCategory: (categoryId: ExploreCategoryId) => void;
  onToggleStyle: (style: ExploreStyle) => void;
  onClear: () => void;
  onApply: () => void;
  onDismiss: () => void;
};

export function ExploreFilterPanel({
  visible,
  categoryIds,
  styles: selectedStyles,
  resultCount,
  onToggleCategory,
  onToggleStyle,
  onClear,
  onApply,
  onDismiss,
}: Props) {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <Modal
      animationType="slide"
      onRequestClose={onDismiss}
      presentationStyle="overFullScreen"
      transparent
      visible={visible}
    >
      <Pressable
        accessibilityLabel="Dismiss Explore filters"
        accessibilityRole="button"
        onPress={onDismiss}
        style={styles.backdrop}
      >
        <SafeAreaView edges={['bottom']} style={styles.safeArea}>
          <Pressable
            accessibilityRole="none"
            onPress={(event) => event.stopPropagation()}
            style={styles.panel}
          >
            <View style={styles.header}>
              <View>
                <Text style={styles.eyebrow}>REFINE DISCOVERY</Text>
                <Text accessibilityRole="header" style={styles.title}>
                  Filter
                </Text>
              </View>
              <Pressable
                accessibilityLabel="Close Explore filters"
                accessibilityRole="button"
                onPress={onDismiss}
                style={({ pressed }) => [styles.textButton, pressed ? styles.pressed : null]}
              >
                <Text style={styles.textButtonLabel}>Close</Text>
              </Pressable>
            </View>

            <ScrollView contentContainerStyle={styles.sections}>
              <FilterSection title="Categories">
                {EXPLORE_CATEGORY_OPTIONS.map((option) => (
                  <FilterOption
                    key={option.id}
                    label={option.label}
                    onPress={() => onToggleCategory(option.id)}
                    selected={categoryIds.includes(option.id)}
                    styles={styles}
                  />
                ))}
              </FilterSection>

              <FilterSection title="Style">
                {EXPLORE_STYLE_OPTIONS.map((style) => (
                  <FilterOption
                    key={style}
                    label={style}
                    onPress={() => onToggleStyle(style)}
                    selected={selectedStyles.includes(style)}
                    styles={styles}
                  />
                ))}
              </FilterSection>
            </ScrollView>

            <View style={styles.actions}>
              <Pressable
                accessibilityRole="button"
                onPress={onClear}
                style={({ pressed }) => [styles.clearButton, pressed ? styles.pressed : null]}
              >
                <Text style={styles.clearLabel}>Clear all</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                onPress={onApply}
                style={({ pressed }) => [styles.applyButton, pressed ? styles.pressed : null]}
              >
                <Text style={styles.applyLabel}>
                  Show {resultCount} {resultCount === 1 ? 'look' : 'looks'}
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </SafeAreaView>
      </Pressable>
    </Modal>
  );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.options}>{children}</View>
    </View>
  );
}

function FilterOption({
  label,
  selected,
  onPress,
  styles,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  styles: ReturnType<typeof createStyles>;
}) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.option,
        selected ? styles.optionSelected : null,
        pressed ? styles.pressed : null,
      ]}
    >
      <View style={[styles.checkbox, selected ? styles.checkboxSelected : null]}>
        <Text style={styles.checkmark}>{selected ? '✓' : ''}</Text>
      </View>
      <Text style={[styles.optionLabel, selected ? styles.optionLabelSelected : null]}>
        {label}
      </Text>
    </Pressable>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    backdrop: {
      backgroundColor: theme.colors.overlay,
      flex: 1,
      justifyContent: 'flex-end',
    },
    safeArea: { width: '100%' },
    panel: {
      alignSelf: 'center',
      backgroundColor: theme.colors.surfaceElevated,
      borderColor: theme.colors.border,
      borderTopWidth: 1,
      maxHeight: '88%',
      maxWidth: 620,
      paddingHorizontal: theme.spacing.md,
      paddingTop: theme.spacing.lg,
      width: '100%',
    },
    header: {
      alignItems: 'flex-start',
      borderBottomColor: theme.colors.border,
      borderBottomWidth: StyleSheet.hairlineWidth,
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingBottom: theme.spacing.md,
    },
    eyebrow: {
      color: theme.colors.textMuted,
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.xs,
      fontWeight: theme.typography.fontWeight.semibold,
      letterSpacing: 1.5,
      lineHeight: theme.typography.lineHeight.xs,
    },
    title: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.editorial,
      fontSize: 36,
      lineHeight: 42,
    },
    textButton: { justifyContent: 'center', minHeight: 44, paddingHorizontal: theme.spacing.sm },
    textButtonLabel: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.semibold,
    },
    sections: { gap: theme.spacing.xl, paddingVertical: theme.spacing.lg },
    section: { gap: theme.spacing.md },
    sectionTitle: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.semibold,
      letterSpacing: 0.8,
      textTransform: 'uppercase',
    },
    options: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
    option: {
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
      borderWidth: 1,
      flexDirection: 'row',
      gap: theme.spacing.sm,
      minHeight: 46,
      paddingHorizontal: theme.spacing.md,
    },
    optionSelected: {
      backgroundColor: theme.colors.primarySoft,
      borderColor: theme.colors.primary,
    },
    checkbox: {
      alignItems: 'center',
      borderColor: theme.colors.textMuted,
      borderWidth: 1,
      height: 18,
      justifyContent: 'center',
      width: 18,
    },
    checkboxSelected: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
    checkmark: { color: theme.colors.surface, fontSize: 12, lineHeight: 14 },
    optionLabel: {
      color: theme.colors.textMuted,
      fontFamily: theme.typography.fontFamily.regular,
      fontSize: theme.typography.fontSize.sm,
    },
    optionLabelSelected: { color: theme.colors.text },
    actions: {
      borderTopColor: theme.colors.border,
      borderTopWidth: StyleSheet.hairlineWidth,
      flexDirection: 'row',
      gap: theme.spacing.sm,
      paddingVertical: theme.spacing.md,
    },
    clearButton: {
      alignItems: 'center',
      borderColor: theme.colors.border,
      borderWidth: 1,
      flex: 1,
      justifyContent: 'center',
      minHeight: 50,
      paddingHorizontal: theme.spacing.md,
    },
    clearLabel: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.medium,
      fontWeight: theme.typography.fontWeight.semibold,
    },
    applyButton: {
      alignItems: 'center',
      backgroundColor: theme.colors.text,
      flex: 1.6,
      justifyContent: 'center',
      minHeight: 50,
      paddingHorizontal: theme.spacing.md,
    },
    applyLabel: {
      color: theme.colors.background,
      fontFamily: theme.typography.fontFamily.medium,
      fontWeight: theme.typography.fontWeight.semibold,
    },
    pressed: { opacity: 0.68 },
  });
}

import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppTheme, type AppTheme } from '@/theme';

type OptionSheetProps = {
  visible: boolean;
  title: string;
  options: readonly string[];
  selected?: string;
  onSelect: (option: string) => void;
  onDismiss: () => void;
};

export function OptionSheet({
  visible,
  title,
  options,
  selected,
  onSelect,
  onDismiss,
}: OptionSheetProps) {
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
        accessibilityLabel="Dismiss selection"
        accessibilityRole="button"
        onPress={onDismiss}
        style={styles.backdrop}
      >
        <SafeAreaView edges={['bottom']} style={styles.sheet}>
          <Pressable accessibilityRole="none" onPress={(event) => event.stopPropagation()}>
            <View style={styles.header}>
              <Text accessibilityRole="header" style={styles.title}>
                {title}
              </Text>
              <Pressable accessibilityRole="button" onPress={onDismiss} style={styles.close}>
                <Text style={styles.closeLabel}>Close</Text>
              </Pressable>
            </View>
            {options.map((option) => (
              <Pressable
                accessibilityRole="radio"
                accessibilityState={{ checked: selected === option }}
                key={option}
                onPress={() => onSelect(option)}
                style={({ pressed }) => [styles.option, pressed ? styles.pressed : null]}
              >
                <Text style={styles.optionLabel}>{option}</Text>
                <Text style={styles.selection}>{selected === option ? '✓' : ''}</Text>
              </Pressable>
            ))}
          </Pressable>
        </SafeAreaView>
      </Pressable>
    </Modal>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    backdrop: {
      backgroundColor: theme.colors.overlay,
      flex: 1,
      justifyContent: 'flex-end',
    },
    sheet: {
      backgroundColor: theme.colors.surfaceElevated,
      borderTopLeftRadius: theme.radii.xl,
      borderTopRightRadius: theme.radii.xl,
      maxHeight: '82%',
      padding: theme.spacing.md,
    },
    header: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.sm,
      minHeight: 48,
    },
    title: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.bold,
      fontSize: theme.typography.fontSize.lg,
      fontWeight: theme.typography.fontWeight.bold,
    },
    close: { justifyContent: 'center', minHeight: 44, paddingHorizontal: theme.spacing.sm },
    closeLabel: { color: theme.colors.primary, fontWeight: theme.typography.fontWeight.semibold },
    option: {
      alignItems: 'center',
      borderBottomColor: theme.colors.border,
      borderBottomWidth: StyleSheet.hairlineWidth,
      flexDirection: 'row',
      minHeight: 52,
      paddingHorizontal: theme.spacing.sm,
    },
    optionLabel: { color: theme.colors.text, flex: 1, fontSize: theme.typography.fontSize.md },
    selection: { color: theme.colors.primary, fontWeight: theme.typography.fontWeight.bold },
    pressed: { backgroundColor: theme.colors.surfaceMuted },
  });
}

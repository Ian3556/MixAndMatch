import Ionicons from '@expo/vector-icons/Ionicons';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppTheme, type AppTheme } from '@/theme';

type Props = {
  visible: boolean;
  onDismiss: () => void;
  onBrowse: () => void;
  onImport: () => void;
  onManual: () => void;
};

export function AddWardrobeItemMenu({ visible, onDismiss, onBrowse, onImport, onManual }: Props) {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  const choose = (action: () => void) => {
    onDismiss();
    action();
  };

  return (
    <Modal
      animationType="slide"
      onRequestClose={onDismiss}
      presentationStyle="overFullScreen"
      transparent
      visible={visible}
    >
      <Pressable
        accessibilityLabel="Dismiss add clothes menu"
        accessibilityRole="button"
        onPress={onDismiss}
        style={styles.backdrop}
      >
        <SafeAreaView edges={['bottom']} style={styles.sheet}>
          <Pressable accessibilityRole="none" onPress={(event) => event.stopPropagation()}>
            <View accessibilityViewIsModal style={styles.content}>
              <View style={styles.header}>
                <Text accessibilityRole="header" style={styles.title}>
                  Add clothes
                </Text>
                <Pressable
                  accessibilityLabel="Close add clothes menu"
                  accessibilityRole="button"
                  hitSlop={8}
                  onPress={onDismiss}
                  style={({ pressed }) => [styles.closeButton, pressed ? styles.pressed : null]}
                >
                  <Ionicons color={theme.colors.text} name="close-outline" size={24} />
                </Pressable>
              </View>

              <MenuOption
                description="Browse verified products in the shared catalog"
                icon="storefront-outline"
                label="Browse brands"
                onPress={() => choose(onBrowse)}
                styles={styles}
                theme={theme}
              />
              <MenuOption
                description="Paste a public product or collection URL"
                icon="link-outline"
                label="Import from website"
                onPress={() => choose(onImport)}
                styles={styles}
                theme={theme}
              />
              <MenuOption
                description="Enter item details using the wardrobe form"
                icon="create-outline"
                label="Add manually"
                onPress={() => choose(onManual)}
                styles={styles}
                theme={theme}
              />
            </View>
          </Pressable>
        </SafeAreaView>
      </Pressable>
    </Modal>
  );
}

type MenuOptionProps = {
  description: string;
  icon: 'link-outline' | 'create-outline' | 'storefront-outline';
  label: string;
  onPress: () => void;
  styles: ReturnType<typeof createStyles>;
  theme: AppTheme;
};

function MenuOption({ description, icon, label, onPress, styles, theme }: MenuOptionProps) {
  return (
    <Pressable
      accessibilityHint={description}
      accessibilityLabel={label}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.option, pressed ? styles.pressed : null]}
    >
      <Ionicons color={theme.colors.text} name={icon} size={23} />
      <View style={styles.optionCopy}>
        <Text style={styles.optionLabel}>{label}</Text>
        <Text style={styles.optionDescription}>{description}</Text>
      </View>
      <Ionicons color={theme.colors.textMuted} name="chevron-forward" size={19} />
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
    sheet: {
      backgroundColor: theme.colors.surfaceElevated,
      borderTopLeftRadius: theme.radii.sm,
      borderTopRightRadius: theme.radii.sm,
      width: '100%',
    },
    content: {
      alignSelf: 'center',
      maxWidth: 720,
      padding: theme.spacing.lg,
      width: '100%',
    },
    header: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: theme.spacing.md,
      justifyContent: 'space-between',
      marginBottom: theme.spacing.md,
    },
    title: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.editorial,
      fontSize: theme.typography.fontSize.xl,
      lineHeight: theme.typography.lineHeight.xl,
    },
    closeButton: {
      alignItems: 'center',
      height: 44,
      justifyContent: 'center',
      width: 44,
    },
    option: {
      alignItems: 'center',
      borderTopColor: theme.colors.border,
      borderTopWidth: StyleSheet.hairlineWidth,
      flexDirection: 'row',
      gap: theme.spacing.md,
      minHeight: 76,
      paddingVertical: theme.spacing.md,
    },
    optionCopy: { flex: 1, gap: theme.spacing.xs, minWidth: 0 },
    optionLabel: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.md,
      fontWeight: theme.typography.fontWeight.semibold,
    },
    optionDescription: {
      color: theme.colors.textMuted,
      fontFamily: theme.typography.fontFamily.regular,
      fontSize: theme.typography.fontSize.sm,
      lineHeight: theme.typography.lineHeight.sm,
    },
    pressed: { opacity: 0.62 },
  });
}

import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAppTheme, type AppTheme } from '@/theme';

type Props = {
  actionLabel: string;
  message: string;
  onAction: () => void;
  title: string;
  variant: 'add' | 'clear';
};

export function WardrobeEmptyState({ actionLabel, message, onAction, title, variant }: Props) {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.state}>
      <Text accessibilityRole="header" style={styles.title}>
        {title}
      </Text>
      <Text style={styles.message}>{message}</Text>
      <Pressable
        accessibilityLabel={actionLabel}
        accessibilityRole="button"
        onPress={onAction}
        style={({ pressed }) => [styles.action, pressed ? styles.pressed : null]}
      >
        <Ionicons
          color={theme.colors.text}
          name={variant === 'add' ? 'add-outline' : 'refresh-outline'}
          size={21}
        />
        <Text style={styles.actionLabel}>{actionLabel}</Text>
      </Pressable>
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    state: {
      borderTopColor: theme.colors.border,
      borderTopWidth: StyleSheet.hairlineWidth,
      gap: theme.spacing.md,
      paddingVertical: theme.spacing.xl,
    },
    title: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.editorial,
      fontSize: theme.typography.fontSize.xl,
      lineHeight: theme.typography.lineHeight.xl,
    },
    message: {
      color: theme.colors.textMuted,
      fontFamily: theme.typography.fontFamily.regular,
      fontSize: theme.typography.fontSize.sm,
      lineHeight: theme.typography.lineHeight.sm,
      maxWidth: 520,
    },
    action: {
      alignItems: 'center',
      alignSelf: 'flex-start',
      borderColor: theme.colors.text,
      borderWidth: 1,
      flexDirection: 'row',
      gap: theme.spacing.sm,
      justifyContent: 'center',
      minHeight: 48,
      paddingHorizontal: theme.spacing.md,
    },
    actionLabel: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.semibold,
    },
    pressed: { opacity: 0.62 },
  });
}

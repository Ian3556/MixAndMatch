import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Avatar } from '@/components/ui/ProfilePrimitives';
import { useAppTheme, type AppTheme } from '@/theme';

type ProfileIdentityProps = {
  avatarUrl: string | null;
  email: string;
  name: string;
  onEdit: () => void;
};

export function ProfileIdentity({ avatarUrl, email, name, onEdit }: ProfileIdentityProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.header}>
      <Avatar imageUrl={avatarUrl} name={name} size={96} />
      <View style={styles.copy}>
        <Text accessibilityRole="header" style={styles.name}>
          {name}
        </Text>
        <Text style={styles.email}>{email}</Text>
      </View>
      <Pressable
        accessibilityLabel="Edit profile"
        accessibilityRole="button"
        hitSlop={8}
        onPress={onEdit}
        style={({ pressed }) => [styles.edit, pressed ? styles.pressed : null]}
      >
        <Ionicons color={theme.colors.text} name="create-outline" size={17} />
        <Text style={styles.editLabel}>Edit</Text>
      </Pressable>
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    header: {
      alignItems: 'center',
      borderBottomColor: theme.colors.border,
      borderBottomWidth: StyleSheet.hairlineWidth,
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.lg,
      paddingBottom: theme.spacing.xl,
      paddingTop: theme.spacing.sm,
    },
    copy: { flex: 1, minWidth: 200 },
    name: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.editorial,
      fontSize: theme.typography.fontSize.xxl,
      fontWeight: theme.typography.fontWeight.regular,
      lineHeight: theme.typography.lineHeight.xxl,
    },
    email: {
      color: theme.colors.textMuted,
      fontFamily: theme.typography.fontFamily.regular,
      fontSize: theme.typography.fontSize.sm,
      lineHeight: theme.typography.lineHeight.sm,
      marginTop: theme.spacing.xs,
    },
    edit: {
      alignItems: 'center',
      borderBottomColor: theme.colors.text,
      borderBottomWidth: 1,
      flexDirection: 'row',
      gap: theme.spacing.xs,
      minHeight: 44,
      paddingHorizontal: theme.spacing.xs,
    },
    editLabel: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.semibold,
    },
    pressed: { opacity: 0.58 },
  });
}

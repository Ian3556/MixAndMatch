import { Image, StyleSheet, Text, View } from 'react-native';

import { useAppTheme, type AppTheme } from '@/theme';

export function Avatar({
  name,
  imageUrl,
  size = 72,
}: {
  name: string;
  imageUrl?: string | null;
  size?: number;
}) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const initials =
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('') || 'MM';

  return (
    <View
      accessibilityLabel={`${name} avatar`}
      style={[styles.avatar, { height: size, width: size }]}
    >
      {imageUrl ? (
        <Image
          accessibilityLabel={`${name} profile image`}
          source={{ uri: imageUrl }}
          style={styles.avatarImage}
        />
      ) : (
        <Text style={styles.initials}>{initials}</Text>
      )}
    </View>
  );
}

export function StatCard({ label, value }: { label: string; value: string }) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export function Badge({ label }: { label: string }) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{label}</Text>
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    avatar: {
      alignItems: 'center',
      backgroundColor: theme.colors.primarySoft,
      borderColor: theme.colors.primary,
      borderRadius: theme.radii.full,
      borderWidth: 1,
      justifyContent: 'center',
      overflow: 'hidden',
    },
    initials: {
      color: theme.colors.primary,
      fontFamily: theme.typography.fontFamily.bold,
      fontSize: theme.typography.fontSize.xl,
      fontWeight: theme.typography.fontWeight.bold,
    },
    avatarImage: { height: '100%', width: '100%' },
    stat: {
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
      borderRadius: theme.radii.lg,
      borderWidth: 1,
      flex: 1,
      minWidth: 128,
      padding: theme.spacing.md,
    },
    statValue: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.bold,
      fontSize: theme.typography.fontSize.xl,
      fontWeight: theme.typography.fontWeight.bold,
      lineHeight: theme.typography.lineHeight.xl,
    },
    statLabel: {
      color: theme.colors.textMuted,
      fontFamily: theme.typography.fontFamily.regular,
      fontSize: theme.typography.fontSize.sm,
      lineHeight: theme.typography.lineHeight.sm,
    },
    badge: {
      alignSelf: 'flex-start',
      backgroundColor: theme.colors.primarySoft,
      borderRadius: theme.radii.full,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
    },
    badgeText: {
      color: theme.colors.primary,
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.xs,
      fontWeight: theme.typography.fontWeight.semibold,
    },
  });
}

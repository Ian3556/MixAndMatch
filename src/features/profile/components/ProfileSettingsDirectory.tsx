import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps, ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAppTheme, type AppTheme } from '@/theme';

type IconName = ComponentProps<typeof Ionicons>['name'];

type ProfileSettingsDirectoryProps = {
  appearanceValue: string;
  catalogOperationsRow?: ReactNode;
  onAbout: () => void;
  onAccount: () => void;
  onAppearance: () => void;
  onHelp: () => void;
  onNotifications: () => void;
  onPrivacy: () => void;
};

export function ProfileSettingsDirectory({
  appearanceValue,
  catalogOperationsRow,
  onAbout,
  onAccount,
  onAppearance,
  onHelp,
  onNotifications,
  onPrivacy,
}: ProfileSettingsDirectoryProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.section}>
      <Text accessibilityRole="header" style={styles.heading}>
        SETTINGS
      </Text>

      <DirectoryGroup styles={styles} title="General">
        <DirectoryRow
          icon="person-outline"
          label="Account Settings"
          onPress={onAccount}
          styles={styles}
        />
        <DirectoryRow
          icon="contrast-outline"
          label="Appearance"
          onPress={onAppearance}
          styles={styles}
          value={appearanceValue}
        />
        <DirectoryRow
          icon="notifications-outline"
          label="Notifications"
          onPress={onNotifications}
          styles={styles}
        />
        {catalogOperationsRow}
      </DirectoryGroup>

      <DirectoryGroup styles={styles} title="Privacy">
        <DirectoryRow
          icon="shield-checkmark-outline"
          label="Privacy"
          onPress={onPrivacy}
          styles={styles}
        />
      </DirectoryGroup>

      <DirectoryGroup styles={styles} title="Help">
        <DirectoryRow icon="help-circle-outline" label="Help" onPress={onHelp} styles={styles} />
      </DirectoryGroup>

      <DirectoryGroup styles={styles} title="About">
        <DirectoryRow
          icon="information-circle-outline"
          label="About"
          onPress={onAbout}
          styles={styles}
        />
      </DirectoryGroup>
    </View>
  );
}

export function ProfileDirectoryRow({
  icon,
  label,
  onPress,
  value,
}: {
  icon?: IconName;
  label: string;
  onPress: () => void;
  value?: string;
}) {
  const styles = createStyles(useAppTheme());
  return (
    <DirectoryRow
      {...(icon ? { icon } : {})}
      label={label}
      onPress={onPress}
      styles={styles}
      {...(value ? { value } : {})}
    />
  );
}

function DirectoryGroup({
  children,
  styles,
  title,
}: {
  children: ReactNode;
  styles: DirectoryStyles;
  title: string;
}) {
  return (
    <View style={styles.group}>
      <Text style={styles.groupTitle}>{title}</Text>
      <View>{children}</View>
    </View>
  );
}

type DirectoryStyles = ReturnType<typeof createStyles>;

function DirectoryRow({
  icon,
  label,
  onPress,
  styles,
  value,
}: {
  icon?: IconName;
  label: string;
  onPress: () => void;
  styles: DirectoryStyles;
  value?: string;
}) {
  const theme = useAppTheme();
  return (
    <Pressable
      accessibilityLabel={value ? `${label}, ${value}` : label}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed ? styles.pressed : null]}
    >
      {icon ? <Ionicons color={theme.colors.textMuted} name={icon} size={19} /> : null}
      <Text style={styles.rowLabel}>{label}</Text>
      {value ? <Text style={styles.value}>{value}</Text> : null}
      <Ionicons color={theme.colors.textMuted} name="chevron-forward" size={17} />
    </Pressable>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    section: { gap: theme.spacing.xl },
    heading: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.md,
      fontWeight: theme.typography.fontWeight.semibold,
      letterSpacing: 1.4,
      lineHeight: theme.typography.lineHeight.md,
    },
    group: { gap: theme.spacing.xs },
    groupTitle: {
      color: theme.colors.textMuted,
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.xs,
      fontWeight: theme.typography.fontWeight.semibold,
      letterSpacing: 1.2,
      textTransform: 'uppercase',
    },
    row: {
      alignItems: 'center',
      borderBottomColor: theme.colors.border,
      borderBottomWidth: StyleSheet.hairlineWidth,
      flexDirection: 'row',
      gap: theme.spacing.md,
      minHeight: 58,
      paddingVertical: theme.spacing.sm,
    },
    rowLabel: {
      color: theme.colors.text,
      flex: 1,
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.md,
      lineHeight: theme.typography.lineHeight.md,
    },
    value: {
      color: theme.colors.textMuted,
      fontFamily: theme.typography.fontFamily.regular,
      fontSize: theme.typography.fontSize.sm,
    },
    pressed: { opacity: 0.58 },
  });
}

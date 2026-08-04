import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAppTheme, type AppTheme } from '@/theme';

type SettingRowProps = {
  label: string;
  description?: string | undefined;
  value?: string | undefined;
  symbol?: string | undefined;
  onPress?: (() => void) | undefined;
  destructive?: boolean | undefined;
};

export function SettingRow({
  label,
  description,
  value,
  symbol = '›',
  onPress,
  destructive = false,
}: SettingRowProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  const content = (
    <>
      <View style={styles.copy}>
        <Text style={[styles.label, destructive ? styles.destructive : null]}>{label}</Text>
        {description ? <Text style={styles.description}>{description}</Text> : null}
      </View>
      {value ? <Text style={styles.value}>{value}</Text> : null}
      {onPress ? <Text style={styles.symbol}>{symbol}</Text> : null}
    </>
  );

  if (!onPress) {
    return <View style={styles.row}>{content}</View>;
  }

  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed ? styles.pressed : null]}
    >
      {content}
    </Pressable>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    row: {
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderBottomColor: theme.colors.border,
      borderBottomWidth: StyleSheet.hairlineWidth,
      flexDirection: 'row',
      gap: theme.spacing.md,
      minHeight: 64,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
    },
    copy: { flex: 1, minWidth: 0 },
    label: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.md,
      fontWeight: theme.typography.fontWeight.medium,
      lineHeight: theme.typography.lineHeight.md,
    },
    description: {
      color: theme.colors.textMuted,
      fontFamily: theme.typography.fontFamily.regular,
      fontSize: theme.typography.fontSize.sm,
      lineHeight: theme.typography.lineHeight.sm,
    },
    value: {
      color: theme.colors.textMuted,
      fontFamily: theme.typography.fontFamily.regular,
      fontSize: theme.typography.fontSize.sm,
      maxWidth: '38%',
      textAlign: 'right',
    },
    symbol: { color: theme.colors.textMuted, fontSize: theme.typography.fontSize.xl },
    destructive: { color: theme.colors.danger },
    pressed: { backgroundColor: theme.colors.surfaceMuted },
  });
}

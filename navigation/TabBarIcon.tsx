import { StyleSheet, Text, View } from 'react-native';

import { useAppTheme, type AppTheme } from '@/theme';

import type { TabIconKey } from './navigationConfig';

const glyphs: Record<TabIconKey, string> = {
  home: '⌂',
  explore: '⌕',
  wardrobe: '◇',
  stylist: '✦',
  profile: '●',
};

export function TabBarIcon({
  icon,
  focused,
  prominent = false,
}: {
  icon: TabIconKey;
  focused: boolean;
  prominent?: boolean;
}) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  return (
    <View
      style={[styles.shell, prominent ? styles.prominent : null, focused ? styles.focused : null]}
    >
      <Text style={[styles.glyph, focused ? styles.focusedGlyph : null]}>{glyphs[icon]}</Text>
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    shell: {
      alignItems: 'center',
      borderRadius: theme.radii.full,
      height: 30,
      justifyContent: 'center',
      width: 36,
    },
    prominent: {
      borderColor: theme.colors.border,
      borderWidth: 1,
      height: 36,
      width: 42,
    },
    focused: { backgroundColor: theme.colors.primarySoft },
    glyph: {
      color: theme.colors.textMuted,
      fontSize: theme.typography.fontSize.lg,
      lineHeight: theme.typography.lineHeight.lg,
    },
    focusedGlyph: { color: theme.colors.primary },
  });
}

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
    <View style={[styles.shell, prominent ? styles.prominent : null]}>
      <Text
        style={[
          styles.glyph,
          prominent ? styles.prominentGlyph : null,
          focused ? styles.focusedGlyph : null,
        ]}
      >
        {glyphs[icon]}
      </Text>
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    shell: {
      alignItems: 'center',
      height: 25,
      justifyContent: 'center',
      width: 32,
    },
    prominent: {
      height: 27,
      width: 34,
    },
    glyph: {
      color: theme.colors.textMuted,
      fontSize: theme.typography.fontSize.lg,
      lineHeight: theme.typography.lineHeight.lg,
    },
    prominentGlyph: { fontSize: theme.typography.fontSize.xl },
    focusedGlyph: { color: theme.colors.primary },
  });
}

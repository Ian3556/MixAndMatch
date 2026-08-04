import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppScreen } from '@/components/ui/AppScreen';
import { DeferredNotice } from '@/components/ui/StateViews';
import { WARDROBE_ROUTES } from '@/navigation/routes';
import type { WardrobeStackParamList } from '@/navigation/types';
import { useAppTheme, type AppTheme } from '@/theme';

type Props = NativeStackScreenProps<WardrobeStackParamList, 'AddItemEntry'>;

const inputOptions = [
  {
    source: 'camera',
    title: 'Take photo',
    subtitle: 'Preview the future camera entry point',
    symbol: '◎',
  },
  {
    source: 'gallery',
    title: 'Choose from gallery',
    subtitle: 'Preview the future library entry point',
    symbol: '▣',
  },
  {
    source: 'online',
    title: 'Search online',
    subtitle: 'Preview the future catalogue entry point',
    symbol: '⌕',
  },
  {
    source: 'manual',
    title: 'Add manually',
    subtitle: 'Continue with a neutral image placeholder',
    symbol: '＋',
  },
] as const;

export function AddItemEntryScreen({ navigation }: Props) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  return (
    <AppScreen
      onBack={navigation.goBack}
      subtitle="Choose how this future workflow should begin."
      title="Add wardrobe item"
    >
      <DeferredNotice>
        Camera, photo-library, upload, and online search integrations are intentionally unavailable
        in Phase 2. No permission will be requested.
      </DeferredNotice>
      <View style={styles.options}>
        {inputOptions.map((option) => (
          <Pressable
            accessibilityRole="button"
            key={option.source}
            onPress={() =>
              navigation.navigate(WARDROBE_ROUTES.ADD_ITEM_IMAGE, { source: option.source })
            }
            style={({ pressed }) => [styles.option, pressed ? styles.pressed : null]}
          >
            <View style={styles.symbolShell}>
              <Text style={styles.symbol}>{option.symbol}</Text>
            </View>
            <View style={styles.copy}>
              <Text style={styles.title}>{option.title}</Text>
              <Text style={styles.subtitle}>{option.subtitle}</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </Pressable>
        ))}
      </View>
    </AppScreen>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    options: { gap: theme.spacing.sm },
    option: {
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
      borderRadius: theme.radii.lg,
      borderWidth: 1,
      flexDirection: 'row',
      gap: theme.spacing.md,
      minHeight: 84,
      padding: theme.spacing.md,
    },
    symbolShell: {
      alignItems: 'center',
      backgroundColor: theme.colors.primarySoft,
      borderRadius: theme.radii.md,
      height: 48,
      justifyContent: 'center',
      width: 48,
    },
    symbol: { color: theme.colors.primary, fontSize: theme.typography.fontSize.xl },
    copy: { flex: 1 },
    title: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSize.md,
      fontWeight: theme.typography.fontWeight.semibold,
    },
    subtitle: {
      color: theme.colors.textMuted,
      fontSize: theme.typography.fontSize.sm,
      lineHeight: theme.typography.lineHeight.sm,
    },
    arrow: { color: theme.colors.textMuted, fontSize: theme.typography.fontSize.xl },
    pressed: { opacity: 0.72 },
  });
}

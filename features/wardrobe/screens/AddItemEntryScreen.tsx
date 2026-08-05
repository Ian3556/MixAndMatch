import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppScreen } from '@/components/ui/AppScreen';
import { WARDROBE_ROUTES } from '@/navigation/routes';
import type { WardrobeStackParamList } from '@/navigation/types';
import { useAppTheme, type AppTheme } from '@/theme';

type Props = NativeStackScreenProps<WardrobeStackParamList, 'AddItemEntry'>;

const inputOptions = [
  {
    key: 'website',
    title: 'Import from Website',
    subtitle: 'Analyse a public product or collection page',
    symbol: 'â†—',
    enabled: true,
  },
  {
    key: 'manual',
    title: 'Add manually',
    subtitle: 'Enter clothing details without an external website',
    symbol: 'ï¼‹',
    enabled: true,
  },
  {
    key: 'camera',
    title: 'Take a photo',
    subtitle: 'Unavailable in Phase 3 â€” camera and uploads are deferred',
    symbol: 'â—‰',
    enabled: false,
  },
  {
    key: 'gallery',
    title: 'Choose from gallery',
    subtitle: 'Unavailable in Phase 3 â€” media-library integration is deferred',
    symbol: 'â–£',
    enabled: false,
  },
] as const;

export function AddItemEntryScreen({ navigation }: Props) {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  const openOption = (key: (typeof inputOptions)[number]['key']) => {
    if (key === 'website') navigation.navigate(WARDROBE_ROUTES.IMPORT_WEBSITE);
    if (key === 'manual') {
      navigation.navigate(WARDROBE_ROUTES.ADD_ITEM_IMAGE, { source: 'manual' });
    }
  };

  return (
    <AppScreen
      onBack={navigation.goBack}
      subtitle="Choose a supported way to add a wardrobe item."
      title="Add wardrobe item"
    >
      <View style={styles.options}>
        {inputOptions.map((option) => (
          <Pressable
            accessibilityHint={option.enabled ? option.subtitle : 'This option is unavailable.'}
            accessibilityRole="button"
            accessibilityState={{ disabled: !option.enabled }}
            disabled={!option.enabled}
            key={option.key}
            onPress={() => openOption(option.key)}
            style={({ pressed }) => [
              styles.option,
              !option.enabled ? styles.disabled : null,
              pressed ? styles.pressed : null,
            ]}
          >
            <View style={styles.symbolShell}>
              <Text style={styles.symbol}>{option.symbol}</Text>
            </View>
            <View style={styles.copy}>
              <Text style={styles.title}>{option.title}</Text>
              <Text style={styles.subtitle}>{option.subtitle}</Text>
            </View>
            {option.enabled ? <Text style={styles.arrow}>â€º</Text> : null}
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
    disabled: { opacity: 0.58 },
    pressed: { opacity: 0.72 },
  });
}

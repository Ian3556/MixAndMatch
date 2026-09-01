import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppScreen } from '@/components/ui/AppScreen';
import { Chip } from '@/components/ui/Chip';
import { OutfitCard } from '@/components/ui/OutfitCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { DeferredNotice } from '@/components/ui/StateViews';
import { outfitConcepts } from '@/fixtures/outfits';
import { quickStylingPrompts, stylingTips } from '@/fixtures/stylingTips';
import { STYLIST_ROUTES } from '@/navigation/routes';
import type { StylistStackParamList } from '@/navigation/types';
import { useAppTheme, type AppTheme } from '@/theme';
import { showDeferredNotice } from '@/utils/deferred';

type Props = NativeStackScreenProps<StylistStackParamList, 'Stylist'>;

const primaryActions = [
  {
    title: 'Create an outfit',
    subtitle: 'Start with an occasion and style goal',
    symbol: '✦',
    route: 'goal',
  },
  {
    title: 'Style one item',
    subtitle: 'Preview the item-led styling entry point',
    symbol: '◇',
    route: 'goal',
  },
  {
    title: 'Choose an occasion',
    subtitle: 'Build a look around where you are going',
    symbol: '○',
    route: 'goal',
  },
  {
    title: 'Ask the AI stylist',
    subtitle: 'AI conversation is deferred',
    symbol: '✧',
    route: 'deferred',
  },
  {
    title: 'View saved outfits',
    subtitle: 'Saved outfits are deferred',
    symbol: '♡',
    route: 'deferred',
  },
] as const;

export function StylistScreen({ navigation }: Props) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  return (
    <AppScreen
      eyebrow="Outfit studio"
      subtitle="Shape a styling brief and inspect static result layouts—without invoking AI."
      title="Stylist"
    >
      <DeferredNotice>
        The Stylist is a navigable UI shell. Prompts, generation, saving, and personalisation are
        not connected.
      </DeferredNotice>
      <View style={styles.actionGrid}>
        {primaryActions.map((action) => (
          <Pressable
            accessibilityRole="button"
            key={action.title}
            onPress={() =>
              action.route === 'goal'
                ? navigation.navigate(STYLIST_ROUTES.OUTFIT_GOAL)
                : showDeferredNotice(action.title)
            }
            style={({ pressed }) => [styles.actionCard, pressed ? styles.pressed : null]}
          >
            <Text style={styles.actionSymbol}>{action.symbol}</Text>
            <Text style={styles.actionTitle}>{action.title}</Text>
            <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.section}>
        <SectionHeader title="Quick styling prompts" />
        <View style={styles.chips}>
          {quickStylingPrompts.map((prompt) => (
            <Chip
              key={prompt}
              label={prompt}
              onPress={() => showDeferredNotice('AI styling prompts')}
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <SectionHeader title="Recent outfit concepts" />
        <ScrollView
          contentContainerStyle={styles.horizontal}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {outfitConcepts.map((outfit) => (
            <View key={outfit.id} style={styles.outfitWidth}>
              <OutfitCard
                onPress={() =>
                  navigation.navigate(STYLIST_ROUTES.OUTFIT_DETAIL, { outfitId: outfit.id })
                }
                outfit={outfit}
              />
            </View>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <SectionHeader
          subtitle="General education, not personalised advice"
          title="Styling fundamentals"
        />
        <View style={styles.tipGrid}>
          {stylingTips.map((tip, index) => (
            <View key={tip.id} style={styles.tipCard}>
              <Text style={styles.tipNumber}>{String(index + 1).padStart(2, '0')}</Text>
              <Text style={styles.tipTitle}>{tip.title}</Text>
              <Text style={styles.tipBody}>{tip.body}</Text>
            </View>
          ))}
        </View>
      </View>
    </AppScreen>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    actionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.md },
    actionCard: {
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
      borderRadius: theme.radii.lg,
      borderWidth: 1,
      flexGrow: 1,
      gap: theme.spacing.xs,
      minHeight: 156,
      minWidth: 220,
      padding: theme.spacing.lg,
      width: '46%',
    },
    actionSymbol: { color: theme.colors.primary, fontSize: theme.typography.fontSize.xl },
    actionTitle: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSize.lg,
      fontWeight: theme.typography.fontWeight.bold,
    },
    actionSubtitle: {
      color: theme.colors.textMuted,
      fontSize: theme.typography.fontSize.sm,
      lineHeight: theme.typography.lineHeight.sm,
    },
    section: { gap: theme.spacing.md },
    chips: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
    horizontal: { gap: theme.spacing.md, paddingRight: theme.spacing.md },
    outfitWidth: { width: 280 },
    tipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
    tipCard: {
      backgroundColor: theme.colors.surfaceMuted,
      borderRadius: theme.radii.md,
      flexGrow: 1,
      gap: theme.spacing.xs,
      minWidth: 180,
      padding: theme.spacing.md,
      width: '30%',
    },
    tipNumber: { color: theme.colors.primary, fontSize: theme.typography.fontSize.xs },
    tipTitle: { color: theme.colors.text, fontWeight: theme.typography.fontWeight.semibold },
    tipBody: { color: theme.colors.textMuted, fontSize: theme.typography.fontSize.sm },
    pressed: { opacity: 0.72 },
  });
}

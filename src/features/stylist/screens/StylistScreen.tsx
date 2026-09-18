import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppScreen } from '@/components/ui/AppScreen';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { EmptyState, ErrorState, SkeletonCard } from '@/components/ui/StateViews';
import { stylingTips } from '@/fixtures/stylingTips';
import { MAIN_ROUTES, STYLIST_ROUTES } from '@/navigation/routes';
import type { MainTabParamList, StylistStackParamList } from '@/navigation/types';
import { useStylistStore } from '@/store/stylistStore';
import { useAppTheme, type AppTheme } from '@/theme';

import { useStylistData } from '../useStylistData';

type Props = NativeStackScreenProps<StylistStackParamList, 'Stylist'>;

const quickBriefs = [
  { label: 'University · Minimal', occasion: 'University', desiredStyle: 'Minimalist' },
  { label: 'Dinner · Smart casual', occasion: 'Dinner', desiredStyle: 'Smart Casual' },
  { label: 'Travel · Casual', occasion: 'Travel', desiredStyle: 'Casual' },
] as const;

export function StylistScreen({ navigation }: Props) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const { error, loading, ready, retry, wardrobe } = useStylistData();
  const savedLooks = useStylistStore((state) => state.savedLooks);
  const currentGeneration = useStylistStore((state) => state.currentGeneration);

  const openWardrobe = () =>
    navigation
      .getParent<BottomTabNavigationProp<MainTabParamList>>()
      ?.navigate(MAIN_ROUTES.WARDROBE_TAB);

  return (
    <AppScreen
      eyebrow="Local styling engine"
      subtitle="Build outfit recommendations from your wardrobe, context, and explicit preferences."
      title="Stylist"
    >
      {loading ? (
        <View style={styles.skeletons}>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </View>
      ) : error ? (
        <ErrorState
          action={{ label: 'Try again', onPress: retry }}
          message={error}
          title="Stylist unavailable"
        />
      ) : ready && wardrobe.length === 0 ? (
        <EmptyState
          action={{ label: 'Add clothes', onPress: openWardrobe }}
          message="Add a few tops, bottoms, dresses, or shoes before generating a look."
          title="Your wardrobe is empty"
        />
      ) : (
        <>
          <View style={styles.heroActions}>
            <PrimaryAction
              detail="Choose occasion, weather, and style"
              label="Create an outfit"
              onPress={() => navigation.navigate(STYLIST_ROUTES.OUTFIT_GOAL)}
              styles={styles}
              symbol="✦"
            />
            <PrimaryAction
              detail="Anchor every result around one piece"
              label="Style one item"
              onPress={() => navigation.navigate(STYLIST_ROUTES.OUTFIT_GOAL)}
              styles={styles}
              symbol="◇"
            />
          </View>

          <View style={styles.section}>
            <SectionHeader subtitle="Start with a practical context" title="Quick briefs" />
            <View style={styles.briefs}>
              {quickBriefs.map((brief) => (
                <Pressable
                  accessibilityRole="button"
                  key={brief.label}
                  onPress={() => navigation.navigate(STYLIST_ROUTES.OUTFIT_GOAL, brief)}
                  style={({ pressed }) => [styles.brief, pressed ? styles.pressed : null]}
                >
                  <Text style={styles.briefLabel}>{brief.label}</Text>
                  <Text style={styles.arrow}>→</Text>
                </Pressable>
              ))}
            </View>
          </View>

          {currentGeneration?.recommendations.length ? (
            <LookDirectory
              looks={currentGeneration.recommendations.map((recommendation) => ({
                id: recommendation.outfit.id,
                score: recommendation.score,
                title:
                  recommendation.outfit.top?.name ??
                  recommendation.outfit.dress?.name ??
                  'Wardrobe look',
              }))}
              onOpen={(outfitId) => navigation.navigate(STYLIST_ROUTES.OUTFIT_DETAIL, { outfitId })}
              styles={styles}
              title="Latest recommendations"
            />
          ) : null}

          <LookDirectory
            empty="Save a recommendation and it will remain available on this device."
            looks={savedLooks.map((look) => ({
              id: look.recommendation.outfit.id,
              score: look.recommendation.score,
              title:
                look.recommendation.outfit.top?.name ??
                look.recommendation.outfit.dress?.name ??
                'Saved wardrobe look',
            }))}
            onOpen={(outfitId) => navigation.navigate(STYLIST_ROUTES.OUTFIT_DETAIL, { outfitId })}
            styles={styles}
            title="Saved looks"
          />

          <View style={styles.section}>
            <SectionHeader subtitle="General guidance" title="Styling fundamentals" />
            <View style={styles.tipGrid}>
              {stylingTips.slice(0, 4).map((tip, index) => (
                <View key={tip.id} style={styles.tip}>
                  <Text style={styles.tipNumber}>{String(index + 1).padStart(2, '0')}</Text>
                  <Text style={styles.tipTitle}>{tip.title}</Text>
                  <Text style={styles.tipBody}>{tip.body}</Text>
                </View>
              ))}
            </View>
          </View>
        </>
      )}
    </AppScreen>
  );
}

type Styles = ReturnType<typeof createStyles>;

function PrimaryAction({
  label,
  detail,
  symbol,
  onPress,
  styles,
}: {
  label: string;
  detail: string;
  symbol: string;
  onPress: () => void;
  styles: Styles;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.primaryAction, pressed ? styles.pressed : null]}
    >
      <Text style={styles.actionSymbol}>{symbol}</Text>
      <Text style={styles.actionLabel}>{label}</Text>
      <Text style={styles.actionDetail}>{detail}</Text>
    </Pressable>
  );
}

function LookDirectory({
  title,
  looks,
  empty,
  onOpen,
  styles,
}: {
  title: string;
  looks: { id: string; title: string; score: number }[];
  empty?: string;
  onOpen: (outfitId: string) => void;
  styles: Styles;
}) {
  return (
    <View style={styles.section}>
      <SectionHeader title={title} />
      {looks.length === 0 ? <Text style={styles.emptyCopy}>{empty}</Text> : null}
      {looks.slice(0, 5).map((look, index) => (
        <Pressable
          accessibilityRole="button"
          key={look.id}
          onPress={() => onOpen(look.id)}
          style={({ pressed }) => [styles.lookRow, pressed ? styles.pressed : null]}
        >
          <Text style={styles.lookNumber}>{String(index + 1).padStart(2, '0')}</Text>
          <Text numberOfLines={1} style={styles.lookTitle}>
            {look.title}
          </Text>
          <Text style={styles.lookScore}>{look.score.toFixed(1)}</Text>
        </Pressable>
      ))}
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    skeletons: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.md },
    heroActions: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.md },
    primaryAction: {
      borderBottomColor: theme.colors.border,
      borderBottomWidth: 1,
      flexGrow: 1,
      gap: theme.spacing.xs,
      minHeight: 128,
      minWidth: 220,
      paddingVertical: theme.spacing.lg,
      width: '46%',
    },
    actionSymbol: { color: theme.colors.primary, fontSize: theme.typography.fontSize.xl },
    actionLabel: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSize.lg,
      fontWeight: theme.typography.fontWeight.bold,
    },
    actionDetail: { color: theme.colors.textMuted, fontSize: theme.typography.fontSize.sm },
    section: { gap: theme.spacing.md },
    briefs: { borderTopColor: theme.colors.border, borderTopWidth: StyleSheet.hairlineWidth },
    brief: {
      alignItems: 'center',
      borderBottomColor: theme.colors.border,
      borderBottomWidth: StyleSheet.hairlineWidth,
      flexDirection: 'row',
      minHeight: 56,
    },
    briefLabel: {
      color: theme.colors.text,
      flex: 1,
      fontWeight: theme.typography.fontWeight.semibold,
    },
    arrow: { color: theme.colors.primary, fontSize: theme.typography.fontSize.lg },
    lookRow: {
      alignItems: 'center',
      borderBottomColor: theme.colors.border,
      borderBottomWidth: StyleSheet.hairlineWidth,
      flexDirection: 'row',
      gap: theme.spacing.md,
      minHeight: 54,
    },
    lookNumber: { color: theme.colors.primary, fontSize: theme.typography.fontSize.xs, width: 24 },
    lookTitle: { color: theme.colors.text, flex: 1 },
    lookScore: { color: theme.colors.textMuted, fontVariant: ['tabular-nums'] },
    emptyCopy: { color: theme.colors.textMuted, fontSize: theme.typography.fontSize.sm },
    tipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.md },
    tip: {
      borderTopColor: theme.colors.primary,
      borderTopWidth: 2,
      flexGrow: 1,
      gap: theme.spacing.xs,
      minWidth: 180,
      paddingTop: theme.spacing.md,
      width: '46%',
    },
    tipNumber: { color: theme.colors.primary, fontSize: theme.typography.fontSize.xs },
    tipTitle: { color: theme.colors.text, fontWeight: theme.typography.fontWeight.semibold },
    tipBody: { color: theme.colors.textMuted, fontSize: theme.typography.fontSize.sm },
    pressed: { opacity: 0.7 },
  });
}

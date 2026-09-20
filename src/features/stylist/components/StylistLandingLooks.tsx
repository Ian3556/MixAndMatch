import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import {
  buildStylingInstructions,
  getRecommendationTitle,
} from '@/features/stylist/presentation/stylingPresentation';
import type { StylingRecommendation } from '@/features/stylist/types';
import { getOutfitItems } from '@/features/stylist/types';
import { useAppTheme, type AppTheme } from '@/theme';

import { OutfitImageComposition, type OutfitDisplayItem } from './OutfitImageComposition';
import { StylistSectionHeading } from './StylistEditorial';

type HeroProps = {
  items: readonly OutfitDisplayItem[];
  recommendation?: StylingRecommendation;
  desiredStyle: string;
  occasion: string;
  weather: string;
  wardrobeCount: number;
  onOpenRecommendation: () => void;
};

export function StylistLandingHero({
  items,
  recommendation,
  desiredStyle,
  occasion,
  weather,
  wardrobeCount,
  onOpenRecommendation,
}: HeroProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const { width } = useWindowDimensions();

  return (
    <View style={[styles.hero, width >= 720 ? styles.heroWide : null]}>
      <View style={styles.heroMedia}>
        <OutfitImageComposition featured items={items} showCaptions={false} />
      </View>
      <View style={styles.heroCopy}>
        <Text style={styles.kicker}>
          {recommendation ? 'CURRENT RECOMMENDATION' : 'READY TO STYLE'}
        </Text>
        <Text style={styles.heroTitle}>
          {recommendation
            ? getRecommendationTitle(recommendation)
            : `${desiredStyle} for ${occasion}`}
        </Text>
        <View style={styles.heroMetaRule} />
        <Text style={styles.heroMeta}>
          {recommendation
            ? `${getOutfitItems(recommendation.outfit).length} wardrobe pieces · ${Math.round(recommendation.score)} match`
            : `${wardrobeCount} wardrobe pieces available · ${weather} weather`}
        </Text>
        {recommendation ? (
          <TextAction label="OPEN THE LOOK →" onPress={onOpenRecommendation} styles={styles} />
        ) : null}
      </View>
    </View>
  );
}

export function RecommendedLookSection({
  recommendation,
  onOpen,
}: {
  recommendation: StylingRecommendation;
  onOpen: () => void;
}) {
  const styles = createStyles(useAppTheme());
  const items = getOutfitItems(recommendation.outfit);
  const instructions = buildStylingInstructions(items);

  return (
    <View style={styles.section}>
      <StylistSectionHeading eyebrow="04 · RECOMMENDED LOOK" title="The lead look." />
      <View style={styles.recommendedLook}>
        <OutfitImageComposition featured items={items} />
        <View style={styles.recommendedCopy}>
          <View style={styles.editorialColumn}>
            <Text style={styles.kicker}>WHY IT WORKS</Text>
            <Text style={styles.bodyCopy}>{recommendation.explanation}</Text>
          </View>
          <View style={styles.editorialColumn}>
            <Text style={styles.kicker}>HOW TO WEAR IT</Text>
            {instructions.map((instruction, index) => (
              <View key={instruction} style={styles.instructionRow}>
                <Text style={styles.instructionIndex}>{String(index + 1).padStart(2, '0')}</Text>
                <Text style={styles.instructionText}>{instruction}</Text>
              </View>
            ))}
          </View>
        </View>
        <TextAction label="VIEW FEEDBACK & ITEM CONTROLS →" onPress={onOpen} styles={styles} />
      </View>
    </View>
  );
}

export function AlternativeLooksSection({
  recommendations,
  onOpen,
}: {
  recommendations: readonly StylingRecommendation[];
  onOpen: (outfitId: string) => void;
}) {
  const styles = createStyles(useAppTheme());
  const { width } = useWindowDimensions();

  if (recommendations.length === 0) return null;

  return (
    <View style={styles.section}>
      <StylistSectionHeading eyebrow="05 · ALTERNATIVE LOOKS" title="Change the composition." />
      <View style={styles.alternativeGrid}>
        {recommendations.map((recommendation, index) => (
          <Pressable
            accessibilityRole="button"
            key={recommendation.outfit.id}
            onPress={() => onOpen(recommendation.outfit.id)}
            style={({ pressed }) => [
              styles.alternative,
              width >= 720 ? styles.alternativeWide : null,
              pressed ? styles.pressed : null,
            ]}
          >
            <OutfitImageComposition
              items={getOutfitItems(recommendation.outfit).slice(0, 2)}
              showCaptions={false}
            />
            <Text style={styles.kicker}>LOOK {String(index + 2).padStart(2, '0')}</Text>
            <Text style={styles.alternativeTitle}>{getRecommendationTitle(recommendation)}</Text>
            <Text style={styles.alternativeMeta}>
              {Math.round(recommendation.score)} MATCH / 100
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

export function SavedLookDirectory({
  looks,
  onOpen,
}: {
  looks: readonly StylingRecommendation[];
  onOpen: (outfitId: string) => void;
}) {
  const styles = createStyles(useAppTheme());

  return (
    <View style={styles.section}>
      <StylistSectionHeading eyebrow="SAVED EDIT" title="Looks kept on this device." />
      {looks.length === 0 ? (
        <Text style={styles.emptyCopy}>Saved recommendations will appear here.</Text>
      ) : (
        looks.slice(0, 5).map((look, index) => (
          <Pressable
            accessibilityRole="button"
            key={look.outfit.id}
            onPress={() => onOpen(look.outfit.id)}
            style={({ pressed }) => [styles.savedRow, pressed ? styles.pressed : null]}
          >
            <Text style={styles.savedIndex}>{String(index + 1).padStart(2, '0')}</Text>
            <Text numberOfLines={1} style={styles.savedTitle}>
              {getRecommendationTitle(look)}
            </Text>
            <Text style={styles.savedScore}>{Math.round(look.score)}</Text>
          </Pressable>
        ))
      )}
    </View>
  );
}

type Styles = ReturnType<typeof createStyles>;

function TextAction({
  label,
  onPress,
  styles,
}: {
  label: string;
  onPress: () => void;
  styles: Styles;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.textAction, pressed ? styles.pressed : null]}
    >
      <Text style={styles.textActionLabel}>{label}</Text>
    </Pressable>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    section: { gap: theme.spacing.lg },
    hero: { gap: theme.spacing.xl },
    heroWide: { alignItems: 'center', flexDirection: 'row' },
    heroMedia: { flex: 1.35, minWidth: 260 },
    heroCopy: { flex: 0.9, gap: theme.spacing.md, minWidth: 230 },
    kicker: {
      color: theme.colors.primary,
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.xs,
      fontWeight: theme.typography.fontWeight.semibold,
      letterSpacing: 1.5,
    },
    heroTitle: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.editorial,
      fontSize: theme.typography.fontSize.xxxl,
      letterSpacing: -1,
      lineHeight: theme.typography.lineHeight.xxxl,
      textTransform: 'capitalize',
    },
    heroMetaRule: { backgroundColor: theme.colors.text, height: 1, width: 56 },
    heroMeta: {
      color: theme.colors.textMuted,
      fontSize: theme.typography.fontSize.sm,
      lineHeight: theme.typography.lineHeight.sm,
    },
    textAction: { alignSelf: 'flex-start', justifyContent: 'center', minHeight: 44 },
    textActionLabel: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.xs,
      fontWeight: theme.typography.fontWeight.semibold,
      letterSpacing: 1,
    },
    recommendedLook: { gap: theme.spacing.lg },
    recommendedCopy: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.xl },
    editorialColumn: { flex: 1, gap: theme.spacing.md, minWidth: 240 },
    bodyCopy: {
      color: theme.colors.textMuted,
      fontSize: theme.typography.fontSize.md,
      lineHeight: theme.typography.lineHeight.md,
    },
    instructionRow: { flexDirection: 'row', gap: theme.spacing.sm },
    instructionIndex: {
      color: theme.colors.primary,
      fontSize: theme.typography.fontSize.xs,
      width: 22,
    },
    instructionText: {
      color: theme.colors.text,
      flex: 1,
      fontSize: theme.typography.fontSize.sm,
      lineHeight: theme.typography.lineHeight.sm,
    },
    alternativeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.lg },
    alternative: {
      borderTopColor: theme.colors.text,
      borderTopWidth: 1,
      gap: theme.spacing.sm,
      paddingTop: theme.spacing.sm,
      width: '100%',
    },
    alternativeWide: { flexGrow: 1, minWidth: 280, width: '47%' },
    alternativeTitle: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.editorial,
      fontSize: theme.typography.fontSize.xl,
      lineHeight: theme.typography.lineHeight.xl,
      textTransform: 'capitalize',
    },
    alternativeMeta: {
      color: theme.colors.textMuted,
      fontSize: theme.typography.fontSize.xs,
      letterSpacing: 0.8,
    },
    emptyCopy: { color: theme.colors.textMuted, fontSize: theme.typography.fontSize.sm },
    savedRow: {
      alignItems: 'center',
      borderBottomColor: theme.colors.border,
      borderBottomWidth: StyleSheet.hairlineWidth,
      flexDirection: 'row',
      gap: theme.spacing.md,
      minHeight: 56,
    },
    savedIndex: {
      color: theme.colors.primary,
      fontSize: theme.typography.fontSize.xs,
      width: 24,
    },
    savedTitle: {
      color: theme.colors.text,
      flex: 1,
      fontFamily: theme.typography.fontFamily.editorial,
      fontSize: theme.typography.fontSize.lg,
      textTransform: 'capitalize',
    },
    savedScore: { color: theme.colors.textMuted, fontVariant: ['tabular-nums'] },
    pressed: { opacity: 0.62 },
  });
}

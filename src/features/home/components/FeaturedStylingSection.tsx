import { StyleSheet, Text, View } from 'react-native';

import { useAppTheme, type AppTheme } from '@/theme';

import type { FeaturedOutfit } from '../types/editorial';
import {
  EditorialAction,
  EditorialEmptyState,
  EditorialImage,
  EditorialSectionHeader,
} from './EditorialPrimitives';

type FeaturedStylingSectionProps = {
  featuredOutfitId: string;
  isTablet: boolean;
  isWide: boolean;
  onOpenOutfit: (outfit: FeaturedOutfit) => void;
  outfits: readonly FeaturedOutfit[];
};

export function FeaturedStylingSection({
  featuredOutfitId,
  isTablet,
  isWide,
  onOpenOutfit,
  outfits,
}: FeaturedStylingSectionProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const featured = outfits.find((outfit) => outfit.id === featuredOutfitId) ?? outfits[0];
  const secondary = outfits.filter((outfit) => outfit.id !== featured?.id);

  return (
    <View style={styles.section}>
      <EditorialSectionHeader
        description="Complete looks considered through proportion, texture, and the realities of getting dressed."
        eyebrow="The styling room"
        title="Featured Outfit Styling"
      />

      {featured ? (
        <View style={[styles.feature, isWide ? styles.featureWide : null]}>
          <View style={styles.featureImage}>
            <EditorialImage
              alt={`${featured.title}: ${featured.garments.join(', ')}`}
              aspectRatio={2 / 3}
              image={featured.image}
            />
          </View>
          <View style={styles.featureCopy}>
            <Text style={styles.kicker}>{featured.style}</Text>
            <Text
              accessibilityRole="header"
              style={[styles.featureTitle, isWide ? styles.featureTitleWide : null]}
            >
              {featured.title}
            </Text>
            <Text style={styles.description}>{featured.description}</Text>
            <View style={styles.garmentList}>
              {featured.garments.map((garment, index) => (
                <View key={garment} style={styles.garmentRow}>
                  <Text accessibilityElementsHidden style={styles.garmentNumber}>
                    {String(index + 1).padStart(2, '0')}
                  </Text>
                  <Text style={styles.garment}>{garment}</Text>
                </View>
              ))}
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.meta}>{featured.season}</Text>
              <Text accessibilityElementsHidden style={styles.metaDivider}>
                /
              </Text>
              <Text style={styles.meta}>{featured.occasion}</Text>
              <Text accessibilityElementsHidden style={styles.metaDivider}>
                /
              </Text>
              <Text style={styles.meta}>{featured.audience}</Text>
            </View>
            <EditorialAction label="Explore Style" onPress={() => onOpenOutfit(featured)} />
          </View>
        </View>
      ) : (
        <EditorialEmptyState message="New styling stories are being curated." />
      )}

      {secondary.length > 0 ? (
        <View style={styles.secondaryGrid}>
          {secondary.map((outfit) => (
            <View
              key={outfit.id}
              style={[styles.secondaryItem, isTablet ? styles.secondaryItemTablet : null]}
            >
              <EditorialImage
                alt={`${outfit.title}: ${outfit.garments.join(', ')}`}
                aspectRatio={4 / 5}
                image={outfit.image}
              />
              <View style={styles.secondaryCopy}>
                <Text style={styles.kicker}>{outfit.style}</Text>
                <Text accessibilityRole="header" style={styles.secondaryTitle}>
                  {outfit.title}
                </Text>
                <Text style={styles.secondaryDescription}>{outfit.description}</Text>
                <Text style={styles.outfitFormula}>{outfit.garments.join(' · ')}</Text>
                <EditorialAction label="Explore Style" onPress={() => onOpenOutfit(outfit)} />
              </View>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    section: { gap: theme.spacing.xxl },
    feature: { gap: theme.spacing.xl },
    featureWide: {
      alignItems: 'center',
      flexDirection: 'row-reverse',
      gap: theme.spacing.xxl,
    },
    featureImage: { flex: 1.6, width: '100%' },
    featureCopy: { flex: 1, gap: theme.spacing.md },
    kicker: {
      color: theme.colors.primary,
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.xs,
      fontWeight: theme.typography.fontWeight.semibold,
      letterSpacing: 1.6,
      lineHeight: theme.typography.lineHeight.xs,
      textTransform: 'uppercase',
    },
    featureTitle: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.editorial,
      fontSize: 40,
      fontWeight: theme.typography.fontWeight.regular,
      letterSpacing: -1,
      lineHeight: 46,
    },
    featureTitleWide: {
      fontSize: 56,
      letterSpacing: -1.8,
      lineHeight: 62,
    },
    description: {
      color: theme.colors.textMuted,
      fontFamily: theme.typography.fontFamily.regular,
      fontSize: theme.typography.fontSize.md,
      lineHeight: theme.typography.lineHeight.md,
    },
    garmentList: {
      borderBottomColor: theme.colors.border,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderTopColor: theme.colors.border,
      borderTopWidth: StyleSheet.hairlineWidth,
    },
    garmentRow: {
      alignItems: 'center',
      borderBottomColor: theme.colors.border,
      borderBottomWidth: StyleSheet.hairlineWidth,
      flexDirection: 'row',
      gap: theme.spacing.md,
      minHeight: 44,
      paddingVertical: theme.spacing.sm,
    },
    garmentNumber: {
      color: theme.colors.textMuted,
      fontFamily: theme.typography.fontFamily.regular,
      fontSize: theme.typography.fontSize.xs,
      lineHeight: theme.typography.lineHeight.xs,
      width: 24,
    },
    garment: {
      color: theme.colors.text,
      flex: 1,
      fontFamily: theme.typography.fontFamily.regular,
      fontSize: theme.typography.fontSize.sm,
      lineHeight: theme.typography.lineHeight.sm,
    },
    metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
    meta: {
      color: theme.colors.textMuted,
      fontFamily: theme.typography.fontFamily.regular,
      fontSize: theme.typography.fontSize.xs,
      lineHeight: theme.typography.lineHeight.xs,
      textTransform: 'uppercase',
    },
    metaDivider: {
      color: theme.colors.border,
      fontSize: theme.typography.fontSize.xs,
      lineHeight: theme.typography.lineHeight.xs,
    },
    secondaryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.xl },
    secondaryItem: { flexBasis: '100%', gap: theme.spacing.md, minWidth: 0 },
    secondaryItemTablet: { flexBasis: '46%', flexGrow: 1 },
    secondaryCopy: { gap: theme.spacing.sm },
    secondaryTitle: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.editorial,
      fontSize: 32,
      fontWeight: theme.typography.fontWeight.regular,
      letterSpacing: -0.6,
      lineHeight: 38,
    },
    secondaryDescription: {
      color: theme.colors.textMuted,
      fontFamily: theme.typography.fontFamily.regular,
      fontSize: theme.typography.fontSize.sm,
      lineHeight: theme.typography.lineHeight.sm,
    },
    outfitFormula: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.regular,
      fontSize: theme.typography.fontSize.xs,
      lineHeight: theme.typography.lineHeight.sm,
    },
  });
}

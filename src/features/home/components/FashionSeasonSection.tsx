import { StyleSheet, Text, View } from 'react-native';

import { useAppTheme, type AppTheme } from '@/theme';

import type { FashionSeasonRelease } from '../types/editorial';
import {
  EditorialAction,
  EditorialEmptyState,
  EditorialImage,
  EditorialSectionHeader,
} from './EditorialPrimitives';

type FashionSeasonSectionProps = {
  featuredReleaseId: string;
  isTablet: boolean;
  isWide: boolean;
  onOpenRelease: (release: FashionSeasonRelease) => void;
  releases: readonly FashionSeasonRelease[];
};

const dateFormatter = new Intl.DateTimeFormat('en', {
  day: 'numeric',
  month: 'long',
  timeZone: 'UTC',
  year: 'numeric',
});

function formatReleaseDate(date: string) {
  return dateFormatter.format(new Date(`${date}T00:00:00Z`));
}

function statusLabel(status: FashionSeasonRelease['status']) {
  if (status === 'current') return 'Current season';
  if (status === 'upcoming') return 'Upcoming';
  return 'Recently released';
}

export function FashionSeasonSection({
  featuredReleaseId,
  isTablet,
  isWide,
  onOpenRelease,
  releases,
}: FashionSeasonSectionProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const featured = releases.find((release) => release.id === featuredReleaseId) ?? releases[0];
  const secondary = releases.filter((release) => release.id !== featured?.id);

  return (
    <View style={styles.section}>
      <EditorialSectionHeader
        description="New collections, seasonal shifts, and the ideas shaping what comes next."
        eyebrow="The season desk"
        title="Fashion Brand Season Release"
      />

      {featured ? (
        <View style={[styles.feature, isWide ? styles.featureWide : null]}>
          <View style={styles.featureImage}>
            <EditorialImage
              alt={`${featured.brand} ${featured.collection} ${featured.season} ${featured.year} collection`}
              aspectRatio={2 / 3}
              image={featured.image}
              priority
            />
          </View>
          <View style={styles.featureCopy}>
            <Text style={styles.status}>{statusLabel(featured.status)}</Text>
            <Text style={styles.brand}>{featured.brand}</Text>
            <Text
              accessibilityRole="header"
              style={[styles.featureTitle, isWide ? styles.featureTitleWide : null]}
            >
              {featured.title}
            </Text>
            <Text style={styles.description}>{featured.description}</Text>
            <View style={styles.metadata}>
              <Text style={styles.metaText}>
                {featured.season} {featured.year}
              </Text>
              <Text accessibilityElementsHidden style={styles.metaDivider}>
                /
              </Text>
              <Text style={styles.metaText}>{formatReleaseDate(featured.releaseDate)}</Text>
              {featured.location ? (
                <>
                  <Text accessibilityElementsHidden style={styles.metaDivider}>
                    /
                  </Text>
                  <Text style={styles.metaText}>{featured.location}</Text>
                </>
              ) : null}
            </View>
            <EditorialAction label="Explore Release" onPress={() => onOpenRelease(featured)} />
          </View>
        </View>
      ) : (
        <EditorialEmptyState message="New seasonal releases are being curated." />
      )}

      {secondary.length > 0 ? (
        <View style={styles.secondaryGrid}>
          {secondary.map((release) => (
            <View
              key={release.id}
              style={[styles.secondaryItem, isTablet ? styles.secondaryItemTablet : null]}
            >
              <EditorialImage
                alt={`${release.brand} ${release.collection} fashion collection`}
                aspectRatio={4 / 5}
                image={release.image}
              />
              <View style={styles.secondaryCopy}>
                <View style={styles.secondaryMetaRow}>
                  <Text style={styles.status}>{statusLabel(release.status)}</Text>
                  <Text style={styles.metaText}>{formatReleaseDate(release.releaseDate)}</Text>
                </View>
                <Text style={styles.secondaryBrand}>{release.brand}</Text>
                <Text accessibilityRole="header" style={styles.secondaryTitle}>
                  {release.title}
                </Text>
                <Text style={styles.secondaryDescription}>{release.description}</Text>
                <EditorialAction label="View Collection" onPress={() => onOpenRelease(release)} />
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
      flexDirection: 'row',
      gap: theme.spacing.xxl,
    },
    featureImage: { flex: 1.65, width: '100%' },
    featureCopy: { flex: 1, gap: theme.spacing.md },
    status: {
      color: theme.colors.primary,
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.xs,
      fontWeight: theme.typography.fontWeight.semibold,
      letterSpacing: 1.4,
      lineHeight: theme.typography.lineHeight.xs,
      textTransform: 'uppercase',
    },
    brand: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.bold,
      letterSpacing: 2,
      lineHeight: theme.typography.lineHeight.sm,
      textTransform: 'uppercase',
    },
    featureTitle: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.editorial,
      fontSize: 38,
      fontWeight: theme.typography.fontWeight.regular,
      letterSpacing: -0.9,
      lineHeight: 44,
    },
    featureTitleWide: {
      fontSize: 52,
      letterSpacing: -1.5,
      lineHeight: 58,
    },
    description: {
      color: theme.colors.textMuted,
      fontFamily: theme.typography.fontFamily.regular,
      fontSize: theme.typography.fontSize.md,
      lineHeight: theme.typography.lineHeight.md,
    },
    metadata: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
    metaText: {
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
    secondaryMetaRow: {
      alignItems: 'center',
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
      justifyContent: 'space-between',
    },
    secondaryBrand: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.xs,
      fontWeight: theme.typography.fontWeight.semibold,
      letterSpacing: 1.6,
      lineHeight: theme.typography.lineHeight.xs,
      textTransform: 'uppercase',
    },
    secondaryTitle: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.editorial,
      fontSize: 30,
      fontWeight: theme.typography.fontWeight.regular,
      letterSpacing: -0.5,
      lineHeight: 36,
    },
    secondaryDescription: {
      color: theme.colors.textMuted,
      fontFamily: theme.typography.fontFamily.regular,
      fontSize: theme.typography.fontSize.sm,
      lineHeight: theme.typography.lineHeight.sm,
    },
  });
}

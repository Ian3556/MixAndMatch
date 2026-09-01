import { StyleSheet, View } from 'react-native';

import { useAppTheme, type AppTheme } from '@/theme';

type HomeEditorialSkeletonProps = {
  isTablet: boolean;
  isWide: boolean;
};

export function HomeEditorialSkeleton({ isTablet, isWide }: HomeEditorialSkeletonProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={styles.page}
    >
      <SectionSkeleton isTablet={isTablet} isWide={isWide} styles={styles} />
      <SectionSkeleton isTablet={isTablet} isWide={isWide} reverse styles={styles} />
    </View>
  );
}

type SkeletonStyles = ReturnType<typeof createStyles>;

function SectionSkeleton({
  isTablet,
  isWide,
  reverse = false,
  styles,
}: HomeEditorialSkeletonProps & { reverse?: boolean; styles: SkeletonStyles }) {
  return (
    <View style={styles.section}>
      <View style={styles.headerSkeleton}>
        <View style={[styles.line, styles.eyebrowLine]} />
        <View style={[styles.line, styles.headingLine]} />
        <View style={[styles.line, styles.descriptionLine]} />
      </View>
      <View
        style={[
          styles.feature,
          isWide ? styles.featureWide : null,
          isWide && reverse ? styles.featureWideReverse : null,
        ]}
      >
        <View style={[styles.block, styles.heroImage]} />
        <View style={styles.copySkeleton}>
          <View style={[styles.line, styles.shortLine]} />
          <View style={[styles.line, styles.titleLine]} />
          <View style={[styles.line, styles.titleLineShort]} />
          <View style={[styles.line, styles.bodyLine]} />
          <View style={[styles.line, styles.bodyLineShort]} />
        </View>
      </View>
      <View style={styles.grid}>
        {[0, 1].map((index) => (
          <View key={index} style={[styles.gridItem, isTablet ? styles.gridItemTablet : null]}>
            <View style={[styles.block, styles.gridImage]} />
            <View style={[styles.line, styles.shortLine]} />
            <View style={[styles.line, styles.titleLineShort]} />
            <View style={[styles.line, styles.bodyLine]} />
          </View>
        ))}
      </View>
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    page: { gap: 88 },
    section: { gap: theme.spacing.xxl },
    headerSkeleton: { gap: theme.spacing.sm, maxWidth: 720 },
    feature: { gap: theme.spacing.xl },
    featureWide: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: theme.spacing.xxl,
    },
    featureWideReverse: { flexDirection: 'row-reverse' },
    copySkeleton: { flex: 1, gap: theme.spacing.md, width: '100%' },
    block: { backgroundColor: theme.colors.surfaceMuted },
    heroImage: { aspectRatio: 2 / 3, flex: 1.6, width: '100%' },
    line: { backgroundColor: theme.colors.surfaceMuted, height: 14 },
    eyebrowLine: { height: 12, width: 132 },
    headingLine: { height: 44, width: '72%' },
    descriptionLine: { height: 18, width: '58%' },
    shortLine: { height: 12, width: '28%' },
    titleLine: { height: 38, width: '90%' },
    titleLineShort: { height: 34, width: '64%' },
    bodyLine: { width: '100%' },
    bodyLineShort: { width: '74%' },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.xl },
    gridItem: { flexBasis: '100%', gap: theme.spacing.sm },
    gridItemTablet: { flexBasis: '46%', flexGrow: 1 },
    gridImage: { aspectRatio: 4 / 5, width: '100%' },
  });
}

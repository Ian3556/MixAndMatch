import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useMemo, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { AppScreen } from '@/components/ui/AppScreen';
import { resolveEditorialImageSource } from '@/features/home/components/editorialAssets';
import { EXPLORE_ROUTES } from '@/navigation/routes';
import type { ExploreStackParamList } from '@/navigation/types';
import { useAppTheme, type AppTheme } from '@/theme';
import { showDeferredNotice } from '@/utils/deferred';
import { getGridColumnCount } from '@/utils/layout';

import { ExploreFeedSkeleton } from '../components/ExploreFeedSkeleton';
import { ExploreMasonryFeed } from '../components/ExploreMasonryFeed';
import { useExploreDiscoveryContent } from '../hooks/useExploreDiscoveryContent';
import {
  EXPLORE_CATEGORY_OPTIONS,
  type ExploreCategoryId,
  type ExploreDiscoveryItem,
} from '../types/discovery';
import { getRelatedExploreItems } from '../utils/discovery';

type Props = NativeStackScreenProps<ExploreStackParamList, 'InspirationDetail'>;

const CATEGORY_LABELS = Object.fromEntries(
  EXPLORE_CATEGORY_OPTIONS.map((option) => [option.id, option.label]),
) as Record<ExploreCategoryId, string>;

export function ExploreOutfitDetailScreen({ navigation, route }: Props) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const { width } = useWindowDimensions();
  const { status, items, error, retry } = useExploreDiscoveryContent();
  const columnCount = getGridColumnCount(Math.min(width, 900));
  const selectedItem = useMemo(
    () =>
      items?.find((item) =>
        route.params.itemId
          ? item.id === route.params.itemId
          : item.inspirationId === route.params.inspirationId,
      ),
    [items, route.params.inspirationId, route.params.itemId],
  );
  const relatedItems = useMemo(
    () => (selectedItem && items ? getRelatedExploreItems(items, selectedItem) : []),
    [items, selectedItem],
  );

  const handleBack = useCallback(() => {
    if (navigation.canGoBack()) navigation.goBack();
    else navigation.replace(EXPLORE_ROUTES.EXPLORE);
  }, [navigation]);

  const openRelatedItem = useCallback(
    (item: ExploreDiscoveryItem) =>
      navigation.push(EXPLORE_ROUTES.INSPIRATION_DETAIL, { itemId: item.id }),
    [navigation],
  );

  if (status === 'loading') {
    return (
      <AppScreen onBack={handleBack} title="">
        <ExploreDetailSkeleton columnCount={columnCount} />
      </AppScreen>
    );
  }

  if (status === 'error') {
    return (
      <AppScreen onBack={handleBack} title="Outfit unavailable">
        <DetailState
          actionLabel="Try again"
          message={error.message}
          onAction={retry}
          styles={styles}
        />
      </AppScreen>
    );
  }

  if (!selectedItem) {
    return (
      <AppScreen onBack={handleBack} title="Outfit unavailable">
        <DetailState
          actionLabel="Return"
          message="This look is no longer part of the current editorial collection."
          onAction={handleBack}
          styles={styles}
        />
      </AppScreen>
    );
  }

  const categoryLabels = selectedItem.categoryIds.map((categoryId) => CATEGORY_LABELS[categoryId]);

  return (
    <AppScreen onBack={handleBack} title="">
      <DetailImage item={selectedItem} styles={styles} />

      <View style={styles.introduction}>
        <Text style={styles.eyebrow}>
          {selectedItem.style} · {selectedItem.aesthetic}
        </Text>
        <Text accessibilityRole="header" style={styles.title}>
          {selectedItem.title}
        </Text>
        <Text style={styles.metadata}>{selectedItem.tags.join(' / ')}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>STYLING NOTES</Text>
        <Text style={styles.description}>{selectedItem.description}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>ASSOCIATED PIECES</Text>
        <Text style={styles.pieces}>{categoryLabels.join(' · ')}</Text>
      </View>

      <Pressable
        accessibilityLabel={`Save ${selectedItem.title}`}
        accessibilityRole="button"
        onPress={() => showDeferredNotice('Saved styles')}
        style={({ pressed }) => [styles.saveButton, pressed ? styles.pressed : null]}
      >
        <Text style={styles.saveLabel}>♡ Save inspiration</Text>
      </Pressable>

      <View style={styles.relatedSection}>
        <Text style={styles.relatedLabel}>RELATED / MORE LIKE THIS</Text>
        {relatedItems.length > 0 ? (
          <ExploreMasonryFeed
            columnCount={columnCount}
            items={relatedItems}
            onOpenItem={openRelatedItem}
          />
        ) : (
          <Text style={styles.metadata}>No related looks are available in this collection.</Text>
        )}
      </View>
    </AppScreen>
  );
}

function DetailImage({
  item,
  styles,
}: {
  item: ExploreDiscoveryItem;
  styles: ReturnType<typeof createStyles>;
}) {
  const [loading, setLoading] = useState(true);
  const source = useMemo(() => resolveEditorialImageSource(item.image), [item.image]);
  const handleLoadEnd = useCallback(() => setLoading(false), []);
  const handleLoadStart = useCallback(() => setLoading(true), []);

  return (
    <View style={[styles.heroFrame, { aspectRatio: item.imageAspectRatio }]}>
      <Image
        accessibilityLabel={item.imageAlt}
        accessible
        fadeDuration={120}
        onLoadEnd={handleLoadEnd}
        onLoadStart={handleLoadStart}
        resizeMode="cover"
        source={source}
        style={styles.heroImage}
      />
      {loading ? <View accessibilityElementsHidden style={styles.heroSkeleton} /> : null}
    </View>
  );
}

function ExploreDetailSkeleton({ columnCount }: { columnCount: number }) {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <View accessibilityElementsHidden style={styles.skeletonLayout}>
      <View style={styles.detailSkeletonImage} />
      <View style={styles.detailSkeletonTitle} />
      <View style={styles.detailSkeletonMeta} />
      <View style={styles.detailSkeletonCopy} />
      <View style={styles.relatedSection}>
        <View style={styles.detailSkeletonLabel} />
        <ExploreFeedSkeleton columnCount={columnCount} />
      </View>
    </View>
  );
}

function DetailState({
  actionLabel,
  message,
  onAction,
  styles,
}: {
  actionLabel: string;
  message: string;
  onAction: () => void;
  styles: ReturnType<typeof createStyles>;
}) {
  return (
    <View style={styles.state}>
      <Text style={styles.description}>{message}</Text>
      <Pressable
        accessibilityRole="button"
        onPress={onAction}
        style={({ pressed }) => [styles.stateAction, pressed ? styles.pressed : null]}
      >
        <Text style={styles.stateActionLabel}>{actionLabel}</Text>
      </Pressable>
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    heroFrame: {
      alignSelf: 'center',
      backgroundColor: theme.colors.surfaceMuted,
      maxWidth: 680,
      overflow: 'hidden',
      width: '100%',
    },
    heroImage: { height: '100%', width: '100%' },
    heroSkeleton: {
      backgroundColor: theme.colors.surfaceMuted,
      bottom: 0,
      left: 0,
      position: 'absolute',
      right: 0,
      top: 0,
    },
    introduction: { gap: theme.spacing.xs, maxWidth: 720 },
    eyebrow: {
      color: theme.colors.textMuted,
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.xs,
      fontWeight: theme.typography.fontWeight.semibold,
      letterSpacing: 1,
      textTransform: 'uppercase',
    },
    title: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.editorial,
      fontSize: theme.typography.fontSize.xxl,
      fontWeight: theme.typography.fontWeight.bold,
      letterSpacing: -0.6,
      lineHeight: theme.typography.lineHeight.xxl,
    },
    metadata: {
      color: theme.colors.textMuted,
      fontFamily: theme.typography.fontFamily.regular,
      fontSize: theme.typography.fontSize.sm,
      lineHeight: theme.typography.lineHeight.sm,
    },
    section: {
      borderTopColor: theme.colors.border,
      borderTopWidth: StyleSheet.hairlineWidth,
      gap: theme.spacing.sm,
      maxWidth: 720,
      paddingTop: theme.spacing.md,
    },
    sectionLabel: {
      color: theme.colors.textMuted,
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.xs,
      fontWeight: theme.typography.fontWeight.semibold,
      letterSpacing: 1.2,
    },
    description: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.regular,
      fontSize: theme.typography.fontSize.md,
      lineHeight: theme.typography.lineHeight.md,
    },
    pieces: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.sm,
      lineHeight: theme.typography.lineHeight.sm,
    },
    saveButton: {
      alignItems: 'center',
      alignSelf: 'flex-start',
      borderColor: theme.colors.text,
      borderWidth: 1,
      justifyContent: 'center',
      minHeight: 48,
      paddingHorizontal: theme.spacing.lg,
    },
    saveLabel: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.semibold,
    },
    relatedSection: {
      borderTopColor: theme.colors.border,
      borderTopWidth: StyleSheet.hairlineWidth,
      gap: theme.spacing.lg,
      paddingTop: theme.spacing.xl,
    },
    relatedLabel: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.semibold,
      letterSpacing: 1.2,
    },
    skeletonLayout: { gap: theme.spacing.xl },
    detailSkeletonImage: {
      alignSelf: 'center',
      aspectRatio: 4 / 5,
      backgroundColor: theme.colors.surfaceMuted,
      maxWidth: 680,
      width: '100%',
    },
    detailSkeletonTitle: { backgroundColor: theme.colors.surfaceMuted, height: 34, width: '58%' },
    detailSkeletonMeta: { backgroundColor: theme.colors.surfaceMuted, height: 14, width: '36%' },
    detailSkeletonCopy: { backgroundColor: theme.colors.surfaceMuted, height: 72, width: '82%' },
    detailSkeletonLabel: { backgroundColor: theme.colors.surfaceMuted, height: 14, width: 180 },
    state: { alignItems: 'flex-start', gap: theme.spacing.lg },
    stateAction: {
      alignItems: 'center',
      borderColor: theme.colors.text,
      borderWidth: 1,
      justifyContent: 'center',
      minHeight: 48,
      paddingHorizontal: theme.spacing.lg,
    },
    stateActionLabel: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.medium,
      fontWeight: theme.typography.fontWeight.semibold,
    },
    pressed: { opacity: 0.7 },
  });
}

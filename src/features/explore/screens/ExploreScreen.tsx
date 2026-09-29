import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ActionButton } from '@/components/ActionButton';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { AppScreen } from '@/components/ui/AppScreen';
import { SearchBar } from '@/components/ui/SearchBar';
import { EXPLORE_ROUTES } from '@/navigation/routes';
import type { ExploreStackParamList } from '@/navigation/types';
import { useAppTheme, type AppTheme } from '@/theme';
import { getGridColumnCount } from '@/utils/layout';

import { ExploreFeedSkeleton } from '../components/ExploreFeedSkeleton';
import { ExploreFilterPanel } from '../components/ExploreFilterPanel';
import { ExploreMasonryFeed } from '../components/ExploreMasonryFeed';
import { useExploreDiscoveryContent } from '../hooks/useExploreDiscoveryContent';
import type { ExploreCategoryId, ExploreDiscoveryItem, ExploreStyle } from '../types/discovery';
import { filterExploreItems } from '../utils/discovery';

type Props = NativeStackScreenProps<ExploreStackParamList, 'Explore'>;

export function ExploreScreen({ navigation }: Props) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const { width } = useWindowDimensions();
  const { status, items, error, retry } = useExploreDiscoveryContent();
  const [query, setQuery] = useState('');
  const [activeQuery, setActiveQuery] = useState('');
  const [categoryIds, setCategoryIds] = useState<ExploreCategoryId[]>([]);
  const [selectedStyles, setSelectedStyles] = useState<ExploreStyle[]>([]);
  const [draftCategoryIds, setDraftCategoryIds] = useState<ExploreCategoryId[]>([]);
  const [draftStyles, setDraftStyles] = useState<ExploreStyle[]>([]);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const columnCount = getGridColumnCount(Math.min(width, 900));
  const activeFilterCount = categoryIds.length + selectedStyles.length;
  const hasActiveDiscoveryFilters = activeFilterCount > 0 || activeQuery.length > 0;

  const filteredItems = useMemo(
    () =>
      filterExploreItems(items ?? [], {
        query: activeQuery,
        categoryIds,
        styles: selectedStyles,
      }),
    [activeQuery, categoryIds, items, selectedStyles],
  );
  const draftResultCount = useMemo(
    () =>
      filterExploreItems(items ?? [], {
        query: activeQuery,
        categoryIds: draftCategoryIds,
        styles: draftStyles,
      }).length,
    [activeQuery, draftCategoryIds, draftStyles, items],
  );

  const submitSearch = () => setActiveQuery(query.trim());

  const openFilters = () => {
    setDraftCategoryIds(categoryIds);
    setDraftStyles(selectedStyles);
    setFiltersVisible(true);
  };

  const applyFilters = () => {
    setCategoryIds(draftCategoryIds);
    setSelectedStyles(draftStyles);
    setFiltersVisible(false);
  };

  const clearDiscovery = () => {
    setQuery('');
    setActiveQuery('');
    setCategoryIds([]);
    setSelectedStyles([]);
    setDraftCategoryIds([]);
    setDraftStyles([]);
  };

  const openItem = useCallback(
    (item: ExploreDiscoveryItem) =>
      navigation.navigate(EXPLORE_ROUTES.INSPIRATION_DETAIL, {
        itemId: item.id,
      }),
    [navigation],
  );

  return (
    <>
      <AppScreen hideHeader title="">
        <View style={styles.page}>
          <ActionButton
            label="Saved inspirations"
            onPress={() => navigation.navigate(EXPLORE_ROUTES.SAVED_INSPIRATIONS)}
            square
            variant="text"
          />
          <View style={styles.searchRow}>
            <View style={styles.search}>
              <SearchBar
                onChangeText={setQuery}
                onSubmit={submitSearch}
                placeholder="Search fashion, outfits, or styles"
                showSubmit={false}
                square
                value={query}
              />
            </View>
            <Pressable
              accessibilityLabel="Open Explore filters"
              accessibilityRole="button"
              accessibilityState={{ expanded: filtersVisible }}
              onPress={openFilters}
              style={({ pressed }) => [
                styles.filterButton,
                activeFilterCount > 0 ? styles.filterButtonActive : null,
                pressed ? styles.pressed : null,
              ]}
            >
              <Text accessibilityElementsHidden style={styles.filterIcon}>
                ≡
              </Text>
              <Text style={styles.filterLabel}>Filter</Text>
              {activeFilterCount > 0 ? (
                <Text style={styles.filterCount}>{activeFilterCount}</Text>
              ) : null}
            </Pressable>
          </View>

          {hasActiveDiscoveryFilters && status === 'ready' ? (
            <View style={styles.resultSummary}>
              <Text style={styles.resultCount}>
                {filteredItems.length} {filteredItems.length === 1 ? 'look' : 'looks'}
                {activeQuery ? ` for “${activeQuery}”` : ''}
              </Text>
              <Pressable
                accessibilityRole="button"
                onPress={clearDiscovery}
                style={({ pressed }) => [styles.clearInline, pressed ? styles.pressed : null]}
              >
                <Text style={styles.clearInlineLabel}>Clear</Text>
              </Pressable>
            </View>
          ) : null}

          {status === 'loading' ? (
            <ExploreFeedSkeleton columnCount={columnCount} />
          ) : status === 'error' ? (
            <ExploreErrorState message={error.message} onRetry={retry} styles={styles} />
          ) : filteredItems.length === 0 ? (
            <ExploreEmptyState onClear={clearDiscovery} styles={styles} />
          ) : (
            <ExploreMasonryFeed
              columnCount={columnCount}
              items={filteredItems}
              onOpenItem={openItem}
            />
          )}
        </View>
      </AppScreen>

      <ExploreFilterPanel
        categoryIds={draftCategoryIds}
        onApply={applyFilters}
        onClear={() => {
          setDraftCategoryIds([]);
          setDraftStyles([]);
        }}
        onDismiss={() => setFiltersVisible(false)}
        onToggleCategory={(categoryId) =>
          setDraftCategoryIds((current) => toggleSelection(current, categoryId))
        }
        onToggleStyle={(style) => setDraftStyles((current) => toggleSelection(current, style))}
        resultCount={draftResultCount}
        styles={draftStyles}
        visible={filtersVisible}
      />
    </>
  );
}

function ExploreErrorState({
  message,
  onRetry,
  styles,
}: {
  message: string;
  onRetry: () => void;
  styles: ReturnType<typeof createStyles>;
}) {
  return (
    <View style={styles.state}>
      <Text accessibilityRole="header" style={styles.stateTitle}>
        Explore could not load
      </Text>
      <Text style={styles.stateMessage}>{message}</Text>
      <Pressable
        accessibilityRole="button"
        onPress={onRetry}
        style={({ pressed }) => [styles.stateAction, pressed ? styles.pressed : null]}
      >
        <Text style={styles.stateActionLabel}>Try again</Text>
      </Pressable>
    </View>
  );
}

function ExploreEmptyState({
  onClear,
  styles,
}: {
  onClear: () => void;
  styles: ReturnType<typeof createStyles>;
}) {
  return (
    <View style={styles.state}>
      <Text accessibilityRole="header" style={styles.stateTitle}>
        No looks match this edit
      </Text>
      <Text style={styles.stateMessage}>
        Clear the current search and filters to return to the full discovery feed.
      </Text>
      <Pressable
        accessibilityRole="button"
        onPress={onClear}
        style={({ pressed }) => [styles.stateAction, pressed ? styles.pressed : null]}
      >
        <Text style={styles.stateActionLabel}>Clear search and filters</Text>
      </Pressable>
    </View>
  );
}

function toggleSelection<T>(current: readonly T[], value: T) {
  return current.includes(value) ? current.filter((item) => item !== value) : [...current, value];
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    page: { gap: theme.spacing.lg },
    searchRow: { alignItems: 'stretch', flexDirection: 'row', gap: theme.spacing.sm },
    search: { flex: 1, minWidth: 0 },
    filterButton: {
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
      borderWidth: 1,
      flexDirection: 'row',
      gap: theme.spacing.xs,
      justifyContent: 'center',
      minHeight: 52,
      paddingHorizontal: theme.spacing.md,
    },
    filterButtonActive: {
      backgroundColor: theme.colors.primarySoft,
      borderColor: theme.colors.primary,
    },
    filterIcon: { color: theme.colors.text, fontSize: theme.typography.fontSize.lg },
    filterLabel: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.semibold,
    },
    filterCount: {
      color: theme.colors.primary,
      fontFamily: theme.typography.fontFamily.bold,
      fontSize: theme.typography.fontSize.xs,
      fontWeight: theme.typography.fontWeight.bold,
    },
    resultSummary: {
      alignItems: 'center',
      borderBottomColor: theme.colors.border,
      borderBottomWidth: StyleSheet.hairlineWidth,
      flexDirection: 'row',
      gap: theme.spacing.md,
      paddingBottom: theme.spacing.sm,
    },
    resultCount: {
      color: theme.colors.textMuted,
      flex: 1,
      fontFamily: theme.typography.fontFamily.regular,
      fontSize: theme.typography.fontSize.sm,
    },
    clearInline: { justifyContent: 'center', minHeight: 44, paddingHorizontal: theme.spacing.sm },
    clearInlineLabel: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.semibold,
    },
    state: {
      borderTopColor: theme.colors.border,
      borderTopWidth: StyleSheet.hairlineWidth,
      gap: theme.spacing.md,
      paddingVertical: theme.spacing.xl,
    },
    stateTitle: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.editorial,
      fontSize: theme.typography.fontSize.xl,
      lineHeight: theme.typography.lineHeight.xl,
    },
    stateMessage: {
      color: theme.colors.textMuted,
      fontFamily: theme.typography.fontFamily.regular,
      fontSize: theme.typography.fontSize.sm,
      lineHeight: theme.typography.lineHeight.sm,
      maxWidth: 520,
    },
    stateAction: {
      alignItems: 'center',
      alignSelf: 'flex-start',
      borderColor: theme.colors.text,
      borderWidth: 1,
      justifyContent: 'center',
      minHeight: 48,
      paddingHorizontal: theme.spacing.md,
    },
    stateActionLabel: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.medium,
      fontWeight: theme.typography.fontWeight.semibold,
    },
    pressed: { opacity: 0.68 },
  });
}

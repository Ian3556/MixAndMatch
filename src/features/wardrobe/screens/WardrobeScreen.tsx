import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { AppScreen } from '@/components/ui/AppScreen';
import { Chip } from '@/components/ui/Chip';
import { SearchBar } from '@/components/ui/SearchBar';
import { ErrorState } from '@/components/ui/StateViews';
import { WardrobeItemCard } from '@/components/ui/WardrobeItemCard';
import { AddWardrobeItemMenu } from '@/features/wardrobe/components/AddWardrobeItemMenu';
import { WardrobeEmptyState } from '@/features/wardrobe/components/WardrobeEmptyState';
import { WardrobeListItem } from '@/features/wardrobe/components/WardrobeListItem';
import { WardrobeLoadingSkeleton } from '@/features/wardrobe/components/WardrobeLoadingSkeleton';
import { WardrobeSummary } from '@/features/wardrobe/components/WardrobeSummary';
import { WardrobeToolbar } from '@/features/wardrobe/components/WardrobeToolbar';
import { wardrobeCategories } from '@/fixtures/categories';
import { WARDROBE_ROUTES } from '@/navigation/routes';
import type { WardrobeStackParamList } from '@/navigation/types';
import { useAuthStore } from '@/store/authStore';
import { useWardrobeStore } from '@/store/wardrobeStore';
import { useAppTheme, type AppTheme } from '@/theme';
import { getGridColumnCount, getGridItemWidth } from '@/utils/layout';

type Props = NativeStackScreenProps<WardrobeStackParamList, 'Wardrobe'>;

export function WardrobeScreen({ navigation, route }: Props) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const { width } = useWindowDimensions();
  const user = useAuthStore((state) => state.user);
  const { items, status, error, loadedUserId, viewMode, refresh, setViewMode, toggleFavorite } =
    useWardrobeStore();
  const [category, setCategory] = useState('All');
  const [query, setQuery] = useState('');
  const [searchVisible, setSearchVisible] = useState(false);
  const [sort, setSort] = useState<'recent' | 'name'>('recent');
  const [addMenuVisible, setAddMenuVisible] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      if (user) void refresh(user.id);
    }, [refresh, user]),
  );

  const notice = route.params?.notice || null;
  const wardrobeItems = useMemo(
    () => (loadedUserId === user?.id ? items : []),
    [items, loadedUserId, user?.id],
  );
  const visibleItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return [...wardrobeItems]
      .filter((item) => category === 'All' || item.category === category)
      .filter((item) =>
        normalizedQuery
          ? [item.name, item.brand, item.category, item.primaryColor, item.material]
              .filter(Boolean)
              .some((value) => value?.toLowerCase().includes(normalizedQuery))
          : true,
      )
      .sort((left, right) =>
        sort === 'name'
          ? left.name.localeCompare(right.name)
          : right.createdAt.localeCompare(left.createdAt),
      );
  }, [category, query, sort, wardrobeItems]);

  const contentWidth = Math.min(width, 900);
  const columns = getGridColumnCount(contentWidth);
  const itemWidth = getGridItemWidth(contentWidth, columns, theme.spacing.md, theme.spacing.md);
  const initialLoading = Boolean(
    user && (loadedUserId !== user.id || (status === 'loading' && wardrobeItems.length === 0)),
  );

  const openItem = (itemId: string) => navigation.navigate(WARDROBE_ROUTES.ITEM_DETAIL, { itemId });

  const favoriteItem = (itemId: string) => {
    if (!user) return;
    void toggleFavorite(user.id, itemId).catch((caught: unknown) =>
      setActionError(
        caught instanceof Error ? caught.message : 'The favourite could not be updated.',
      ),
    );
  };

  const resetFilters = () => {
    setCategory('All');
    setQuery('');
  };

  return (
    <>
      <AppScreen hideHeader title="">
        {notice ? (
          <View accessibilityLiveRegion="polite" style={styles.notice}>
            <Ionicons color={theme.colors.success} name="checkmark-circle-outline" size={21} />
            <Text style={styles.noticeText}>{notice}</Text>
            <Pressable
              accessibilityLabel="Dismiss wardrobe success message"
              accessibilityRole="button"
              hitSlop={8}
              onPress={() => navigation.setParams({ notice: '' })}
            >
              <Ionicons color={theme.colors.textMuted} name="close-outline" size={21} />
            </Pressable>
          </View>
        ) : null}

        <WardrobeSummary items={wardrobeItems} loading={initialLoading} />

        <View style={styles.section}>
          <View style={styles.sectionHeadingRow}>
            <Text accessibilityRole="header" style={styles.sectionHeading}>
              Categories
            </Text>
            <WardrobeToolbar
              onAdd={() => setAddMenuVisible(true)}
              onChangeView={setViewMode}
              onToggleSearch={() => setSearchVisible((visible) => !visible)}
              onToggleSort={() => setSort((current) => (current === 'recent' ? 'name' : 'recent'))}
              searchVisible={searchVisible}
              sort={sort}
              viewMode={viewMode}
            />
          </View>

          {searchVisible ? (
            <SearchBar
              onChangeText={setQuery}
              onSubmit={() => setQuery((current) => current.trim())}
              placeholder="Search your wardrobe"
              showSubmit={false}
              square
              value={query}
            />
          ) : null}

          {actionError ? (
            <ErrorState
              action={{ label: 'Dismiss', onPress: () => setActionError(null) }}
              message={actionError}
              title="Wardrobe action failed"
            />
          ) : null}

          {status === 'error' && wardrobeItems.length > 0 ? (
            <View style={styles.refreshWarning}>
              <Text accessibilityLiveRegion="polite" style={styles.refreshWarningText}>
                {error ?? 'The latest wardrobe update could not be loaded.'}
              </Text>
              <Pressable
                accessibilityRole="button"
                onPress={() => user && void refresh(user.id)}
                style={styles.retryButton}
              >
                <Text style={styles.retryLabel}>Retry</Text>
              </Pressable>
            </View>
          ) : null}

          {initialLoading ? (
            <WardrobeLoadingSkeleton columnCount={columns} viewMode={viewMode} />
          ) : (
            <>
              <View style={styles.chips}>
                {wardrobeCategories.map((item) => (
                  <Chip
                    key={item.id}
                    label={item.label}
                    onPress={() => setCategory(item.label)}
                    selected={category === item.label}
                    square
                  />
                ))}
              </View>

              {status === 'error' && wardrobeItems.length === 0 ? (
                <ErrorState
                  action={{ label: 'Retry', onPress: () => user && void refresh(user.id) }}
                  message={error ?? 'Your wardrobe could not be loaded.'}
                  title="Wardrobe unavailable"
                />
              ) : visibleItems.length === 0 ? (
                <WardrobeEmptyState
                  actionLabel={wardrobeItems.length === 0 ? 'Add clothes' : 'Show all items'}
                  message={
                    wardrobeItems.length === 0
                      ? 'Add a piece manually or import products from a supported public retailer page.'
                      : category !== 'All'
                        ? `There are no saved items in ${category}. Choose another category or add a new piece.`
                        : 'No wardrobe items match the current search.'
                  }
                  onAction={
                    wardrobeItems.length === 0 ? () => setAddMenuVisible(true) : resetFilters
                  }
                  title={
                    wardrobeItems.length === 0
                      ? 'Your wardrobe is ready for its first piece'
                      : category !== 'All'
                        ? `${category} is empty`
                        : 'No matching items'
                  }
                  variant={wardrobeItems.length === 0 ? 'add' : 'clear'}
                />
              ) : viewMode === 'grid' ? (
                <View style={styles.grid}>
                  {visibleItems.map((item) => (
                    <WardrobeItemCard
                      item={item}
                      key={item.id}
                      onFavorite={() => favoriteItem(item.id)}
                      onOpen={() => openItem(item.id)}
                      width={itemWidth}
                    />
                  ))}
                </View>
              ) : (
                <View>
                  {visibleItems.map((item) => (
                    <WardrobeListItem
                      item={item}
                      key={item.id}
                      onFavorite={() => favoriteItem(item.id)}
                      onOpen={() => openItem(item.id)}
                    />
                  ))}
                </View>
              )}
            </>
          )}
        </View>
      </AppScreen>

      <AddWardrobeItemMenu
        onBrowse={() => navigation.navigate(WARDROBE_ROUTES.BROWSE_BRANDS)}
        onDismiss={() => setAddMenuVisible(false)}
        onImport={() => navigation.navigate(WARDROBE_ROUTES.IMPORT_WEBSITE)}
        onManual={() =>
          navigation.navigate(WARDROBE_ROUTES.ADD_ITEM_DETAILS, { imageKey: 'manual' })
        }
        visible={addMenuVisible}
      />
    </>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    notice: {
      alignItems: 'center',
      borderColor: theme.colors.success,
      borderWidth: 1,
      flexDirection: 'row',
      gap: theme.spacing.sm,
      padding: theme.spacing.md,
    },
    noticeText: {
      color: theme.colors.text,
      flex: 1,
      fontFamily: theme.typography.fontFamily.regular,
      fontSize: theme.typography.fontSize.sm,
      lineHeight: theme.typography.lineHeight.sm,
    },
    section: { gap: theme.spacing.lg },
    sectionHeadingRow: {
      alignItems: 'center',
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.md,
      justifyContent: 'space-between',
    },
    sectionHeading: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.editorial,
      fontSize: theme.typography.fontSize.xl,
      lineHeight: theme.typography.lineHeight.xl,
    },
    chips: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.md },
    refreshWarning: {
      alignItems: 'center',
      borderColor: theme.colors.warning,
      borderWidth: 1,
      flexDirection: 'row',
      gap: theme.spacing.md,
      padding: theme.spacing.md,
    },
    refreshWarningText: {
      color: theme.colors.text,
      flex: 1,
      fontFamily: theme.typography.fontFamily.regular,
      fontSize: theme.typography.fontSize.sm,
      lineHeight: theme.typography.lineHeight.sm,
    },
    retryButton: { justifyContent: 'center', minHeight: 44, paddingHorizontal: theme.spacing.sm },
    retryLabel: {
      color: theme.colors.primary,
      fontFamily: theme.typography.fontFamily.medium,
      fontWeight: theme.typography.fontWeight.semibold,
    },
  });
}

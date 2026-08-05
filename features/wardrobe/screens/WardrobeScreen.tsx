import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';

import { ActionButton } from '@/components/ActionButton';
import { AppScreen } from '@/components/ui/AppScreen';
import { Chip } from '@/components/ui/Chip';
import { IconButton } from '@/components/ui/IconButton';
import { StatCard } from '@/components/ui/ProfilePrimitives';
import { SearchBar } from '@/components/ui/SearchBar';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/StateViews';
import { WardrobeItemCard } from '@/components/ui/WardrobeItemCard';
import { wardrobeCategories } from '@/fixtures/categories';
import { WARDROBE_ROUTES } from '@/navigation/routes';
import type { WardrobeStackParamList } from '@/navigation/types';
import { useAuthStore } from '@/store/authStore';
import { useWardrobeStore } from '@/store/wardrobeStore';
import { useAppTheme, type AppTheme } from '@/theme';
import { getGridColumnCount, getGridItemWidth } from '@/utils/layout';

type Props = NativeStackScreenProps<WardrobeStackParamList, 'Wardrobe'>;

export function WardrobeScreen({ navigation }: Props) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const { width } = useWindowDimensions();
  const user = useAuthStore((state) => state.user);
  const { items, status, error, loadedUserId, refresh, toggleFavorite } = useWardrobeStore();
  const [category, setCategory] = useState('All');
  const [query, setQuery] = useState('');
  const [searchVisible, setSearchVisible] = useState(false);
  const [sort, setSort] = useState<'recent' | 'name'>('recent');
  const [actionError, setActionError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      if (user) void refresh(user.id);
    }, [refresh, user]),
  );

  const visibleItems = useMemo(() => {
    if (loadedUserId !== user?.id) return [];
    const normalizedQuery = query.trim().toLowerCase();
    return [...items]
      .filter((item) => category === 'All' || item.category === category)
      .filter((item) =>
        normalizedQuery
          ? [item.name, item.brand, item.category, item.primaryColor]
              .filter(Boolean)
              .some((value) => value?.toLowerCase().includes(normalizedQuery))
          : true,
      )
      .sort((left, right) =>
        sort === 'name'
          ? left.name.localeCompare(right.name)
          : right.createdAt.localeCompare(left.createdAt),
      );
  }, [category, items, loadedUserId, query, sort, user?.id]);

  const columns = getGridColumnCount(Math.min(width, 900));
  const itemWidth = getGridItemWidth(
    Math.min(width, 900),
    columns,
    theme.spacing.md,
    theme.spacing.md,
  );
  const topCategory = mostCommon(items.map((item) => item.category));
  const topColor = mostCommon(items.map((item) => item.primaryColor).filter(isString));

  return (
    <AppScreen
      actions={
        <>
          <IconButton
            label={searchVisible ? 'Hide wardrobe search' : 'Search wardrobe'}
            onPress={() => setSearchVisible((visible) => !visible)}
            selected={searchVisible}
            symbol="âŒ•"
          />
          <IconButton
            label={`Sort wardrobe by ${sort === 'recent' ? 'name' : 'most recent'}`}
            onPress={() => setSort((current) => (current === 'recent' ? 'name' : 'recent'))}
            selected={sort === 'name'}
            symbol="â‰¡"
          />
        </>
      }
      eyebrow="Your collection"
      subtitle={`${items.length} saved item${items.length === 1 ? '' : 's'} Â· sorted by ${sort}`}
      title="Wardrobe"
    >
      <View style={styles.primaryActions}>
        <View style={styles.flexAction}>
          <ActionButton
            label="Import from Website"
            onPress={() => navigation.navigate(WARDROBE_ROUTES.IMPORT_WEBSITE)}
          />
        </View>
        <View style={styles.flexAction}>
          <ActionButton
            label="Add manually"
            onPress={() => navigation.navigate(WARDROBE_ROUTES.ADD_ITEM_ENTRY)}
            variant="secondary"
          />
        </View>
      </View>

      {searchVisible ? (
        <SearchBar
          onChangeText={setQuery}
          onSubmit={() => setQuery((current) => current.trim())}
          placeholder="Search your wardrobe"
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

      <View style={styles.section}>
        <SectionHeader title="Categories" />
        <View style={styles.chips}>
          {wardrobeCategories.map((item) => (
            <Chip
              key={item.id}
              label={item.label}
              onPress={() => setCategory(item.label)}
              selected={category === item.label}
            />
          ))}
        </View>
      </View>

      {status === 'loading' && loadedUserId === user?.id && items.length === 0 ? (
        <LoadingState message="Loading your saved items." title="Opening wardrobeâ€¦" />
      ) : null}
      {status === 'error' ? (
        <ErrorState
          action={{ label: 'Retry', onPress: () => user && void refresh(user.id) }}
          message={error ?? 'Your wardrobe could not be loaded.'}
          title="Wardrobe unavailable"
        />
      ) : null}
      {status !== 'loading' && status !== 'error' && visibleItems.length === 0 ? (
        <EmptyState
          action={
            items.length === 0
              ? {
                  label: 'Import from Website',
                  onPress: () => navigation.navigate(WARDROBE_ROUTES.IMPORT_WEBSITE),
                }
              : {
                  label: 'Show all items',
                  onPress: () => {
                    setCategory('All');
                    setQuery('');
                  },
                }
          }
          message={
            items.length === 0
              ? 'Import a public retailer page or add an item manually to build your wardrobe.'
              : 'No saved items match the current search and category.'
          }
          symbol="ï¼‹"
          title={items.length === 0 ? 'Your wardrobe is empty' : 'No matching items'}
        />
      ) : null}

      {visibleItems.length > 0 ? (
        <View style={styles.grid}>
          {visibleItems.map((item) => (
            <WardrobeItemCard
              item={item}
              key={item.id}
              onFavorite={() => {
                if (!user) return;
                void toggleFavorite(user.id, item.id).catch((caught: unknown) =>
                  setActionError(
                    caught instanceof Error
                      ? caught.message
                      : 'The favourite could not be updated.',
                  ),
                );
              }}
              onOpen={() => navigation.navigate(WARDROBE_ROUTES.ITEM_DETAIL, { itemId: item.id })}
              width={itemWidth}
            />
          ))}
        </View>
      ) : null}

      <View style={styles.section}>
        <SectionHeader subtitle="Calculated from your saved items" title="Wardrobe summary" />
        <View style={styles.stats}>
          <StatCard label="Total items" value={String(items.length)} />
          <StatCard label="Top category" value={topCategory ?? 'â€”'} />
          <StatCard label="Most-used colour" value={topColor ?? 'â€”'} />
          <StatCard
            label="Recently added"
            value={items[0] ? new Date(items[0].createdAt).toLocaleDateString() : 'â€”'}
          />
        </View>
      </View>
    </AppScreen>
  );
}

function mostCommon(values: string[]): string | undefined {
  const counts = new Map<string, number>();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  return [...counts].sort((left, right) => right[1] - left[1])[0]?.[0];
}

function isString(value: string | null): value is string {
  return Boolean(value);
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    primaryActions: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
    flexAction: { flex: 1, minWidth: 180 },
    section: { gap: theme.spacing.md },
    chips: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.md },
    stats: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
  });
}

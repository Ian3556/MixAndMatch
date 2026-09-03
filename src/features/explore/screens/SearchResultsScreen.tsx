import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { AppScreen } from '@/components/ui/AppScreen';
import { IconButton } from '@/components/ui/IconButton';
import { InspirationCard } from '@/components/ui/InspirationCard';
import { SearchBar } from '@/components/ui/SearchBar';
import { EmptyState } from '@/components/ui/StateViews';
import { allInspiration } from '@/fixtures/inspiration';
import { EXPLORE_ROUTES } from '@/navigation/routes';
import type { ExploreStackParamList } from '@/navigation/types';
import { useAppTheme, type AppTheme } from '@/theme';
import { showDeferredNotice } from '@/utils/deferred';
import { getGridColumnCount, getGridItemWidth } from '@/utils/layout';

type Props = NativeStackScreenProps<ExploreStackParamList, 'SearchResults'>;

export function SearchResultsScreen({ navigation, route }: Props) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const { width } = useWindowDimensions();
  const [query, setQuery] = useState(route.params.query);
  const [submittedQuery, setSubmittedQuery] = useState(route.params.query);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const normalizedQuery = submittedQuery.trim().toLowerCase();
  const results = useMemo(
    () =>
      allInspiration.filter((item) =>
        normalizedQuery
          ? `${item.title} ${item.category} ${item.caption}`.toLowerCase().includes(normalizedQuery)
          : true,
      ),
    [normalizedQuery],
  );
  const columns = viewMode === 'list' ? 1 : getGridColumnCount(Math.min(width, 900));
  const itemWidth = getGridItemWidth(
    Math.min(width, 900),
    columns,
    theme.spacing.md,
    theme.spacing.md,
  );

  const openResult = (inspirationId: string) => {
    navigation.navigate(EXPLORE_ROUTES.INSPIRATION_DETAIL, { inspirationId });
  };

  return (
    <AppScreen
      actions={
        <>
          <IconButton
            label="Sort search results"
            onPress={() => showDeferredNotice('Search sorting')}
            symbol="↕"
          />
          <IconButton
            label="Filter search results"
            onPress={() => showDeferredNotice('Search filters')}
            symbol="≡"
          />
        </>
      }
      onBack={navigation.goBack}
      subtitle="Local fixture filtering only—no external catalogue is connected."
      title="Search results"
    >
      <SearchBar
        onChangeText={setQuery}
        onSubmit={() => setSubmittedQuery(query)}
        submitLabel="→"
        value={query}
      />
      <View style={styles.toolbar}>
        <Text style={styles.count}>
          {results.length} {results.length === 1 ? 'result' : 'results'}
          {normalizedQuery ? ` for “${submittedQuery.trim()}”` : ''}
        </Text>
        <View style={styles.viewActions}>
          <IconButton
            label="Grid view"
            onPress={() => setViewMode('grid')}
            selected={viewMode === 'grid'}
            symbol="▦"
          />
          <IconButton
            label="List view"
            onPress={() => setViewMode('list')}
            selected={viewMode === 'list'}
            symbol="☷"
          />
        </View>
      </View>
      {results.length === 0 ? (
        <EmptyState
          action={{
            label: 'Clear search',
            onPress: () => {
              setQuery('');
              setSubmittedQuery('');
            },
          }}
          message="Try a broader style, category, or occasion. Explore search still checks only local editorial fixtures."
          symbol="⌕"
          title="No fixture results match"
        />
      ) : (
        <View style={styles.grid}>
          {results.map((item) => (
            <InspirationCard
              item={item}
              key={item.id}
              onMore={() => showDeferredNotice('Search result options')}
              onOpen={() => openResult(item.id)}
              onSave={() => showDeferredNotice('Saved styles')}
              width={itemWidth}
            />
          ))}
        </View>
      )}
    </AppScreen>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    toolbar: { alignItems: 'center', flexDirection: 'row', gap: theme.spacing.md },
    count: { color: theme.colors.textMuted, flex: 1, fontSize: theme.typography.fontSize.sm },
    viewActions: { flexDirection: 'row', gap: theme.spacing.xs },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.md },
  });
}

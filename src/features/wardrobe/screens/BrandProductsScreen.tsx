import Ionicons from '@expo/vector-icons/Ionicons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';

import type { CatalogCategory, CatalogProductSummary } from '@/catalog/browseTypes';
import { loadBrandCategories, loadBrandProducts } from '@/catalog/services/catalogBrowseService';
import { ActionButton } from '@/components/ActionButton';
import { AppScreen } from '@/components/ui/AppScreen';
import { Chip } from '@/components/ui/Chip';
import { SearchBar } from '@/components/ui/SearchBar';
import { EmptyState, ErrorState } from '@/components/ui/StateViews';
import { CatalogBrowseSkeleton } from '@/features/wardrobe/components/CatalogBrowseSkeleton';
import { CatalogProductCard } from '@/features/wardrobe/components/CatalogProductCard';
import { WARDROBE_ROUTES } from '@/navigation/routes';
import type { WardrobeStackParamList } from '@/navigation/types';
import { useAppTheme, type AppTheme } from '@/theme';
import type { WardrobeViewMode } from '@/store/wardrobeStore';
import { getGridColumnCount, getGridItemWidth } from '@/utils/layout';

type Props = NativeStackScreenProps<WardrobeStackParamList, 'BrandProducts'>;

export function BrandProductsScreen({ navigation, route }: Props) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const { width } = useWindowDimensions();
  const [query, setQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [categories, setCategories] = useState<CatalogCategory[]>([]);
  const [products, setProducts] = useState<CatalogProductSummary[]>([]);
  const [viewMode, setViewMode] = useState<WardrobeViewMode>('grid');
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);
  const [requestKey, setRequestKey] = useState(0);

  useEffect(() => {
    let active = true;
    void loadBrandCategories(route.params.brandId)
      .then((result) => {
        if (active) setCategories(result);
      })
      .catch(() => {
        if (active) setCategories([]);
      });
    return () => {
      active = false;
    };
  }, [route.params.brandId]);

  useEffect(() => {
    let active = true;
    void loadBrandProducts({
      brandId: route.params.brandId,
      query: submittedQuery,
      categoryId,
      page,
    })
      .then((result) => {
        if (!active) return;
        setProducts((current) => (page === 0 ? result.items : [...current, ...result.items]));
        setHasMore(result.hasMore);
        setStatus('ready');
        setError(null);
      })
      .catch((caught: unknown) => {
        if (!active) return;
        setStatus('error');
        setError(caught instanceof Error ? caught.message : 'The brand catalog could not load.');
      });
    return () => {
      active = false;
    };
  }, [categoryId, page, requestKey, route.params.brandId, submittedQuery]);

  const reloadFromStart = () => {
    setProducts([]);
    setPage(0);
    setStatus('loading');
  };

  const submitSearch = () => {
    const next = query.trim();
    reloadFromStart();
    setSubmittedQuery(next);
    if (next === submittedQuery) setRequestKey((current) => current + 1);
  };

  const chooseCategory = (nextCategoryId: string | null) => {
    reloadFromStart();
    setCategoryId(nextCategoryId);
    if (nextCategoryId === categoryId) setRequestKey((current) => current + 1);
  };

  const contentWidth = Math.min(width, 900);
  const columns = getGridColumnCount(contentWidth);
  const itemWidth = getGridItemWidth(contentWidth, columns, theme.spacing.md, theme.spacing.md);
  const unsupported = ['blocked', 'unavailable', 'manual_seed_required'].includes(
    route.params.brandStatus,
  );

  return (
    <AppScreen onBack={navigation.goBack} title={route.params.brandName}>
      <View style={styles.toolbar}>
        <View style={styles.search}>
          <SearchBar
            onChangeText={setQuery}
            onSubmit={submitSearch}
            placeholder={`Search ${route.params.brandName}`}
            showSubmit={false}
            square
            value={query}
          />
        </View>
        <View style={styles.viewToggle}>
          {(['grid', 'list'] as const).map((mode) => (
            <Pressable
              accessibilityLabel={`Use ${mode} view`}
              accessibilityRole="button"
              accessibilityState={{ selected: viewMode === mode }}
              key={mode}
              onPress={() => setViewMode(mode)}
              style={({ pressed }) => [
                styles.modeButton,
                viewMode === mode ? styles.modeButtonSelected : null,
                pressed ? styles.pressed : null,
              ]}
            >
              <Ionicons
                color={viewMode === mode ? theme.colors.primary : theme.colors.textMuted}
                name={mode === 'grid' ? 'grid-outline' : 'list-outline'}
                size={20}
              />
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.categories}>
        <Chip label="All" onPress={() => chooseCategory(null)} selected={!categoryId} square />
        {categories.map((category) => (
          <Chip
            key={category.id}
            label={category.name}
            onPress={() => chooseCategory(category.id)}
            selected={categoryId === category.id}
            square
          />
        ))}
      </View>

      {status === 'loading' ? <CatalogBrowseSkeleton rows={6} /> : null}
      {status === 'error' ? (
        <ErrorState
          action={{
            label: 'Retry',
            onPress: () => {
              setStatus('loading');
              setRequestKey((current) => current + 1);
            },
          }}
          message={error ?? 'The products could not load.'}
          title="Products unavailable"
        />
      ) : null}

      {status === 'ready' && products.length > 0 ? (
        <View style={viewMode === 'grid' ? styles.grid : styles.list}>
          {products.map((product) => (
            <CatalogProductCard
              key={product.id}
              onPress={() =>
                navigation.navigate(WARDROBE_ROUTES.CATALOG_PRODUCT, { productId: product.id })
              }
              product={product}
              viewMode={viewMode}
              {...(viewMode === 'grid' ? { width: itemWidth } : {})}
            />
          ))}
        </View>
      ) : null}

      {status === 'ready' && products.length === 0 ? (
        <View style={styles.emptyActions}>
          <EmptyState
            message={
              unsupported && !submittedQuery && !categoryId
                ? 'This brand is not currently available in our catalog.'
                : 'No products found. Try another search or category.'
            }
            title={unsupported ? 'Catalog not available yet' : 'No products found'}
          />
          <ActionButton
            label="Import from website"
            onPress={() => navigation.navigate(WARDROBE_ROUTES.IMPORT_WEBSITE)}
          />
          <ActionButton
            label="Add manually"
            onPress={() =>
              navigation.navigate(WARDROBE_ROUTES.ADD_ITEM_DETAILS, {
                imageKey: 'manual',
                initialDraft: { brand: route.params.brandName },
              })
            }
            variant="secondary"
          />
        </View>
      ) : null}

      {status === 'ready' && hasMore ? (
        <ActionButton
          label="Load more products"
          onPress={() => {
            setStatus('loading');
            setPage((current) => current + 1);
          }}
          variant="secondary"
        />
      ) : null}
    </AppScreen>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    toolbar: {
      alignItems: 'center',
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
    },
    search: { flex: 1, minWidth: 240 },
    viewToggle: { borderColor: theme.colors.border, borderWidth: 1, flexDirection: 'row' },
    modeButton: { alignItems: 'center', height: 50, justifyContent: 'center', width: 50 },
    modeButtonSelected: { backgroundColor: theme.colors.primarySoft },
    categories: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.md },
    list: { gap: theme.spacing.sm },
    emptyActions: { gap: theme.spacing.sm },
    pressed: { opacity: 0.68 },
  });
}

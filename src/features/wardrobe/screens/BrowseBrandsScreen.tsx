import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { CatalogBrand, CatalogProductSummary } from '@/catalog/browseTypes';
import {
  loadBrands,
  loadFeaturedBrands,
  searchCatalogProducts,
} from '@/catalog/services/catalogBrowseService';
import { ActionButton } from '@/components/ActionButton';
import { AppScreen } from '@/components/ui/AppScreen';
import { SearchBar } from '@/components/ui/SearchBar';
import { EmptyState, ErrorState } from '@/components/ui/StateViews';
import { CatalogBrandRow } from '@/features/wardrobe/components/CatalogBrandRow';
import { CatalogBrowseSkeleton } from '@/features/wardrobe/components/CatalogBrowseSkeleton';
import { CatalogProductCard } from '@/features/wardrobe/components/CatalogProductCard';
import { WARDROBE_ROUTES } from '@/navigation/routes';
import type { WardrobeStackParamList } from '@/navigation/types';
import { useAppTheme, type AppTheme } from '@/theme';

type Props = NativeStackScreenProps<WardrobeStackParamList, 'BrowseBrands'>;

export function BrowseBrandsScreen({ navigation }: Props) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const [query, setQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [brands, setBrands] = useState<CatalogBrand[]>([]);
  const [featuredBrands, setFeaturedBrands] = useState<CatalogBrand[]>([]);
  const [products, setProducts] = useState<CatalogProductSummary[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);
  const [requestKey, setRequestKey] = useState(0);

  useEffect(() => {
    let active = true;
    void Promise.all([
      loadBrands({ query: submittedQuery, page }),
      page === 0 && submittedQuery
        ? searchCatalogProducts(submittedQuery, { pageSize: 8 })
        : Promise.resolve(null),
      page === 0 && !submittedQuery ? loadFeaturedBrands() : Promise.resolve(null),
    ])
      .then(([brandPage, productPage, featured]) => {
        if (!active) return;
        setBrands((current) => (page === 0 ? brandPage.items : [...current, ...brandPage.items]));
        setHasMore(brandPage.hasMore);
        if (productPage) setProducts(productPage.items);
        else if (page === 0) setProducts([]);
        if (featured) setFeaturedBrands(featured);
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
  }, [page, requestKey, submittedQuery]);

  const submitSearch = () => {
    setStatus('loading');
    setBrands([]);
    setProducts([]);
    setPage(0);
    setSubmittedQuery(query.trim());
    if (query.trim() === submittedQuery) setRequestKey((current) => current + 1);
  };

  const openBrand = (brand: CatalogBrand) =>
    navigation.navigate(WARDROBE_ROUTES.BRAND_PRODUCTS, {
      brandId: brand.id,
      brandName: brand.name,
      brandStatus: brand.status,
    });

  const openProduct = (product: CatalogProductSummary) =>
    navigation.navigate(WARDROBE_ROUTES.CATALOG_PRODUCT, { productId: product.id });

  const openManual = () =>
    navigation.navigate(WARDROBE_ROUTES.ADD_ITEM_DETAILS, { imageKey: 'manual' });

  return (
    <AppScreen onBack={navigation.goBack} title="Browse brands">
      <SearchBar
        onChangeText={setQuery}
        onSubmit={submitSearch}
        placeholder="Search brands or products"
        square
        submitLabel="Search"
        value={query}
      />

      {status === 'loading' ? <CatalogBrowseSkeleton /> : null}
      {status === 'error' ? (
        <ErrorState
          action={{
            label: 'Retry',
            onPress: () => {
              setStatus('loading');
              setRequestKey((current) => current + 1);
            },
          }}
          message={error ?? 'The brand catalog could not load.'}
          title="Catalog unavailable"
        />
      ) : null}

      {status === 'ready' && !submittedQuery ? (
        <View style={styles.section}>
          <Text accessibilityRole="header" style={styles.heading}>
            Featured brands
          </Text>
          {featuredBrands.length > 0 ? (
            featuredBrands.map((brand) => (
              <CatalogBrandRow brand={brand} key={brand.id} onPress={() => openBrand(brand)} />
            ))
          ) : (
            <Text style={styles.muted}>No featured brands are published yet.</Text>
          )}
        </View>
      ) : null}

      {status === 'ready' && products.length > 0 ? (
        <View style={styles.section}>
          <Text accessibilityRole="header" style={styles.heading}>
            Matching products
          </Text>
          <View style={styles.productGrid}>
            {products.map((product) => (
              <CatalogProductCard
                key={product.id}
                onPress={() => openProduct(product)}
                product={product}
                viewMode="list"
              />
            ))}
          </View>
        </View>
      ) : null}

      {status === 'ready' ? (
        <View style={styles.section}>
          <Text accessibilityRole="header" style={styles.heading}>
            {submittedQuery ? 'Brands' : 'All brands'}
          </Text>
          {brands.length > 0 ? (
            brands.map((brand) => (
              <CatalogBrandRow brand={brand} key={brand.id} onPress={() => openBrand(brand)} />
            ))
          ) : products.length === 0 ? (
            <EmptyState
              action={{
                label: 'Import from website',
                onPress: () => navigation.navigate(WARDROBE_ROUTES.IMPORT_WEBSITE),
              }}
              message="Try another search, import a product page, or add the item manually."
              title="No brands found"
            />
          ) : null}
          {hasMore ? (
            <ActionButton
              label="Load more brands"
              onPress={() => {
                setStatus('loading');
                setPage((current) => current + 1);
              }}
              variant="secondary"
            />
          ) : null}
        </View>
      ) : null}

      {status === 'ready' && brands.length === 0 && products.length === 0 ? (
        <ActionButton label="Add manually" onPress={openManual} variant="secondary" />
      ) : null}
    </AppScreen>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    section: { gap: theme.spacing.md },
    heading: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.editorial,
      fontSize: theme.typography.fontSize.xl,
      lineHeight: theme.typography.lineHeight.xl,
    },
    muted: {
      color: theme.colors.textMuted,
      fontFamily: theme.typography.fontFamily.regular,
      fontSize: theme.typography.fontSize.sm,
    },
    productGrid: { gap: theme.spacing.sm },
  });
}

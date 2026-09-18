import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import type { CatalogProductDetail, CatalogProductVariant } from '@/catalog/browseTypes';
import { loadCatalogProduct } from '@/catalog/services/catalogBrowseService';
import { ActionButton } from '@/components/ActionButton';
import { AppScreen } from '@/components/ui/AppScreen';
import { Chip } from '@/components/ui/Chip';
import { PlaceholderArtwork } from '@/components/ui/PlaceholderArtwork';
import { ErrorState } from '@/components/ui/StateViews';
import { CatalogBrowseSkeleton } from '@/features/wardrobe/components/CatalogBrowseSkeleton';
import {
  buildCatalogWardrobeInput,
  createCatalogInstanceKey,
} from '@/features/wardrobe/catalog/catalogWardrobeItem';
import { WARDROBE_ROUTES } from '@/navigation/routes';
import type { WardrobeStackParamList } from '@/navigation/types';
import { useAuthStore } from '@/store/authStore';
import { useWardrobeStore } from '@/store/wardrobeStore';
import { useAppTheme, type AppTheme } from '@/theme';

type Props = NativeStackScreenProps<WardrobeStackParamList, 'CatalogProduct'>;

export function CatalogProductDetailScreen({ navigation, route }: Props) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const user = useAuthStore((state) => state.user);
  const wardrobeItems = useWardrobeStore((state) =>
    state.loadedUserId === user?.id ? state.items : [],
  );
  const addMany = useWardrobeStore((state) => state.addMany);
  const [product, setProduct] = useState<CatalogProductDetail | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [imageFailed, setImageFailed] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [duplicateConfirmed, setDuplicateConfirmed] = useState(false);
  const [requestKey, setRequestKey] = useState(0);
  const saveLock = useRef(false);

  useEffect(() => {
    let active = true;
    void loadCatalogProduct(route.params.productId)
      .then((loaded) => {
        if (!active) return;
        const firstVariant = loaded.variants[0];
        setProduct(loaded);
        setSelectedColor(firstVariant?.color ?? null);
        setSelectedSize(firstVariant?.size ?? null);
        setStatus('ready');
        setError(null);
      })
      .catch((caught: unknown) => {
        if (!active) return;
        setStatus('error');
        setError(caught instanceof Error ? caught.message : 'The product could not load.');
      });
    return () => {
      active = false;
    };
  }, [requestKey, route.params.productId]);

  const colors = useMemo(
    () => unique(product?.variants.map((variant) => variant.color) ?? []),
    [product],
  );
  const sizes = useMemo(
    () =>
      unique(
        product?.variants
          .filter((variant) => !selectedColor || variant.color === selectedColor)
          .map((variant) => variant.size) ?? [],
      ),
    [product, selectedColor],
  );
  const selectedVariant = useMemo(
    () => selectVariant(product?.variants ?? [], selectedColor, selectedSize),
    [product, selectedColor, selectedSize],
  );
  const alreadyOwned = Boolean(
    product && wardrobeItems.some((item) => item.catalogProductId === product.id),
  );

  const chooseColor = (color: string) => {
    setSelectedColor(color);
    const sizesForColor = unique(
      product?.variants
        .filter((variant) => variant.color === color)
        .map((variant) => variant.size) ?? [],
    );
    if (!selectedSize || !sizesForColor.includes(selectedSize))
      setSelectedSize(sizesForColor[0] ?? null);
  };

  const save = async () => {
    if (!user || !product || saveLock.current) return;
    if (alreadyOwned && !duplicateConfirmed) {
      setError('You already have this item in your wardrobe. Choose Add another to continue.');
      return;
    }
    saveLock.current = true;
    setIsSaving(true);
    setError(null);
    try {
      const input = buildCatalogWardrobeInput(
        product,
        selectedVariant,
        alreadyOwned ? createCatalogInstanceKey() : undefined,
      );
      const [result] = await addMany(user.id, [input]);
      if (result?.status === 'added') {
        navigation.popTo(WARDROBE_ROUTES.WARDROBE, {
          notice: `${product.name} was added to your wardrobe.`,
        });
      } else if (result?.status === 'duplicate') {
        setError('You already have this item in your wardrobe. Choose Add another to continue.');
      } else {
        setError(result?.message ?? 'The product could not be added.');
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'The product could not be added.');
    } finally {
      saveLock.current = false;
      setIsSaving(false);
    }
  };

  if (status === 'loading') {
    return (
      <AppScreen onBack={navigation.goBack} title="Product">
        <CatalogBrowseSkeleton rows={4} />
      </AppScreen>
    );
  }

  if (status === 'error' || !product) {
    return (
      <AppScreen onBack={navigation.goBack} title="Product unavailable">
        <ErrorState
          action={{
            label: 'Retry',
            onPress: () => {
              setStatus('loading');
              setRequestKey((current) => current + 1);
            },
          }}
          message={error ?? 'This catalog product is unavailable.'}
          title="Product unavailable"
        />
      </AppScreen>
    );
  }

  return (
    <AppScreen {...(isSaving ? {} : { onBack: navigation.goBack })} title={product.name}>
      <View style={styles.hero}>
        {product.imageUrl && !imageFailed ? (
          <Image
            accessibilityLabel={`${product.name} product image`}
            onError={() => setImageFailed(true)}
            resizeMode="cover"
            source={{ uri: product.imageUrl }}
            style={styles.image}
          />
        ) : (
          <PlaceholderArtwork
            colors={[theme.colors.surfaceMuted, theme.colors.primarySoft, theme.colors.surface]}
            label={product.name}
          />
        )}
      </View>

      <View style={styles.summary}>
        <Text style={styles.brand}>{product.brandName}</Text>
        <Text style={styles.meta}>
          {[product.categoryName, product.subcategoryName, product.material]
            .filter(Boolean)
            .join(' · ')}
        </Text>
        {product.description ? <Text style={styles.description}>{product.description}</Text> : null}
      </View>

      {product.isDemo ? (
        <View style={styles.demoNotice}>
          <Text style={styles.demoTitle}>Synthetic development product</Text>
          <Text style={styles.demoCopy}>
            This fictional item and price are test data, not a current retailer listing.
          </Text>
        </View>
      ) : null}

      {product.styleTags.length > 0 ? (
        <View style={styles.section}>
          <Text accessibilityRole="header" style={styles.heading}>
            Styling profile
          </Text>
          <Text style={styles.meta}>
            {[
              ...product.styleTags,
              product.fit,
              product.silhouette,
              product.pattern,
              product.length,
            ]
              .filter(Boolean)
              .join(' · ')}
          </Text>
          <Text style={styles.meta}>
            {[...product.occasionTags, ...product.seasonTags].join(' · ')}
          </Text>
          {product.formalityLevel !== null && product.warmthLevel !== null ? (
            <Text style={styles.meta}>
              Formality {product.formalityLevel}/5 · Warmth {product.warmthLevel}/5
            </Text>
          ) : null}
        </View>
      ) : null}

      {colors.length > 0 ? (
        <View style={styles.section}>
          <Text accessibilityRole="header" style={styles.heading}>
            Colour
          </Text>
          <View style={styles.chips}>
            {colors.map((color) => (
              <Chip
                key={color}
                label={color}
                onPress={() => chooseColor(color)}
                selected={selectedColor === color}
                square
              />
            ))}
          </View>
        </View>
      ) : null}

      {sizes.length > 0 ? (
        <View style={styles.section}>
          <Text accessibilityRole="header" style={styles.heading}>
            Size
          </Text>
          <View style={styles.chips}>
            {sizes.map((size) => (
              <Chip
                key={size}
                label={size}
                onPress={() => setSelectedSize(size)}
                selected={selectedSize === size}
                square
              />
            ))}
          </View>
        </View>
      ) : null}

      <View style={styles.purchase}>
        <Text style={styles.price}>
          {formatPrice(
            selectedVariant?.price ?? product.price,
            selectedVariant?.currency ?? product.currency,
          )}
        </Text>
        <Text style={styles.availability}>
          {selectedVariant?.availability ?? product.availability ?? 'Availability not provided'}
        </Text>
      </View>

      {alreadyOwned ? (
        <View style={styles.duplicateNotice}>
          <Text style={styles.duplicateTitle}>You already have this item in your wardrobe.</Text>
          <View style={styles.duplicateActions}>
            <ActionButton
              label="Add another"
              onPress={() => setDuplicateConfirmed(true)}
              variant={duplicateConfirmed ? 'primary' : 'secondary'}
            />
            <ActionButton label="Cancel" onPress={navigation.goBack} variant="text" />
          </View>
        </View>
      ) : null}

      {error ? (
        <ErrorState
          action={{ label: 'Dismiss', onPress: () => setError(null) }}
          message={error}
          title="Product not added"
        />
      ) : null}
      <ActionButton
        disabled={!user || (alreadyOwned && !duplicateConfirmed)}
        label={alreadyOwned ? 'Add another to wardrobe' : 'Add to wardrobe'}
        loading={isSaving}
        onPress={() => void save()}
      />
    </AppScreen>
  );
}

function selectVariant(
  variants: CatalogProductVariant[],
  color: string | null,
  size: string | null,
): CatalogProductVariant | null {
  return (
    variants.find(
      (variant) => (!color || variant.color === color) && (!size || variant.size === size),
    ) ??
    variants[0] ??
    null
  );
}

function unique(values: (string | null)[]): string[] {
  return [...new Set(values.filter((value): value is string => Boolean(value)))];
}

function formatPrice(price: number | null, currency: string | null): string {
  return price === null ? 'Price unavailable' : `${currency ?? ''} ${price.toFixed(2)}`.trim();
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    hero: {
      alignSelf: 'center',
      aspectRatio: 4 / 5,
      maxWidth: 520,
      overflow: 'hidden',
      width: '100%',
    },
    image: { backgroundColor: theme.colors.surfaceMuted, height: '100%', width: '100%' },
    summary: { gap: theme.spacing.sm },
    brand: {
      color: theme.colors.textMuted,
      fontFamily: theme.typography.fontFamily.medium,
      letterSpacing: 1.2,
      textTransform: 'uppercase',
    },
    meta: { color: theme.colors.textMuted, fontSize: theme.typography.fontSize.sm },
    description: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSize.md,
      lineHeight: theme.typography.lineHeight.md,
    },
    section: { gap: theme.spacing.sm },
    demoNotice: {
      backgroundColor: theme.colors.surfaceMuted,
      borderColor: theme.colors.border,
      borderWidth: 1,
      gap: theme.spacing.xs,
      padding: theme.spacing.md,
    },
    demoTitle: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.medium,
      fontWeight: theme.typography.fontWeight.semibold,
    },
    demoCopy: { color: theme.colors.textMuted, fontSize: theme.typography.fontSize.sm },
    heading: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.medium,
      fontWeight: theme.typography.fontWeight.semibold,
    },
    chips: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
    purchase: {
      borderBottomColor: theme.colors.border,
      borderTopColor: theme.colors.border,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderTopWidth: StyleSheet.hairlineWidth,
      gap: theme.spacing.xs,
      paddingVertical: theme.spacing.md,
    },
    price: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.editorial,
      fontSize: theme.typography.fontSize.xl,
    },
    availability: { color: theme.colors.textMuted, fontSize: theme.typography.fontSize.sm },
    duplicateNotice: {
      borderColor: theme.colors.warning,
      borderWidth: 1,
      gap: theme.spacing.sm,
      padding: theme.spacing.md,
    },
    duplicateTitle: { color: theme.colors.text, fontWeight: theme.typography.fontWeight.semibold },
    duplicateActions: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
  });
}

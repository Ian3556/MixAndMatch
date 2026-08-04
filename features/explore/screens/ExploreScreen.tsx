import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppScreen } from '@/components/ui/AppScreen';
import { IconButton } from '@/components/ui/IconButton';
import { OutfitCard } from '@/components/ui/OutfitCard';
import { SearchBar } from '@/components/ui/SearchBar';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { exploreStyles, wardrobeCategories } from '@/fixtures/categories';
import { outfitConcepts } from '@/fixtures/outfits';
import { EXPLORE_ROUTES } from '@/navigation/routes';
import type { ExploreStackParamList } from '@/navigation/types';
import { useAppTheme, type AppTheme } from '@/theme';
import { showDeferredNotice } from '@/utils/deferred';

type Props = NativeStackScreenProps<ExploreStackParamList, 'Explore'>;

export function ExploreScreen({ navigation }: Props) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const [query, setQuery] = useState('');

  const submitSearch = () => {
    navigation.navigate(EXPLORE_ROUTES.SEARCH_RESULTS, { query: query.trim() });
  };

  return (
    <AppScreen
      actions={
        <IconButton
          label="Visual search preview"
          onPress={() => showDeferredNotice('Visual search')}
          symbol="▣"
        />
      }
      eyebrow="Discover"
      subtitle="Browse deterministic concepts and preview the future search experience."
      title="Find your next direction"
    >
      <View style={styles.searchRow}>
        <View style={styles.search}>
          <SearchBar onChangeText={setQuery} onSubmit={submitSearch} value={query} />
        </View>
        <IconButton
          label="Open filters"
          onPress={() => showDeferredNotice('Explore filters')}
          symbol="≡"
        />
      </View>

      <View style={styles.section}>
        <SectionHeader title="Browse categories" />
        <ScrollView
          contentContainerStyle={styles.categories}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {wardrobeCategories.slice(1).map((category) => (
            <Pressable
              accessibilityRole="button"
              key={category.id}
              onPress={() =>
                navigation.navigate(EXPLORE_ROUTES.STYLE_CATEGORY, {
                  categoryId: category.id,
                  title: category.label,
                })
              }
              style={({ pressed }) => [styles.categoryCard, pressed ? styles.pressed : null]}
            >
              <View style={[styles.categorySymbol, { backgroundColor: category.tone }]}>
                <View style={styles.categorySymbolBadge}>
                  <Text style={styles.categorySymbolText}>{category.symbol}</Text>
                </View>
              </View>
              <Text style={styles.categoryLabel}>{category.label}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <SectionHeader title="Browse by style" />
        <View style={styles.styleGrid}>
          {exploreStyles.map((style) => (
            <Pressable
              accessibilityRole="button"
              key={style}
              onPress={() =>
                navigation.navigate(EXPLORE_ROUTES.STYLE_CATEGORY, {
                  categoryId: style.toLowerCase().replace(/\s+/g, '-'),
                  title: style,
                })
              }
              style={({ pressed }) => [styles.styleCard, pressed ? styles.pressed : null]}
            >
              <Text style={styles.styleLabel}>{style}</Text>
              <Text style={styles.arrow}>↗</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <SectionHeader title="Trending looks" />
        <ScrollView
          contentContainerStyle={styles.outfits}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {outfitConcepts.map((outfit) => (
            <View key={outfit.id} style={styles.outfitCard}>
              <OutfitCard
                compact
                onPress={() => showDeferredNotice('Trending look details')}
                outfit={outfit}
              />
            </View>
          ))}
        </ScrollView>
      </View>
    </AppScreen>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    searchRow: { alignItems: 'center', flexDirection: 'row', gap: theme.spacing.sm },
    search: { flex: 1 },
    section: { gap: theme.spacing.md },
    categories: { gap: theme.spacing.md, paddingRight: theme.spacing.md },
    categoryCard: { gap: theme.spacing.sm, width: 104 },
    categorySymbol: {
      alignItems: 'center',
      aspectRatio: 1,
      borderRadius: theme.radii.lg,
      justifyContent: 'center',
      width: 104,
    },
    categorySymbolBadge: {
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radii.full,
      height: 44,
      justifyContent: 'center',
      width: 44,
    },
    categorySymbolText: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSize.xl,
      fontWeight: theme.typography.fontWeight.bold,
    },
    categoryLabel: { color: theme.colors.text, fontSize: theme.typography.fontSize.sm },
    styleGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
    styleCard: {
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
      borderRadius: theme.radii.md,
      borderWidth: 1,
      flexDirection: 'row',
      minHeight: 52,
      minWidth: 160,
      paddingHorizontal: theme.spacing.md,
    },
    styleLabel: {
      color: theme.colors.text,
      flex: 1,
      fontWeight: theme.typography.fontWeight.medium,
    },
    arrow: { color: theme.colors.primary },
    outfits: { gap: theme.spacing.md, paddingRight: theme.spacing.md },
    outfitCard: { width: 280 },
    pressed: { opacity: 0.72 },
  });
}

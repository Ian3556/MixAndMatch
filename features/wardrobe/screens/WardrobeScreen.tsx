import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';

import { AppScreen } from '@/components/ui/AppScreen';
import { Chip } from '@/components/ui/Chip';
import { IconButton } from '@/components/ui/IconButton';
import { StatCard } from '@/components/ui/ProfilePrimitives';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { DeferredNotice, EmptyState } from '@/components/ui/StateViews';
import { WardrobeItemCard } from '@/components/ui/WardrobeItemCard';
import { wardrobeCategories } from '@/fixtures/categories';
import { wardrobeItems } from '@/fixtures/wardrobe';
import { WARDROBE_ROUTES } from '@/navigation/routes';
import type { WardrobeStackParamList } from '@/navigation/types';
import { useAppTheme, type AppTheme } from '@/theme';
import { showDeferredNotice } from '@/utils/deferred';
import { getGridColumnCount, getGridItemWidth } from '@/utils/layout';

type Props = NativeStackScreenProps<WardrobeStackParamList, 'Wardrobe'>;

export function WardrobeScreen({ navigation }: Props) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const { width } = useWindowDimensions();
  const [category, setCategory] = useState('All');
  const [previewMode, setPreviewMode] = useState<'items' | 'empty'>('items');
  const items = useMemo(
    () =>
      category === 'All'
        ? wardrobeItems
        : wardrobeItems.filter((item) => item.category === category),
    [category],
  );
  const columns = getGridColumnCount(Math.min(width, 900));
  const itemWidth = getGridItemWidth(
    Math.min(width, 900),
    columns,
    theme.spacing.md,
    theme.spacing.md,
  );

  return (
    <AppScreen
      actions={
        <>
          <IconButton
            label="Add wardrobe item"
            onPress={() => navigation.navigate(WARDROBE_ROUTES.ADD_ITEM_ENTRY)}
            symbol="＋"
          />
          <IconButton
            label="Search wardrobe"
            onPress={() => showDeferredNotice('Wardrobe search')}
            symbol="⌕"
          />
          <IconButton
            label="Sort and filter wardrobe"
            onPress={() => showDeferredNotice('Wardrobe sorting and filters')}
            symbol="≡"
          />
        </>
      }
      eyebrow="Your collection"
      subtitle={`${wardrobeItems.length} fixture items · no wardrobe data is persisted`}
      title="Wardrobe"
    >
      <DeferredNotice>
        Use the preview control to inspect both required UI states. These items are local fixtures,
        not your saved wardrobe.
      </DeferredNotice>

      <View style={styles.previewControls}>
        <Chip
          label="Items preview"
          onPress={() => setPreviewMode('items')}
          selected={previewMode === 'items'}
        />
        <Chip
          label="Empty-state preview"
          onPress={() => setPreviewMode('empty')}
          selected={previewMode === 'empty'}
        />
      </View>

      {previewMode === 'empty' ? (
        <EmptyState
          action={{
            label: 'Add first item',
            onPress: () => navigation.navigate(WARDROBE_ROUTES.ADD_ITEM_ENTRY),
          }}
          message="Adding clothing will eventually unlock outfit building, styling suggestions, and a clearer view of what you own."
          symbol="＋"
          title="Build a wardrobe you can use"
        />
      ) : (
        <>
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

          {items.length === 0 ? (
            <EmptyState
              action={{ label: 'Show all items', onPress: () => setCategory('All') }}
              message={`The local fixture set does not include ${category.toLowerCase()} yet.`}
              title={`No ${category.toLowerCase()} in this preview`}
            />
          ) : (
            <View style={styles.grid}>
              {items.map((item) => (
                <WardrobeItemCard
                  item={item}
                  key={item.id}
                  onFavorite={() => showDeferredNotice('Wardrobe favourites')}
                  onMore={() => showDeferredNotice('Wardrobe item actions')}
                  onOpen={() =>
                    navigation.navigate(WARDROBE_ROUTES.ITEM_DETAIL, { itemId: item.id })
                  }
                  width={itemWidth}
                />
              ))}
            </View>
          )}
        </>
      )}

      <View style={styles.section}>
        <SectionHeader
          subtitle="Static placeholders until wardrobe analytics exist"
          title="Wardrobe summary"
        />
        <View style={styles.stats}>
          <StatCard label="Total items" value="—" />
          <StatCard label="Top category" value="—" />
          <StatCard label="Most-used colour" value="—" />
          <StatCard label="Recently added" value="—" />
        </View>
      </View>
    </AppScreen>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    previewControls: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
    section: { gap: theme.spacing.md },
    chips: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.md },
    stats: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
  });
}

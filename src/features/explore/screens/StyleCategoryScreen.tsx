import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { AppScreen } from '@/components/ui/AppScreen';
import { Chip } from '@/components/ui/Chip';
import { InspirationCard } from '@/components/ui/InspirationCard';
import { DeferredNotice } from '@/components/ui/StateViews';
import { allInspiration } from '@/fixtures/inspiration';
import { EXPLORE_ROUTES } from '@/navigation/routes';
import type { ExploreStackParamList } from '@/navigation/types';
import { useAppTheme, type AppTheme } from '@/theme';
import { showDeferredNotice } from '@/utils/deferred';
import { getGridColumnCount, getGridItemWidth } from '@/utils/layout';

type Props = NativeStackScreenProps<ExploreStackParamList, 'StyleCategory'>;

export function StyleCategoryScreen({ navigation, route }: Props) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const { width } = useWindowDimensions();
  const columns = getGridColumnCount(Math.min(width, 900));
  const itemWidth = getGridItemWidth(
    Math.min(width, 900),
    columns,
    theme.spacing.md,
    theme.spacing.md,
  );
  const openItem = (inspirationId: string) =>
    navigation.navigate(EXPLORE_ROUTES.INSPIRATION_DETAIL, { inspirationId });

  return (
    <AppScreen
      onBack={navigation.goBack}
      subtitle="A fixture-driven category shell ready for future catalogue data."
      title={route.params.title}
    >
      <DeferredNotice>
        These concepts are not inferred preferences and do not represent live product availability.
      </DeferredNotice>
      <View style={styles.chips}>
        {['Latest', 'Everyday', 'Occasion', 'Editorial'].map((filter, index) => (
          <Chip
            key={filter}
            label={filter}
            onPress={() => showDeferredNotice(`${filter} category filtering`)}
            selected={index === 0}
          />
        ))}
      </View>
      <Text style={styles.label}>CURATED UI PREVIEW</Text>
      <View style={styles.grid}>
        {allInspiration.slice(0, 6).map((item) => (
          <InspirationCard
            item={item}
            key={`${route.params.categoryId}-${item.id}`}
            onMore={() => showDeferredNotice('Category item options')}
            onOpen={() => openItem(item.id)}
            onSave={() => showDeferredNotice('Saved styles')}
            width={itemWidth}
          />
        ))}
      </View>
    </AppScreen>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    chips: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
    label: {
      color: theme.colors.textMuted,
      fontSize: theme.typography.fontSize.xs,
      fontWeight: theme.typography.fontWeight.semibold,
      letterSpacing: 1.1,
    },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.md },
  });
}

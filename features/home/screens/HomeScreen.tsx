import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';

import { AppScreen } from '@/components/ui/AppScreen';
import { Chip } from '@/components/ui/Chip';
import { IconButton } from '@/components/ui/IconButton';
import { InspirationCard } from '@/components/ui/InspirationCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import {
  featuredInspiration,
  recommendedInspiration,
  type InspirationFixture,
} from '@/fixtures/inspiration';
import { styleCategories } from '@/fixtures/categories';
import { HOME_ROUTES, MAIN_ROUTES } from '@/navigation/routes';
import type { HomeStackParamList, MainTabParamList } from '@/navigation/types';
import { useAuthStore } from '@/store/authStore';
import { useAppTheme, type AppTheme } from '@/theme';
import { showDeferredNotice } from '@/utils/deferred';
import { getGridColumnCount, getGridItemWidth } from '@/utils/layout';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

type Props = NativeStackScreenProps<HomeStackParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const { width } = useWindowDimensions();
  const profile = useAuthStore((state) => state.profile);
  const columns = getGridColumnCount(Math.min(width, 900));
  const itemWidth = getGridItemWidth(
    Math.min(width, 900),
    columns,
    theme.spacing.md,
    theme.spacing.md,
  );
  const displayName = profile?.displayName?.split(' ')[0];

  const openInspiration = (item: InspirationFixture) => {
    navigation.navigate(HOME_ROUTES.INSPIRATION_DETAIL, { inspirationId: item.id });
  };

  const openStyle = (style: string) => {
    navigation
      .getParent<BottomTabNavigationProp<MainTabParamList>>()
      ?.navigate(MAIN_ROUTES.EXPLORE_TAB, {
        screen: 'StyleCategory',
        params: { categoryId: style.toLowerCase().replace(/\s+/g, '-'), title: style },
      });
  };

  return (
    <AppScreen
      actions={
        <>
          <IconButton
            label="Open discovery search"
            onPress={() =>
              navigation
                .getParent<BottomTabNavigationProp<MainTabParamList>>()
                ?.navigate(MAIN_ROUTES.EXPLORE_TAB)
            }
            symbol="⌕"
          />
          <IconButton
            label="Notifications preview"
            onPress={() => showDeferredNotice('Notifications')}
            symbol="○"
          />
        </>
      }
      eyebrow="Daily edit"
      subtitle="Fresh ways to work with your style, using presentation fixtures for now."
      title={displayName ? `Good to see you, ${displayName}` : 'Your style starts here'}
    >
      <View style={styles.section}>
        <SectionHeader
          subtitle="Seasonal, occasion, and editorial directions"
          title="Featured inspiration"
        />
        <ScrollView
          contentContainerStyle={styles.horizontalContent}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {featuredInspiration.map((item) => (
            <InspirationCard
              item={item}
              key={item.id}
              onMore={() => showDeferredNotice('Inspiration options')}
              onOpen={() => openInspiration(item)}
              onSave={() => showDeferredNotice('Saved styles')}
              width={260}
            />
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <SectionHeader
          subtitle="Static concepts that preview the future recommendation layout"
          title="Recommended for you"
        />
        <View style={styles.grid}>
          {recommendedInspiration.map((item) => (
            <InspirationCard
              item={item}
              key={item.id}
              onMore={() => showDeferredNotice('Recommendation options')}
              onOpen={() => openInspiration(item)}
              onSave={() => showDeferredNotice('Saved styles')}
              width={itemWidth}
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <SectionHeader title="Explore by style" />
        <View style={styles.chips}>
          {styleCategories.map((style) => (
            <Chip key={style} label={style} onPress={() => openStyle(style)} />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <SectionHeader
          subtitle="A stable home for recent, saved, and category history"
          title="Continue exploring"
        />
        <ScrollView
          contentContainerStyle={styles.horizontalContent}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {recommendedInspiration.slice(0, 3).map((item) => (
            <InspirationCard
              item={item}
              key={`continue-${item.id}`}
              onMore={() => showDeferredNotice('Exploration history options')}
              onOpen={() => openInspiration(item)}
              onSave={() => showDeferredNotice('Saved styles')}
              width={220}
            />
          ))}
        </ScrollView>
      </View>
    </AppScreen>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    section: { gap: theme.spacing.md },
    horizontalContent: { gap: theme.spacing.md, paddingRight: theme.spacing.md },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.md },
    chips: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
  });
}

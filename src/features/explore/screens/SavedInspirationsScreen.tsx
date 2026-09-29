import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { Text, View, useWindowDimensions } from 'react-native';
import { ActionButton } from '@/components/ActionButton';
import { AppScreen } from '@/components/ui/AppScreen';
import { EmptyState, ErrorState } from '@/components/ui/StateViews';
import { EXPLORE_ROUTES } from '@/navigation/routes';
import type { ExploreStackParamList } from '@/navigation/types';
import { useAuthStore } from '@/store/authStore';
import { savedInspirationStore } from '@/store/savedInspirationStore';
import { useAppTheme } from '@/theme';
import { getGridColumnCount } from '@/utils/layout';
import { ExploreFeedSkeleton } from '../components/ExploreFeedSkeleton';
import { ExploreMasonryFeed } from '../components/ExploreMasonryFeed';
import { SaveInspirationButton } from '../components/SaveInspirationButton';
import { exploreDiscoveryContent } from '../data/exploreDiscoveryContent';
import { useSavedInspirations } from '../hooks/useSavedInspirations';

export function SavedInspirationsScreen({
  navigation,
}: NativeStackScreenProps<ExploreStackParamList, 'SavedInspirations'>) {
  const saved = useSavedInspirations();
  const userId = useAuthStore((state) => state.user?.id);
  const theme = useAppTheme();
  const columns = getGridColumnCount(Math.min(useWindowDimensions().width, 900));
  useFocusEffect(
    useCallback(() => {
      if (userId) void savedInspirationStore.getState().load(userId, true);
    }, [userId]),
  );
  const ordered = [...saved.items].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const items = ordered.flatMap((entry) => {
    const item = exploreDiscoveryContent.find((candidate) => candidate.id === entry.inspirationId);
    return item ? [item] : [];
  });
  const unavailable = ordered.filter(
    (entry) => !items.some((item) => item.id === entry.inspirationId),
  );
  return (
    <AppScreen
      title="Saved inspirations"
      subtitle="Your references for getting dressed. Open a look to style your wardrobe or remove it."
      onBack={() =>
        navigation.canGoBack() ? navigation.goBack() : navigation.replace(EXPLORE_ROUTES.EXPLORE)
      }
    >
      {saved.status === 'loading' || saved.status === 'idle' ? (
        <ExploreFeedSkeleton columnCount={columns} />
      ) : saved.status === 'error' ? (
        <ErrorState
          title="Saved inspirations unavailable"
          message={saved.error ?? 'Please try again.'}
          action={{ label: 'Try again', onPress: saved.retry }}
          square
        />
      ) : ordered.length === 0 ? (
        <EmptyState
          title="Keep a look for later"
          message="Save an inspiration from its detail page. It will appear here when you return."
          action={{
            label: 'Explore looks',
            onPress: () => navigation.navigate(EXPLORE_ROUTES.EXPLORE),
          }}
          square
        />
      ) : (
        <>
          <ExploreMasonryFeed
            columnCount={columns}
            items={items}
            onOpenItem={(item) =>
              navigation.navigate(EXPLORE_ROUTES.INSPIRATION_DETAIL, { itemId: item.id })
            }
          />
          {unavailable.map((entry) => (
            <View key={entry.inspirationId} style={{ gap: theme.spacing.sm }}>
              <Text style={{ color: theme.colors.textMuted }}>
                This saved reference is no longer in the editorial collection.
              </Text>
              <SaveInspirationButton
                inspirationId={entry.inspirationId}
                title="Unavailable reference"
              />
            </View>
          ))}
          <ActionButton label="Refresh collection" onPress={saved.retry} square variant="text" />
        </>
      )}
    </AppScreen>
  );
}

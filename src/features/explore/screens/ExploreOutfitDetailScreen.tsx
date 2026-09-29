import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { EXPLORE_ROUTES } from '@/navigation/routes';
import type { ExploreStackParamList } from '@/navigation/types';
import { InspirationDetailContent } from '../components/InspirationDetailContent';

export function ExploreOutfitDetailScreen({
  navigation,
  route,
}: NativeStackScreenProps<ExploreStackParamList, 'InspirationDetail'>) {
  return (
    <InspirationDetailContent
      reference={route.params}
      onBack={() =>
        navigation.canGoBack() ? navigation.goBack() : navigation.replace(EXPLORE_ROUTES.EXPLORE)
      }
      onOpenRelated={(item) =>
        navigation.push(EXPLORE_ROUTES.INSPIRATION_DETAIL, { itemId: item.id })
      }
    />
  );
}

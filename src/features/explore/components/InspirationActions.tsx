import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useNavigation, type NavigationProp, type ParamListBase } from '@react-navigation/native';
import { Text, View } from 'react-native';
import { ActionButton } from '@/components/ActionButton';
import { EXPLORE_ROUTES, MAIN_ROUTES, STYLIST_ROUTES } from '@/navigation/routes';
import type { MainTabParamList } from '@/navigation/types';
import { useAppTheme } from '@/theme';
import type { ExploreDiscoveryItem } from '../types/discovery';
import { SaveInspirationButton } from './SaveInspirationButton';

export function InspirationActions({ item }: { item: ExploreDiscoveryItem }) {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const tabs = navigation.getParent<BottomTabNavigationProp<MainTabParamList>>();
  const theme = useAppTheme();
  return (
    <View style={{ gap: theme.spacing.sm, maxWidth: 720 }}>
      <SaveInspirationButton inspirationId={item.id} title={item.title} />
      <ActionButton
        label="Style my wardrobe like this"
        onPress={() =>
          tabs?.navigate(MAIN_ROUTES.STYLIST_TAB, {
            screen: STYLIST_ROUTES.OUTFIT_GOAL,
            params: { desiredStyle: item.style, occasion: 'Everyday' },
            initial: false,
          })
        }
        square
      />
      <Text style={{ color: theme.colors.textMuted, lineHeight: 20 }}>
        Start a {item.style.toLowerCase()} brief using your own clothes. This editorial look is a
        reference; matching pieces may differ.
      </Text>
      <ActionButton
        label="View saved inspirations"
        onPress={() =>
          tabs?.navigate(MAIN_ROUTES.EXPLORE_TAB, {
            screen: EXPLORE_ROUTES.SAVED_INSPIRATIONS,
            initial: false,
          })
        }
        square
        variant="text"
      />
    </View>
  );
}

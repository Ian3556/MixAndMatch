import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { InspirationDetailContent } from '@/features/explore/components/InspirationDetailContent';
import { HOME_ROUTES } from '@/navigation/routes';
import type { HomeStackParamList } from '@/navigation/types';

type HomeProps = NativeStackScreenProps<HomeStackParamList, 'InspirationDetail'>;

export function InspirationDetailScreen({ navigation, route }: HomeProps) {
  const handleBack = () => {
    if (navigation.canGoBack()) navigation.goBack();
    else navigation.replace(HOME_ROUTES.HOME);
  };

  return (
    <InspirationDetailContent
      reference={route.params}
      onBack={handleBack}
      onOpenRelated={(item) => navigation.push(HOME_ROUTES.INSPIRATION_DETAIL, { itemId: item.id })}
    />
  );
}

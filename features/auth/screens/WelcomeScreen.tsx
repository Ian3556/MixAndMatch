import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { ActionButton } from '@/components/ActionButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { AUTH_ROUTES } from '@/navigation/routes';
import type { AuthStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Welcome'>;

export function WelcomeScreen({ navigation }: Props) {
  return (
    <ScreenContainer
      description="Your personal wardrobe assistant starts with a secure account and a profile that stays yours."
      title="Build better outfits from what you own"
    >
      <ActionButton
        label="Create Account"
        onPress={() => navigation.navigate(AUTH_ROUTES.SIGN_UP)}
      />
      <ActionButton
        label="Sign In"
        onPress={() => navigation.navigate(AUTH_ROUTES.SIGN_IN)}
        variant="secondary"
      />
    </ScreenContainer>
  );
}

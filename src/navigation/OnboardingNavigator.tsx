import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ProfileSetupScreen } from '@/features/profile/screens/ProfileSetupScreen';

import { ONBOARDING_ROUTES } from './routes';
import type { OnboardingStackParamList } from './types';

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

export function OnboardingNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={ONBOARDING_ROUTES.PROFILE_SETUP} component={ProfileSetupScreen} />
    </Stack.Navigator>
  );
}

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AuthStateErrorScreen } from '@/screens/AuthStateErrorScreen';
import { InitializationScreen } from '@/screens/InitializationScreen';
import { resolveAuthFlow } from '@/store/authState';
import { useAuthStore } from '@/store/authStore';
import { useAppTheme } from '@/theme';

import { AuthNavigator } from './AuthNavigator';
import { MainAppNavigator } from './MainAppNavigator';
import { OnboardingNavigator } from './OnboardingNavigator';
import { ROOT_ROUTES } from './routes';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { colors } = useAppTheme();
  const authState = useAuthStore();
  const flow = resolveAuthFlow(authState);

  if (flow === 'initializing') {
    return <InitializationScreen />;
  }

  if (flow === 'error') {
    return <AuthStateErrorScreen />;
  }

  return (
    <Stack.Navigator
      key={flow}
      screenOptions={{
        contentStyle: { backgroundColor: colors.background },
        headerShown: false,
      }}
    >
      {flow === 'signedOut' || flow === 'verification' || flow === 'recovery' ? (
        <Stack.Screen name={ROOT_ROUTES.AUTH} component={AuthNavigator} />
      ) : null}
      {flow === 'onboarding' ? (
        <Stack.Screen name={ROOT_ROUTES.ONBOARDING} component={OnboardingNavigator} />
      ) : null}
      {flow === 'main' ? (
        <Stack.Screen name={ROOT_ROUTES.MAIN} component={MainAppNavigator} />
      ) : null}
    </Stack.Navigator>
  );
}

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { FoundationScreen } from '@/screens/FoundationScreen';
import { useAppTheme } from '@/theme';

import { ROOT_ROUTES } from './routes';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { colors } = useAppTheme();

  return (
    <Stack.Navigator
      initialRouteName={ROOT_ROUTES.MAIN}
      screenOptions={{
        contentStyle: { backgroundColor: colors.background },
        headerShown: false,
      }}
    >
      <Stack.Screen name={ROOT_ROUTES.AUTH} component={FoundationScreen} />
      <Stack.Screen name={ROOT_ROUTES.MAIN} component={FoundationScreen} />
      <Stack.Screen name={ROOT_ROUTES.SETTINGS} component={FoundationScreen} />
      <Stack.Screen name={ROOT_ROUTES.ADMIN} component={FoundationScreen} />
      <Stack.Screen name={ROOT_ROUTES.ONBOARDING} component={FoundationScreen} />
    </Stack.Navigator>
  );
}

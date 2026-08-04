import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { FoundationScreen } from '@/screens/FoundationScreen';
import { MainAppScreen } from '@/screens/MainAppScreen';

import { MAIN_ROUTES } from './routes';
import type { MainStackParamList } from './types';

const Stack = createNativeStackNavigator<MainStackParamList>();

export function MainAppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={MAIN_ROUTES.HOME} component={MainAppScreen} />
      <Stack.Screen name={MAIN_ROUTES.SETTINGS} component={FoundationScreen} />
      <Stack.Screen name={MAIN_ROUTES.ADMIN} component={FoundationScreen} />
    </Stack.Navigator>
  );
}

import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { RootNavigator } from '@/navigation/RootNavigator';
import { AppThemeProvider, useAppTheme } from '@/theme';

function AppNavigation() {
  const { navigationTheme } = useAppTheme();

  return (
    <NavigationContainer theme={navigationTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

export default function AppRoot() {
  return (
    <SafeAreaProvider>
      <AppThemeProvider>
        <AppNavigation />
      </AppThemeProvider>
    </SafeAreaProvider>
  );
}

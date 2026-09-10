import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthBootstrap } from '@/features/auth/AuthBootstrap';
import { StartupProvider } from '@/features/startup/StartupProvider';
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
        <StartupProvider>
          <AuthBootstrap>
            <AppNavigation />
          </AuthBootstrap>
        </StartupProvider>
      </AppThemeProvider>
    </SafeAreaProvider>
  );
}

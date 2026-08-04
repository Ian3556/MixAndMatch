import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { EmailVerificationScreen } from '@/features/auth/screens/EmailVerificationScreen';
import { ForgotPasswordScreen } from '@/features/auth/screens/ForgotPasswordScreen';
import { ResetPasswordScreen } from '@/features/auth/screens/ResetPasswordScreen';
import { SignInScreen } from '@/features/auth/screens/SignInScreen';
import { SignUpScreen } from '@/features/auth/screens/SignUpScreen';
import { WelcomeScreen } from '@/features/auth/screens/WelcomeScreen';
import { resolveAuthFlow } from '@/store/authState';
import { useAuthStore } from '@/store/authStore';

import { AUTH_ROUTES } from './routes';
import type { AuthStackParamList } from './types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthNavigator() {
  const authState = useAuthStore();
  const flow = resolveAuthFlow(authState);

  if (flow === 'verification') {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name={AUTH_ROUTES.EMAIL_VERIFICATION} component={EmailVerificationScreen} />
      </Stack.Navigator>
    );
  }

  if (flow === 'recovery') {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name={AUTH_ROUTES.RESET_PASSWORD} component={ResetPasswordScreen} />
        <Stack.Screen name={AUTH_ROUTES.FORGOT_PASSWORD} component={ForgotPasswordScreen} />
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator
      initialRouteName={authState.authStartRoute}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name={AUTH_ROUTES.WELCOME} component={WelcomeScreen} />
      <Stack.Screen name={AUTH_ROUTES.SIGN_UP} component={SignUpScreen} />
      <Stack.Screen name={AUTH_ROUTES.SIGN_IN} component={SignInScreen} />
      <Stack.Screen name={AUTH_ROUTES.FORGOT_PASSWORD} component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
}

import type { Session, User } from '@supabase/supabase-js';

import type { AuthenticationError, PasswordRecoveryState } from '@/types/auth';
import type { Profile, ProfileError } from '@/types/profile';

export type AuthStateError = AuthenticationError | ProfileError;
export type ProfileLoadStatus = 'idle' | 'loading' | 'ready' | 'missing' | 'error';
export type AuthFlow =
  'initializing' | 'signedOut' | 'verification' | 'recovery' | 'onboarding' | 'main' | 'error';

export type AuthSnapshot = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isInitializing: boolean;
  isAuthenticated: boolean;
  isEmailVerified: boolean;
  isOnboardingComplete: boolean;
  profileStatus: ProfileLoadStatus;
  pendingVerificationEmail: string | null;
  authStartRoute: 'Welcome' | 'SignIn';
  recoveryState: PasswordRecoveryState;
  authError: AuthStateError | null;
};

export function resolveAuthFlow(state: AuthSnapshot): AuthFlow {
  if (state.isInitializing || (state.session && state.profileStatus === 'loading')) {
    return 'initializing';
  }

  if (state.recoveryState.status !== 'idle') {
    return 'recovery';
  }

  if (
    state.authError?.domain === 'configuration' ||
    state.authError?.domain === 'session' ||
    state.profileStatus === 'error'
  ) {
    return 'error';
  }

  if (!state.session) {
    if (state.authError?.code === 'email_not_verified') {
      return 'verification';
    }

    return state.pendingVerificationEmail ? 'verification' : 'signedOut';
  }

  if (!state.isEmailVerified) {
    return 'verification';
  }

  if (!state.profile || !state.isOnboardingComplete) {
    return 'onboarding';
  }

  return 'main';
}

export function createSignedOutSnapshot(error: AuthStateError | null = null): AuthSnapshot {
  return {
    session: null,
    user: null,
    profile: null,
    isInitializing: false,
    isAuthenticated: false,
    isEmailVerified: false,
    isOnboardingComplete: false,
    profileStatus: 'idle',
    pendingVerificationEmail: null,
    authStartRoute: 'Welcome',
    recoveryState: { status: 'idle', error: null },
    authError: error,
  };
}

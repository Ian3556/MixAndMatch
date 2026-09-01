import type { AuthChangeEvent, Session, Subscription } from '@supabase/supabase-js';
import type { StoreApi } from 'zustand';

import { createAuthService, isEmailVerified, type AuthService } from '@/services/authService';
import { createInvalidSessionError, normalizeAuthenticationError } from '@/services/authErrors';
import {
  createProfileService,
  normalizeProfileError,
  type ProfileService,
} from '@/services/profileService';
import { createSupabaseProfileGateway } from '@/services/supabaseProfileGateway';
import type { AuthenticationError } from '@/types/auth';
import type { ProfileError } from '@/types/profile';

import { createSignedOutSnapshot } from './authState';
import type { AuthActionResult, AuthStore } from './authStore';

export type AuthStoreAccess = Pick<StoreApi<AuthStore>, 'getState' | 'setState'>;

let authService: AuthService | undefined;
let profileService: ProfileService | undefined;
let authSubscription: Subscription | undefined;
let profileRequestVersion = 0;
let intentionalSignOut = false;

export async function initializeAuth(store: AuthStoreAccess) {
  store.setState({ isInitializing: true, authError: null });

  try {
    const service = getAuthService();
    authSubscription?.unsubscribe();
    authSubscription = service.onAuthStateChange((event, session) => {
      queueMicrotask(() => void handleAuthStateChange(store, event, session));
    });

    const result = await service.getSession();

    if (!result.ok) {
      invalidateProfileRequests();
      store.setState(createSignedOutSnapshot(result.error));
      return;
    }

    if (!result.data) {
      const current = store.getState();
      store.setState({
        ...createSignedOutSnapshot(current.authError),
        recoveryState: current.recoveryState,
        pendingVerificationEmail: current.pendingVerificationEmail,
      });
      return;
    }

    const userResult = await service.getAuthenticatedUser();

    if (!userResult.ok) {
      store.setState(createSignedOutSnapshot(asInitializationError(userResult.error)));
      return;
    }

    await synchronizeSession(store, { ...result.data, user: userResult.data }, true);
  } catch (error) {
    invalidateProfileRequests();
    store.setState(createSignedOutSnapshot(normalizeAuthenticationError(error)));
  }
}

export function disposeAuth() {
  authSubscription?.unsubscribe();
  authSubscription = undefined;
  invalidateProfileRequests();
}

export function setIntentionalSignOut(value: boolean) {
  intentionalSignOut = value;
}

export function invalidateProfileRequests() {
  profileRequestVersion += 1;
}

export async function synchronizeSession(
  store: AuthStoreAccess,
  session: Session,
  finishInitialization = false,
  forceProfileRefresh = false,
) {
  const current = store.getState();
  const sameUser = current.user?.id === session.user.id;

  store.setState({
    session,
    user: session.user,
    isAuthenticated: true,
    isEmailVerified: isEmailVerified(session.user),
    pendingVerificationEmail: null,
    authError: null,
  });

  if (
    sameUser &&
    !forceProfileRefresh &&
    (current.profileStatus === 'loading' ||
      current.profileStatus === 'ready' ||
      current.profileStatus === 'missing')
  ) {
    if (finishInitialization) store.setState({ isInitializing: false });
    return;
  }

  await loadProfile(store, session.user.id, finishInitialization);
}

export async function loadProfile(
  store: AuthStoreAccess,
  userId: string,
  finishInitialization: boolean,
): Promise<AuthActionResult> {
  const requestVersion = ++profileRequestVersion;
  store.setState({
    profile: null,
    profileStatus: 'loading',
    isOnboardingComplete: false,
    authError: null,
  });

  try {
    const profile = await getProfileService().fetchCurrentProfile(userId);

    if (requestVersion !== profileRequestVersion || store.getState().user?.id !== userId) {
      return { ok: true };
    }

    store.setState({
      profile,
      profileStatus: profile ? 'ready' : 'missing',
      isOnboardingComplete: profile?.onboardingCompleted ?? false,
      isInitializing: finishInitialization ? false : store.getState().isInitializing,
      authError: null,
    });
    return { ok: true };
  } catch (error) {
    const profileError = asProfileError(error);

    if (requestVersion === profileRequestVersion && store.getState().user?.id === userId) {
      store.setState({
        profile: null,
        profileStatus: 'error',
        isOnboardingComplete: false,
        isInitializing: false,
        authError: profileError,
      });
    }

    return { ok: false, error: profileError };
  }
}

export function establishRecoverySession(store: AuthStoreAccess, session: Session) {
  invalidateProfileRequests();
  const isInitializing = store.getState().isInitializing;
  store.setState({
    session,
    user: session.user,
    profile: null,
    profileStatus: 'idle',
    isAuthenticated: true,
    isEmailVerified: isEmailVerified(session.user),
    isOnboardingComplete: false,
    isInitializing,
    pendingVerificationEmail: null,
    recoveryState: { status: 'ready', error: null },
    authError: null,
  });
}

export function getAuthService(): AuthService {
  authService ??= createAuthService();
  return authService;
}

export function getProfileService(): ProfileService {
  profileService ??= createProfileService(createSupabaseProfileGateway());
  return profileService;
}

export function asProfileError(error: unknown): ProfileError {
  if (
    typeof error === 'object' &&
    error !== null &&
    'domain' in error &&
    Reflect.get(error, 'domain') === 'profile'
  ) {
    return error as ProfileError;
  }

  return normalizeProfileError(error);
}

async function handleAuthStateChange(
  store: AuthStoreAccess,
  event: AuthChangeEvent,
  session: Session | null,
) {
  if (event === 'INITIAL_SESSION') return;

  if (event === 'PASSWORD_RECOVERY' && session) {
    establishRecoverySession(store, session);
    return;
  }

  if (!session || event === 'SIGNED_OUT') {
    const hadSession = Boolean(store.getState().session);
    invalidateProfileRequests();
    const error = hadSession && !intentionalSignOut ? createSessionExpiredError() : null;
    store.setState(createSignedOutSnapshot(error));
    return;
  }

  await synchronizeSession(store, session);
}

function createSessionExpiredError() {
  return {
    domain: 'session' as const,
    code: 'session_expired' as const,
    message: 'Your session expired. Sign in again to continue.',
    recoverable: true,
  };
}

function asInitializationError(error: AuthenticationError): AuthenticationError {
  if (error.domain === 'configuration') return error;
  if (error.code === 'network_unavailable') return { ...error, domain: 'session' };
  return createInvalidSessionError(error);
}

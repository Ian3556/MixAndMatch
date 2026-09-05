import {
  createInvalidSessionError,
  createRecoveryExpiredError,
  normalizeAuthenticationError,
} from '@/services/authErrors';

import type { AuthActions } from './authStore';
import {
  asProfileError,
  establishRecoverySession,
  getAuthService,
  getProfileService,
  loadProfile,
  synchronizeSession,
  type AuthStoreAccess,
} from './authStoreRuntime';

type FlowActions = Pick<
  AuthActions,
  | 'refreshProfile'
  | 'updateProfile'
  | 'handleAuthUrl'
  | 'finishPasswordRecovery'
  | 'cancelPasswordRecovery'
  | 'returnToSignIn'
  | 'retryAuthState'
  | 'clearAuthError'
>;

export function createAuthFlowActions(store: AuthStoreAccess): FlowActions {
  return {
    async refreshProfile() {
      const { user } = store.getState();

      if (!user) {
        const error = createInvalidSessionError();
        store.setState({ authError: error });
        return { ok: false, error };
      }

      return loadProfile(store, user.id, true);
    },

    async updateProfile(input) {
      const { user, profileStatus } = store.getState();

      if (!user) {
        const error = createInvalidSessionError();
        store.setState({ authError: error });
        return { ok: false, error };
      }

      // The editor already owns its pending UI. Keeping the current profile ready avoids
      // tearing down the authenticated navigator while an in-place profile save is running.
      store.setState({ authError: null });

      try {
        const profile = await getProfileService().completeOnboarding(user.id, input);
        if (store.getState().user?.id !== user.id) return { ok: true };

        store.setState({
          profile,
          profileStatus: 'ready',
          isOnboardingComplete: profile.onboardingCompleted,
          authError: null,
        });
        return { ok: true };
      } catch (error) {
        const profileError = asProfileError(error);
        store.setState({ authError: profileError, profileStatus });
        return { ok: false, error: profileError };
      }
    },

    async handleAuthUrl(url) {
      const looksLikeRecovery = url.toLowerCase().includes('auth/reset-password');

      if (looksLikeRecovery) {
        store.setState({ recoveryState: { status: 'processing', error: null }, authError: null });
      }

      let result;
      try {
        result = await getAuthService().processAuthCallbackUrl(url);
      } catch (error) {
        result = { ok: false as const, error: normalizeAuthenticationError(error) };
      }

      if (!result.ok) {
        if (looksLikeRecovery || result.error.code === 'recovery_expired') {
          const error = createRecoveryExpiredError(result.error);
          store.setState({ recoveryState: { status: 'error', error }, authError: error });
        } else {
          store.setState({ authError: result.error });
        }
        return;
      }

      if (!result.data.handled || !result.data.session) {
        if (looksLikeRecovery) {
          const error = createRecoveryExpiredError();
          store.setState({ recoveryState: { status: 'error', error }, authError: error });
        }
        return;
      }

      if (result.data.kind === 'recovery') {
        establishRecoverySession(store, result.data.session);
        return;
      }

      store.setState({ pendingVerificationEmail: null, authError: null });
      await synchronizeSession(store, result.data.session, false, true);
    },

    async finishPasswordRecovery() {
      const { session } = store.getState();
      store.setState({ recoveryState: { status: 'idle', error: null }, authError: null });
      if (session) await synchronizeSession(store, session, false, true);
    },

    async cancelPasswordRecovery() {
      if (store.getState().session) {
        await store.getState().signOut();
        store.setState({ authStartRoute: 'SignIn' });
        return;
      }

      store.setState({
        recoveryState: { status: 'idle', error: null },
        authError: null,
        authStartRoute: 'SignIn',
      });
    },

    async returnToSignIn() {
      if (store.getState().session) {
        await store.getState().signOut();
        store.setState({ authStartRoute: 'SignIn' });
        return;
      }

      store.setState({
        pendingVerificationEmail: null,
        recoveryState: { status: 'idle', error: null },
        authError: null,
        authStartRoute: 'SignIn',
      });
    },

    async retryAuthState() {
      const state = store.getState();
      if (state.session && state.user && state.profileStatus === 'error') {
        await state.refreshProfile();
      } else {
        await state.initialize();
      }
    },

    clearAuthError() {
      store.setState({ authError: null });
    },
  };
}

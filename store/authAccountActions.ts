import type { AuthService } from '@/services/authService';
import { createRecoveryExpiredError, normalizeAuthenticationError } from '@/services/authErrors';
import { normalizeEmail } from '@/utils/validation/authValidation';

import { createSignedOutSnapshot } from './authState';
import type { AuthActions } from './authStore';
import {
  getAuthService,
  invalidateProfileRequests,
  setIntentionalSignOut,
  synchronizeSession,
  type AuthStoreAccess,
} from './authStoreRuntime';

type AccountActions = Pick<
  AuthActions,
  | 'signUp'
  | 'signIn'
  | 'signOut'
  | 'requestPasswordReset'
  | 'updatePassword'
  | 'resendVerification'
  | 'checkEmailVerification'
>;

export function createAuthAccountActions(store: AuthStoreAccess): AccountActions {
  return {
    async signUp(email, password) {
      store.setState({ authError: null });
      const normalizedEmail = normalizeEmail(email);
      const result = await getAuthService().signUp(normalizedEmail, password);

      if (!result.ok) {
        if (result.error.code === 'email_already_registered') {
          store.setState({ pendingVerificationEmail: normalizedEmail, authError: null });
          return { ok: true };
        }

        store.setState({ authError: result.error });
        return { ok: false, error: result.error };
      }

      if (result.data.session) {
        await synchronizeSession(store, result.data.session);
      } else {
        store.setState({ pendingVerificationEmail: normalizedEmail, authError: null });
      }

      return { ok: true };
    },

    async signIn(email, password) {
      store.setState({ authError: null });
      const normalizedEmail = normalizeEmail(email);
      const result = await getAuthService().signIn(normalizedEmail, password);

      if (!result.ok) {
        if (result.error.code === 'email_not_verified') {
          store.setState({ pendingVerificationEmail: normalizedEmail, authError: null });
          return { ok: true };
        }

        store.setState({ authError: result.error });
        return { ok: false, error: result.error };
      }

      await synchronizeSession(store, result.data.session);
      return { ok: true };
    },

    async signOut() {
      setIntentionalSignOut(true);
      invalidateProfileRequests();
      let result: Awaited<ReturnType<AuthService['signOut']>>;

      try {
        result = await getAuthService().signOut();
      } catch (error) {
        result = { ok: false, error: normalizeAuthenticationError(error) };
      } finally {
        store.setState(createSignedOutSnapshot());
        setIntentionalSignOut(false);
      }

      return result.ok ? { ok: true } : { ok: false, error: result.error };
    },

    async requestPasswordReset(email) {
      store.setState({ authError: null });
      const result = await getAuthService().requestPasswordReset(email);

      if (!result.ok) {
        store.setState({ authError: result.error });
        return { ok: false, error: result.error };
      }

      return { ok: true };
    },

    async updatePassword(password) {
      store.setState({ authError: null });
      const result = await getAuthService().updatePassword(password);

      if (!result.ok) {
        const error =
          result.error.code === 'invalid_session'
            ? createRecoveryExpiredError(result.error)
            : result.error;
        store.setState({
          authError: error,
          recoveryState:
            error.code === 'recovery_expired'
              ? { status: 'error', error }
              : store.getState().recoveryState,
        });
        return { ok: false, error };
      }

      return { ok: true };
    },

    async resendVerification() {
      const email = store.getState().user?.email ?? store.getState().pendingVerificationEmail;

      if (!email) {
        const error = normalizeAuthenticationError(
          new Error('No email is available for verification.'),
        );
        store.setState({ authError: error });
        return { ok: false, error };
      }

      store.setState({ authError: null });
      const result = await getAuthService().resendVerification(email);

      if (!result.ok) {
        store.setState({ authError: result.error });
        return { ok: false, error: result.error };
      }

      return { ok: true };
    },

    async checkEmailVerification() {
      if (!store.getState().session) return { ok: true };

      store.setState({ authError: null });
      const result = await getAuthService().refreshSession();

      if (!result.ok) {
        store.setState({ authError: result.error });
        return { ok: false, error: result.error };
      }

      await synchronizeSession(store, result.data, false, true);
      return { ok: true };
    },
  };
}

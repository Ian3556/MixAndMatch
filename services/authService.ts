import type { AuthChangeEvent, Session, Subscription, User } from '@supabase/supabase-js';
import * as Linking from 'expo-linking';

import { getSupabaseClient } from '@/supabase';
import type {
  AuthCallbackResult,
  AuthenticationResult,
  SignInResult,
  SignUpResult,
} from '@/types/auth';
import { withTimeout } from '@/utils/promise/withTimeout';
import { normalizeEmail } from '@/utils/validation/authValidation';

import { parseAuthCallback } from './authCallback';
import {
  createRecoveryExpiredError,
  createVerificationLinkError,
  isAccountNotFoundError,
  normalizeAuthenticationError,
} from './authErrors';

const VERIFICATION_PATH = 'auth/verify-email';
const RECOVERY_PATH = 'auth/reset-password';

export type AuthStateChangeHandler = (event: AuthChangeEvent, session: Session | null) => void;
export type AuthService = ReturnType<typeof createAuthService>;

export function createAuthService() {
  const client = getSupabaseClient();

  return {
    async getSession(): Promise<AuthenticationResult<Session | null>> {
      return callAuth(async () => {
        const { data, error } = await withTimeout(client.auth.getSession());
        return error ? failure<Session | null>(error) : success(data.session);
      });
    },

    async getAuthenticatedUser(): Promise<AuthenticationResult<User>> {
      return callAuth(async () => {
        const { data, error } = await withTimeout(client.auth.getUser());
        return error || !data.user
          ? failure<User>(error ?? new Error('Authenticated user is unavailable.'))
          : success(data.user);
      });
    },

    async refreshSession(): Promise<AuthenticationResult<Session>> {
      return callAuth(async () => {
        const { data, error } = await withTimeout(client.auth.refreshSession());
        return error || !data.session
          ? failure<Session>(error ?? new Error('Session refresh did not return a session.'))
          : success(data.session);
      });
    },

    async signUp(email: string, password: string): Promise<AuthenticationResult<SignUpResult>> {
      return callAuth(async () => {
        const { data, error } = await withTimeout(
          client.auth.signUp({
            email: normalizeEmail(email),
            password,
            options: { emailRedirectTo: Linking.createURL(VERIFICATION_PATH) },
          }),
        );

        return error
          ? failure<SignUpResult>(error)
          : success({
              session: data.session,
              user: data.user,
              requiresEmailVerification: data.session === null,
            });
      });
    },

    async signIn(email: string, password: string): Promise<AuthenticationResult<SignInResult>> {
      return callAuth(async () => {
        const { data, error } = await withTimeout(
          client.auth.signInWithPassword({ email: normalizeEmail(email), password }),
        );

        return error || !data.session || !data.user
          ? failure<SignInResult>(error ?? new Error('Sign in did not return a session.'))
          : success({ session: data.session, user: data.user });
      });
    },

    async signOut(): Promise<AuthenticationResult<undefined>> {
      return callAuth(async () => {
        const { error } = await withTimeout(client.auth.signOut({ scope: 'local' }));
        return error ? failure<undefined>(error) : success(undefined);
      });
    },

    async requestPasswordReset(email: string): Promise<AuthenticationResult<undefined>> {
      return callAuth(async () => {
        const { error } = await withTimeout(
          client.auth.resetPasswordForEmail(normalizeEmail(email), {
            redirectTo: Linking.createURL(RECOVERY_PATH),
          }),
        );
        return error && !isAccountNotFoundError(error)
          ? failure<undefined>(error)
          : success(undefined);
      });
    },

    async updatePassword(password: string): Promise<AuthenticationResult<undefined>> {
      return callAuth(async () => {
        const { error } = await withTimeout(client.auth.updateUser({ password }));
        return error ? failure<undefined>(error) : success(undefined);
      });
    },

    async resendVerification(email: string): Promise<AuthenticationResult<undefined>> {
      return callAuth(async () => {
        const { error } = await withTimeout(
          client.auth.resend({
            type: 'signup',
            email: normalizeEmail(email),
            options: { emailRedirectTo: Linking.createURL(VERIFICATION_PATH) },
          }),
        );
        return error ? failure<undefined>(error) : success(undefined);
      });
    },

    async processAuthCallbackUrl(url: string): Promise<AuthenticationResult<AuthCallbackResult>> {
      const callback = parseAuthCallback(url);
      if (!callback.handled) return success({ handled: false, kind: null, session: null });
      if (callback.error) {
        return {
          ok: false,
          error:
            callback.kind === 'recovery'
              ? createRecoveryExpiredError(callback.error)
              : createVerificationLinkError(callback.error),
        };
      }

      return callAuth(async () => {
        if (callback.tokenHash) {
          const { data, error } = await withTimeout(
            client.auth.verifyOtp({
              token_hash: callback.tokenHash,
              type: callback.kind === 'recovery' ? 'recovery' : 'signup',
            }),
          );
          return error || !data.session
            ? failure<AuthCallbackResult>(error ?? new Error('The authentication link is invalid.'))
            : success({ handled: true, kind: callback.kind, session: data.session });
        }

        if (callback.code) {
          const { data, error } = await withTimeout(
            client.auth.exchangeCodeForSession(callback.code),
          );
          return error || !data.session
            ? failure<AuthCallbackResult>(error ?? new Error('The authentication link is invalid.'))
            : success({ handled: true, kind: callback.kind, session: data.session });
        }

        if (callback.accessToken && callback.refreshToken) {
          const { data, error } = await withTimeout(
            client.auth.setSession({
              access_token: callback.accessToken,
              refresh_token: callback.refreshToken,
            }),
          );
          return error || !data.session
            ? failure<AuthCallbackResult>(error ?? new Error('The authentication link is invalid.'))
            : success({ handled: true, kind: callback.kind, session: data.session });
        }

        return {
          ok: false,
          error:
            callback.kind === 'recovery'
              ? createRecoveryExpiredError()
              : createVerificationLinkError(),
        };
      });
    },

    onAuthStateChange(handler: AuthStateChangeHandler): Subscription {
      return client.auth.onAuthStateChange(handler).data.subscription;
    },
  };
}

export function isEmailVerified(user: User | null): boolean {
  return Boolean(user?.email_confirmed_at);
}

async function callAuth<T>(
  operation: () => Promise<AuthenticationResult<T>>,
): Promise<AuthenticationResult<T>> {
  try {
    return await operation();
  } catch (error) {
    return failure<T>(error);
  }
}

function success<T>(data: T): AuthenticationResult<T> {
  return { ok: true, data };
}

function failure<T>(error: unknown): AuthenticationResult<T> {
  return { ok: false, error: normalizeAuthenticationError(error) };
}

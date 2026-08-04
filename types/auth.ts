import type { Session, User } from '@supabase/supabase-js';

export type AuthenticationErrorCode =
  | 'configuration_missing'
  | 'invalid_credentials'
  | 'email_already_registered'
  | 'email_not_verified'
  | 'weak_password'
  | 'password_mismatch'
  | 'recovery_expired'
  | 'rate_limited'
  | 'network_unavailable'
  | 'session_expired'
  | 'invalid_session'
  | 'unknown_auth_error';

export type AuthenticationError = {
  domain: 'auth' | 'configuration' | 'session';
  code: AuthenticationErrorCode;
  message: string;
  recoverable: boolean;
  cause?: unknown;
};

export type AuthenticationResult<T> =
  { ok: true; data: T } | { ok: false; error: AuthenticationError };

export type SignUpResult = {
  session: Session | null;
  user: User | null;
  requiresEmailVerification: boolean;
};

export type SignInResult = {
  session: Session;
  user: User;
};

export type AuthCallbackKind = 'recovery' | 'verification';

export type AuthCallbackResult = {
  handled: boolean;
  kind: AuthCallbackKind | null;
  session: Session | null;
};

export type PasswordRecoveryState =
  | { status: 'idle'; error: null }
  | { status: 'processing'; error: null }
  | { status: 'ready'; error: null }
  | { status: 'error'; error: AuthenticationError };

import type { AuthenticationError } from '@/types/auth';
import { OperationTimedOutError } from '@/utils/promise/withTimeout';

export function normalizeAuthenticationError(error: unknown): AuthenticationError {
  const code = readProperty(error, 'code').toLowerCase();
  const message = readProperty(error, 'message').toLowerCase();
  const status = readNumberProperty(error, 'status');

  if (message.includes('supabase is not configured')) {
    return createAuthenticationError(
      'configuration',
      'configuration_missing',
      'Supabase is not configured for this build. Add the required environment values and restart the app.',
      false,
      error,
    );
  }

  if (code === 'invalid_credentials' || message.includes('invalid login credentials')) {
    return createAuthenticationError(
      'auth',
      'invalid_credentials',
      'The email or password is incorrect.',
      true,
      error,
    );
  }

  if (code === 'user_already_exists' || message.includes('already registered')) {
    return createAuthenticationError(
      'auth',
      'email_already_registered',
      'Check your email for the next step, or sign in if you already have an account.',
      true,
      error,
    );
  }

  if (code === 'email_not_confirmed' || message.includes('email not confirmed')) {
    return createAuthenticationError(
      'auth',
      'email_not_verified',
      'Verify your email before signing in.',
      true,
      error,
    );
  }

  if (code === 'weak_password' || message.includes('password should be')) {
    return createAuthenticationError(
      'auth',
      'weak_password',
      'Choose a stronger password and try again.',
      true,
      error,
    );
  }

  if (
    status === 429 ||
    code.includes('rate_limit') ||
    code.includes('over_email_send') ||
    message.includes('rate limit')
  ) {
    return createAuthenticationError(
      'auth',
      'rate_limited',
      'Too many attempts. Wait a moment before trying again.',
      true,
      error,
    );
  }

  if (
    code === 'otp_expired' ||
    code === 'flow_state_expired' ||
    code === 'bad_code_verifier' ||
    message.includes('expired')
  ) {
    return createRecoveryExpiredError(error);
  }

  if (
    code === 'session_not_found' ||
    code.includes('refresh_token') ||
    message.includes('invalid session')
  ) {
    return createInvalidSessionError(error);
  }

  if (
    error instanceof TypeError ||
    error instanceof OperationTimedOutError ||
    message.includes('network') ||
    message.includes('fetch')
  ) {
    return createAuthenticationError(
      'auth',
      'network_unavailable',
      'We could not reach the authentication service. Check your connection and try again.',
      true,
      error,
    );
  }

  return createAuthenticationError(
    'auth',
    'unknown_auth_error',
    'Authentication could not be completed. Please try again.',
    true,
    error,
  );
}

export function createInvalidSessionError(cause?: unknown): AuthenticationError {
  return createAuthenticationError(
    'session',
    'invalid_session',
    'Your session is no longer valid. Sign in again to continue.',
    true,
    cause,
  );
}

export function createSessionExpiredError(): AuthenticationError {
  return createAuthenticationError(
    'session',
    'session_expired',
    'Your session expired. Sign in again to continue.',
    true,
  );
}

export function createRecoveryExpiredError(cause?: unknown): AuthenticationError {
  return createAuthenticationError(
    'auth',
    'recovery_expired',
    'This recovery link is invalid or has expired. Request a new email to continue.',
    true,
    cause,
  );
}

export function createVerificationLinkError(cause?: unknown): AuthenticationError {
  return createAuthenticationError(
    'auth',
    'email_not_verified',
    'This verification link is invalid or has expired. Request a new email or return to sign in.',
    true,
    cause,
  );
}

export function isAccountNotFoundError(error: unknown): boolean {
  const code = readProperty(error, 'code').toLowerCase();
  const message = readProperty(error, 'message').toLowerCase();
  return code === 'user_not_found' || message.includes('user not found');
}

function createAuthenticationError(
  domain: AuthenticationError['domain'],
  code: AuthenticationError['code'],
  message: string,
  recoverable: boolean,
  cause?: unknown,
): AuthenticationError {
  const error: AuthenticationError = { domain, code, message, recoverable };

  if (cause !== undefined) {
    error.cause = cause;
  }

  return error;
}

function readProperty(value: unknown, key: string): string {
  if (typeof value !== 'object' || value === null || !(key in value)) {
    return '';
  }

  const property = Reflect.get(value, key);
  return typeof property === 'string' ? property : '';
}

function readNumberProperty(value: unknown, key: string): number | null {
  if (typeof value !== 'object' || value === null || !(key in value)) {
    return null;
  }

  const property = Reflect.get(value, key);
  return typeof property === 'number' ? property : null;
}

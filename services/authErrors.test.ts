import { describe, expect, it } from 'vitest';

import {
  createVerificationLinkError,
  isAccountNotFoundError,
  normalizeAuthenticationError,
} from './authErrors';

describe('authentication error normalization', () => {
  it('maps invalid credentials without exposing the backend message', () => {
    expect(
      normalizeAuthenticationError({
        code: 'invalid_credentials',
        message: 'Internal credential detail',
      }),
    ).toMatchObject({
      code: 'invalid_credentials',
      message: 'The email or password is incorrect.',
    });
  });

  it('maps verification and rate-limit failures to recoverable states', () => {
    expect(normalizeAuthenticationError({ code: 'email_not_confirmed' })).toMatchObject({
      code: 'email_not_verified',
      recoverable: true,
    });
    expect(
      normalizeAuthenticationError({ status: 429, message: 'Too many requests' }),
    ).toMatchObject({
      code: 'rate_limited',
      recoverable: true,
    });
  });

  it('recognizes account-not-found reset responses for neutral handling', () => {
    expect(isAccountNotFoundError({ code: 'user_not_found' })).toBe(true);
  });

  it('creates a verification-specific expired-link error', () => {
    expect(createVerificationLinkError()).toMatchObject({
      code: 'email_not_verified',
      recoverable: true,
    });
  });
});

import type { Session, User } from '@supabase/supabase-js';
import { describe, expect, it } from 'vitest';

import type { Profile } from '@/types/profile';
import { createEmptyStyleProfile } from '@/types/profile';

import { createSignedOutSnapshot, resolveAuthFlow, type AuthSnapshot } from './authState';

const user = {
  id: '11111111-1111-1111-1111-111111111111',
  email: 'person@example.com',
  email_confirmed_at: '2026-08-03T00:00:00.000Z',
} as User;

const session = { user } as Session;

const incompleteProfile: Profile = {
  id: user.id,
  displayName: null,
  avatarUrl: null,
  styleProfile: createEmptyStyleProfile(),
  onboardingCompleted: false,
  createdAt: '2026-08-03T00:00:00.000Z',
  updatedAt: '2026-08-03T00:00:00.000Z',
};

function authenticatedSnapshot(profile: Profile | null): AuthSnapshot {
  return {
    ...createSignedOutSnapshot(),
    session,
    user,
    profile,
    isAuthenticated: true,
    isEmailVerified: true,
    isOnboardingComplete: profile?.onboardingCompleted ?? false,
    profileStatus: profile ? 'ready' : 'missing',
  };
}

describe('authentication flow state', () => {
  it('keeps protected navigation hidden while initializing', () => {
    expect(resolveAuthFlow({ ...createSignedOutSnapshot(), isInitializing: true })).toBe(
      'initializing',
    );
  });

  it('routes a signed-out state to authentication', () => {
    expect(resolveAuthFlow(createSignedOutSnapshot())).toBe('signedOut');
  });

  it('routes a signed-in incomplete profile to onboarding', () => {
    expect(resolveAuthFlow(authenticatedSnapshot(incompleteProfile))).toBe('onboarding');
  });

  it('routes a signed-in completed profile to the main application', () => {
    expect(
      resolveAuthFlow(
        authenticatedSnapshot({
          ...incompleteProfile,
          displayName: 'Ada',
          onboardingCompleted: true,
        }),
      ),
    ).toBe('main');
  });

  it('clears sensitive state on sign out', () => {
    const cleared = createSignedOutSnapshot();
    expect(cleared).toMatchObject({
      session: null,
      user: null,
      profile: null,
      isAuthenticated: false,
      isOnboardingComplete: false,
    });
  });

  it('surfaces session expiration as a recoverable error flow', () => {
    const expired = createSignedOutSnapshot({
      domain: 'session',
      code: 'session_expired',
      message: 'Your session expired.',
      recoverable: true,
    });
    expect(resolveAuthFlow(expired)).toBe('error');
  });

  it('treats a missing profile as incomplete onboarding, not another user profile', () => {
    expect(resolveAuthFlow(authenticatedSnapshot(null))).toBe('onboarding');
  });

  it('keeps an expired verification callback in a recoverable verification flow', () => {
    const verificationError = {
      ...createSignedOutSnapshot(),
      authError: {
        domain: 'auth' as const,
        code: 'email_not_verified' as const,
        message: 'The verification link expired.',
        recoverable: true,
      },
    };
    expect(resolveAuthFlow(verificationError)).toBe('verification');
  });
});

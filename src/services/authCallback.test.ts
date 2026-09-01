import { describe, expect, it } from 'vitest';

import { parseAuthCallback } from './authCallback';

describe('authentication callback parsing', () => {
  it('recognizes a recovery callback with fragment tokens', () => {
    expect(
      parseAuthCallback(
        'mixandmatch://auth/reset-password#access_token=access&refresh_token=refresh&type=recovery',
      ),
    ).toMatchObject({
      handled: true,
      kind: 'recovery',
      accessToken: 'access',
      refreshToken: 'refresh',
    });
  });

  it('recognizes a verification callback with a PKCE code', () => {
    expect(
      parseAuthCallback('mixandmatch://auth/verify-email?code=verification-code'),
    ).toMatchObject({
      handled: true,
      kind: 'verification',
      code: 'verification-code',
    });
  });

  it('extracts token hashes used by custom Supabase email templates', () => {
    expect(
      parseAuthCallback('mixandmatch://auth/verify-email?token_hash=hashed-token&type=signup'),
    ).toMatchObject({
      handled: true,
      kind: 'verification',
      tokenHash: 'hashed-token',
    });
  });

  it('ignores unrelated application links', () => {
    expect(parseAuthCallback('mixandmatch://wardrobe/item/123')).toMatchObject({
      handled: false,
    });
  });
});

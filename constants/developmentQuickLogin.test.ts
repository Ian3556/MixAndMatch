import { describe, expect, it } from 'vitest';

import { resolveDevelopmentQuickLoginCredentials } from './developmentQuickLogin';

describe('development Quick Login configuration', () => {
  it('returns configured credentials only in development', () => {
    expect(
      resolveDevelopmentQuickLoginCredentials(true, '  tester@example.com  ', 'test-password'),
    ).toEqual({ email: 'tester@example.com', password: 'test-password' });

    expect(
      resolveDevelopmentQuickLoginCredentials(false, 'tester@example.com', 'test-password'),
    ).toBeNull();
  });

  it('requires both an email and password', () => {
    expect(resolveDevelopmentQuickLoginCredentials(true, '', 'test-password')).toBeNull();
    expect(resolveDevelopmentQuickLoginCredentials(true, 'tester@example.com', '')).toBeNull();
    expect(resolveDevelopmentQuickLoginCredentials(true, undefined, undefined)).toBeNull();
  });

  it('preserves password whitespace because passwords are not normalized', () => {
    expect(
      resolveDevelopmentQuickLoginCredentials(true, 'tester@example.com', ' spaced password '),
    ).toEqual({ email: 'tester@example.com', password: ' spaced password ' });
  });
});

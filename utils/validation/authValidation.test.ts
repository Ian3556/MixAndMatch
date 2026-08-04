import { describe, expect, it } from 'vitest';

import {
  normalizeDisplayName,
  normalizeEmail,
  validateDisplayName,
  validateEmail,
  validatePassword,
  validatePasswordConfirmation,
} from './authValidation';

describe('authentication validation', () => {
  it('accepts a valid normalized email', () => {
    expect(validateEmail(' PERSON@example.com ')).toBeNull();
    expect(normalizeEmail(' PERSON@example.com ')).toBe('person@example.com');
  });

  it('rejects invalid and empty emails', () => {
    expect(validateEmail('not-an-email')).toBe('Enter a valid email address.');
    expect(validateEmail('   ')).toBe('Email is required.');
  });

  it('enforces the password policy', () => {
    expect(validatePassword('')).toBe('Password is required.');
    expect(validatePassword('short1')).toBe('Use at least 8 characters.');
    expect(validatePassword('onlyletters')).toBe('Include at least one letter and one number.');
    expect(validatePassword('correct-horse-7')).toBeNull();
  });

  it('accepts matching passwords and rejects mismatches', () => {
    expect(validatePasswordConfirmation('Password1', 'Password1')).toBeNull();
    expect(validatePasswordConfirmation('Password1', 'Password2')).toBe('Passwords do not match.');
  });

  it('trims and validates display names', () => {
    expect(normalizeDisplayName('  Ada   Lovelace  ')).toBe('Ada Lovelace');
    expect(validateDisplayName('  Ada   Lovelace  ')).toBeNull();
    expect(validateDisplayName('   ')).toBe('Display name is required.');
    expect(validateDisplayName('A')).toBe('Use at least 2 characters.');
  });
});

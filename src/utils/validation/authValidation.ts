export type FieldErrors<T extends string> = Partial<Record<T, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function normalizeDisplayName(value: string): string {
  return value.trim().replace(/\s+/g, ' ');
}

export function validateEmail(value: string): string | null {
  const email = normalizeEmail(value);

  if (!email) {
    return 'Email is required.';
  }

  if (email.length > 254 || !EMAIL_PATTERN.test(email)) {
    return 'Enter a valid email address.';
  }

  return null;
}

export function validatePassword(value: string): string | null {
  if (!value) {
    return 'Password is required.';
  }

  if (value.length < 8) {
    return 'Use at least 8 characters.';
  }

  if (value.length > 128) {
    return 'Use no more than 128 characters.';
  }

  if (!/[A-Za-z]/.test(value) || !/\d/.test(value)) {
    return 'Include at least one letter and one number.';
  }

  return null;
}

export function validatePasswordConfirmation(
  password: string,
  confirmation: string,
): string | null {
  if (!confirmation) {
    return 'Confirm your password.';
  }

  if (password !== confirmation) {
    return 'Passwords do not match.';
  }

  return null;
}

export function validateDisplayName(value: string): string | null {
  const displayName = normalizeDisplayName(value);

  if (!displayName) {
    return 'Display name is required.';
  }

  if (displayName.length < 2) {
    return 'Use at least 2 characters.';
  }

  if (displayName.length > 50) {
    return 'Use no more than 50 characters.';
  }

  return null;
}

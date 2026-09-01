import type {
  Profile,
  ProfileError,
  ProfileInsert,
  ProfileRow,
  ProfileUpdate,
  SaveProfileInput,
} from '@/types/profile';
import { normalizeDisplayName } from '@/utils/validation/authValidation';

export type ProfileGatewayResult<T> = {
  data: T;
  error: unknown;
};

export type ProfileGateway = {
  fetchById: (userId: string) => Promise<ProfileGatewayResult<ProfileRow | null>>;
  upsert: (payload: ProfileInsert) => Promise<ProfileGatewayResult<ProfileRow | null>>;
  update: (
    userId: string,
    payload: ProfileUpdate,
  ) => Promise<ProfileGatewayResult<ProfileRow | null>>;
};

export type ProfileService = ReturnType<typeof createProfileService>;

export function createProfileService(gateway: ProfileGateway) {
  return {
    async fetchCurrentProfile(userId: string): Promise<Profile | null> {
      const result = await gateway.fetchById(userId);

      if (result.error) {
        throw normalizeProfileError(result.error);
      }

      return result.data ? mapProfileRow(result.data) : null;
    },

    async updateProfile(userId: string, input: Partial<SaveProfileInput>): Promise<Profile> {
      const payload: ProfileUpdate = {};

      if (input.displayName !== undefined) {
        payload.display_name = normalizeDisplayName(input.displayName);
      }

      if (input.avatarUrl !== undefined) {
        payload.avatar_url = input.avatarUrl;
      }

      const result = await gateway.update(userId, payload);

      if (result.error) {
        throw normalizeProfileError(result.error);
      }

      if (!result.data) {
        throw createMissingProfileError();
      }

      return mapProfileRow(result.data);
    },

    async completeOnboarding(userId: string, input: SaveProfileInput): Promise<Profile> {
      const payload: ProfileInsert = {
        id: userId,
        display_name: normalizeDisplayName(input.displayName),
        onboarding_completed: true,
      };

      if (input.avatarUrl !== undefined) {
        payload.avatar_url = input.avatarUrl;
      }

      const result = await gateway.upsert(payload);

      if (result.error) {
        throw normalizeProfileError(result.error);
      }

      if (!result.data) {
        throw createMissingProfileError();
      }

      return mapProfileRow(result.data);
    },
  };
}

export function mapProfileRow(row: ProfileRow): Profile {
  return {
    id: row.id,
    displayName: row.display_name,
    avatarUrl: row.avatar_url,
    onboardingCompleted: row.onboarding_completed,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function normalizeProfileError(error: unknown): ProfileError {
  const code = readStringProperty(error, 'code');
  const message = readStringProperty(error, 'message').toLowerCase();

  if (code === '42501' || code === 'PGRST301') {
    return {
      domain: 'profile',
      code: 'profile_unauthorized',
      message: 'You are not authorized to access this profile.',
      recoverable: false,
      cause: error,
    };
  }

  if (code === '23514' || code === '23502') {
    return {
      domain: 'profile',
      code: 'profile_invalid',
      message: 'The profile information is invalid. Review the form and try again.',
      recoverable: true,
      cause: error,
    };
  }

  if (error instanceof TypeError || message.includes('network') || message.includes('fetch')) {
    return {
      domain: 'profile',
      code: 'profile_network_error',
      message: 'We could not reach the profile service. Check your connection and try again.',
      recoverable: true,
      cause: error,
    };
  }

  return {
    domain: 'profile',
    code: 'unknown_profile_error',
    message: 'We could not load your profile. Please try again.',
    recoverable: true,
    cause: error,
  };
}

function createMissingProfileError(): ProfileError {
  return {
    domain: 'profile',
    code: 'profile_missing',
    message: 'Your profile is not available yet. Please try again.',
    recoverable: true,
  };
}

function readStringProperty(value: unknown, key: string): string {
  if (typeof value !== 'object' || value === null || !(key in value)) {
    return '';
  }

  const property = Reflect.get(value, key);
  return typeof property === 'string' ? property : '';
}

import type { Database } from './database';

export type ProfileRow = Database['public']['Tables']['profiles']['Row'];
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export type Profile = {
  id: string;
  displayName: string | null;
  avatarUrl: string | null;
  styleProfile: StyleProfile;
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
};

export type SaveProfileInput = {
  displayName: string;
  avatarUrl?: string | null;
  styleProfile?: StyleProfile;
};

export type BodyProfile = {
  faceShape: string | null;
  bodyType: string | null;
  heightCm: number | null;
  weightKg: number | null;
  skinTone: string | null;
  skinUndertone: string | null;
};

export type StyleProfile = {
  body: BodyProfile;
  preferredStyles: string[];
  favoriteColors: string[];
  avoidColors: string[];
  occasions: string[];
  fitPreferences: string[];
};

export function createEmptyStyleProfile(): StyleProfile {
  return {
    body: {
      faceShape: null,
      bodyType: null,
      heightCm: null,
      weightKg: null,
      skinTone: null,
      skinUndertone: null,
    },
    preferredStyles: [],
    favoriteColors: [],
    avoidColors: [],
    occasions: [],
    fitPreferences: [],
  };
}

export type ProfileErrorCode =
  | 'profile_missing'
  | 'profile_unauthorized'
  | 'profile_invalid'
  | 'profile_network_error'
  | 'unknown_profile_error';

export type ProfileError = {
  domain: 'profile';
  code: ProfileErrorCode;
  message: string;
  recoverable: boolean;
  cause?: unknown;
};

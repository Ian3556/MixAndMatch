import type { Database } from './database';

export type ProfileRow = Database['public']['Tables']['profiles']['Row'];
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export type Profile = {
  id: string;
  displayName: string | null;
  avatarUrl: string | null;
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
};

export type SaveProfileInput = {
  displayName: string;
  avatarUrl?: string | null;
};

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

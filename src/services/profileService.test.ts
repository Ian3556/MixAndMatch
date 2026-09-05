import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { ProfileRow } from '@/types/profile';

import { createProfileService, normalizeProfileError, type ProfileGateway } from './profileService';

const row: ProfileRow = {
  id: '11111111-1111-1111-1111-111111111111',
  display_name: 'Ada',
  avatar_url: null,
  style_profile: {},
  onboarding_completed: true,
  created_at: '2026-08-03T00:00:00.000Z',
  updated_at: '2026-08-03T00:00:00.000Z',
};

const fetchById = vi.fn<ProfileGateway['fetchById']>();
const upsert = vi.fn<ProfileGateway['upsert']>();
const update = vi.fn<ProfileGateway['update']>();
const service = createProfileService({ fetchById, upsert, update });

describe('profile service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches and maps the current user profile', async () => {
    fetchById.mockResolvedValue({ data: row, error: null });

    await expect(service.fetchCurrentProfile(row.id)).resolves.toMatchObject({
      id: row.id,
      displayName: 'Ada',
      styleProfile: {
        preferredStyles: [],
        favoriteColors: [],
        avoidColors: [],
        occasions: [],
        fitPreferences: [],
      },
      onboardingCompleted: true,
    });
    expect(fetchById).toHaveBeenCalledWith(row.id);
  });

  it('returns null safely when the current user profile is missing', async () => {
    fetchById.mockResolvedValue({ data: null, error: null });
    await expect(service.fetchCurrentProfile(row.id)).resolves.toBeNull();
  });

  it('updates only the supplied profile fields for the current user', async () => {
    update.mockResolvedValue({ data: { ...row, display_name: 'Ada Lovelace' }, error: null });

    await expect(
      service.updateProfile(row.id, { displayName: '  Ada   Lovelace  ' }),
    ).resolves.toMatchObject({ displayName: 'Ada Lovelace' });
    expect(update).toHaveBeenCalledWith(row.id, { display_name: 'Ada Lovelace' });
  });

  it('maps valid style preferences and ignores malformed legacy values', async () => {
    fetchById.mockResolvedValue({
      data: {
        ...row,
        style_profile: {
          body: { faceShape: 'Oval', heightCm: 170, weightKg: -5 },
          preferredStyles: ['Minimalist', 'Minimalist', 12],
          favoriteColors: ['Navy'],
          occasions: 'Everyday',
        },
      },
      error: null,
    });

    await expect(service.fetchCurrentProfile(row.id)).resolves.toMatchObject({
      styleProfile: {
        body: { faceShape: 'Oval', heightCm: 170, weightKg: null },
        preferredStyles: ['Minimalist'],
        favoriteColors: ['Navy'],
        occasions: [],
      },
    });
  });

  it('persists the style profile in the existing profile row', async () => {
    const styleProfile = {
      body: {
        faceShape: 'Oval',
        bodyType: 'Rectangle',
        heightCm: 170,
        weightKg: 65,
        skinTone: 'Medium',
        skinUndertone: 'Warm',
      },
      preferredStyles: ['Minimalist'],
      favoriteColors: ['Navy'],
      avoidColors: ['Orange'],
      occasions: ['Work'],
      fitPreferences: ['Tailored'],
    };
    upsert.mockResolvedValue({ data: { ...row, style_profile: styleProfile }, error: null });

    await service.completeOnboarding(row.id, { displayName: 'Ada', styleProfile });
    expect(upsert).toHaveBeenCalledWith({
      id: row.id,
      display_name: 'Ada',
      onboarding_completed: true,
      style_profile: styleProfile,
    });
  });

  it('creates a missing profile and completes onboarding in one upsert', async () => {
    upsert.mockResolvedValue({ data: row, error: null });

    await service.completeOnboarding(row.id, { displayName: 'Ada' });
    expect(upsert).toHaveBeenCalledWith({
      id: row.id,
      display_name: 'Ada',
      onboarding_completed: true,
    });
  });

  it('normalizes profile authorization errors', () => {
    expect(normalizeProfileError({ code: '42501', message: 'permission denied' })).toMatchObject({
      code: 'profile_unauthorized',
      recoverable: false,
    });
  });

  it('reports a missing update response predictably', async () => {
    update.mockResolvedValue({ data: null, error: null });

    await expect(service.updateProfile(row.id, { displayName: 'Ada' })).rejects.toMatchObject({
      code: 'profile_missing',
    });
  });
});

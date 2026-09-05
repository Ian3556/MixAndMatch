import { describe, expect, it } from 'vitest';

import { PROFILE_ROUTES } from './routes';

describe('profile routes', () => {
  it('keeps each style-profile destination on a distinct route', () => {
    expect([
      PROFILE_ROUTES.STYLE_PROFILE,
      PROFILE_ROUTES.BODY_PROFILE,
      PROFILE_ROUTES.PREFERRED_STYLES,
      PROFILE_ROUTES.COLOR,
      PROFILE_ROUTES.OCCASIONS,
      PROFILE_ROUTES.FIT_PREFERENCES,
    ]).toEqual([
      'StyleProfile',
      'BodyProfile',
      'PreferredStyles',
      'ColorPreferences',
      'Occasions',
      'FitPreferences',
    ]);
  });
});

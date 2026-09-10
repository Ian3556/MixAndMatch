import { describe, expect, it } from 'vitest';

import {
  calculateStartupCompletionDelay,
  STARTUP_COMPLETION_HOLD_MS,
  STARTUP_MINIMUM_VISIBLE_MS,
  STARTUP_PROGRESS_ANIMATION_MS,
} from './startupTiming';

describe('startup timing', () => {
  it('keeps a fast startup visible through the minimum and completion hold', () => {
    const elapsed = 100;

    expect(calculateStartupCompletionDelay(elapsed, false)).toBe(
      STARTUP_MINIMUM_VISIBLE_MS - elapsed + STARTUP_COMPLETION_HOLD_MS,
    );
  });

  it('lets the final logo fill settle before dismissing a slow startup', () => {
    expect(calculateStartupCompletionDelay(2_000, false)).toBe(
      STARTUP_PROGRESS_ANIMATION_MS + STARTUP_COMPLETION_HOLD_MS,
    );
  });

  it('removes motion-only delay while preserving the completion hold', () => {
    expect(calculateStartupCompletionDelay(2_000, true)).toBe(STARTUP_COMPLETION_HOLD_MS);
  });

  it('still protects the minimum display time when reduced motion is enabled', () => {
    const elapsed = 100;

    expect(calculateStartupCompletionDelay(elapsed, true)).toBe(
      STARTUP_MINIMUM_VISIBLE_MS - elapsed + STARTUP_COMPLETION_HOLD_MS,
    );
  });
});

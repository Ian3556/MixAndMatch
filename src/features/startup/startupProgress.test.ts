import { describe, expect, it } from 'vitest';

import {
  calculateStartupProgress,
  getMonotonicDisplayProgress,
  normalizeStartupProgress,
  STARTUP_STEP_PROGRESS,
} from './startupProgress';

describe('startup progress', () => {
  it('derives progress from completed real initialization milestones', () => {
    expect(calculateStartupProgress([])).toBe(0);
    expect(calculateStartupProgress(['bootstrap', 'linking'])).toBe(STARTUP_STEP_PROGRESS.linking);
    expect(calculateStartupProgress(['bootstrap', 'session', 'user', 'profile'])).toBe(
      STARTUP_STEP_PROGRESS.profile,
    );
    expect(calculateStartupProgress(['complete'])).toBe(1);
  });

  it('never moves displayed progress backwards within an attempt', () => {
    expect(getMonotonicDisplayProgress(0.7, 0.4)).toBe(0.7);
    expect(getMonotonicDisplayProgress(0.4, 0.7)).toBe(0.7);
  });

  it('clamps invalid progress before rendering', () => {
    expect(normalizeStartupProgress(-1)).toBe(0);
    expect(normalizeStartupProgress(2)).toBe(1);
    expect(normalizeStartupProgress(Number.NaN)).toBe(0);
  });
});

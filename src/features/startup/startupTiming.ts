export const STARTUP_MINIMUM_VISIBLE_MS = 750;
export const STARTUP_PROGRESS_ANIMATION_MS = 360;
export const STARTUP_COMPLETION_HOLD_MS = 200;
export const STARTUP_FADE_MS = 300;

export function calculateStartupCompletionDelay(elapsedMs: number, reduceMotion: boolean) {
  const elapsed = Number.isFinite(elapsedMs) ? Math.max(0, elapsedMs) : 0;
  const minimumVisibleRemaining = Math.max(0, STARTUP_MINIMUM_VISIBLE_MS - elapsed);
  const fillSettleTime = reduceMotion ? 0 : STARTUP_PROGRESS_ANIMATION_MS;

  return Math.max(minimumVisibleRemaining, fillSettleTime) + STARTUP_COMPLETION_HOLD_MS;
}

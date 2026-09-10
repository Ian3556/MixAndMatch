import { create } from 'zustand';

export const STARTUP_STEP_PROGRESS = {
  bootstrap: 0.1,
  linking: 0.22,
  session: 0.48,
  user: 0.65,
  profile: 0.85,
  complete: 1,
} as const;

export type StartupStep = keyof typeof STARTUP_STEP_PROGRESS;

type StartupProgressState = {
  attempt: number;
  completedSteps: StartupStep[];
  markStep: (step: StartupStep) => void;
  reset: (completedSteps?: StartupStep[]) => void;
};

export const useStartupProgressStore = create<StartupProgressState>((set) => ({
  attempt: 0,
  completedSteps: [],
  markStep: (step) =>
    set((state) =>
      state.completedSteps.includes(step)
        ? state
        : { completedSteps: [...state.completedSteps, step] },
    ),
  reset: (completedSteps = []) => set((state) => ({ attempt: state.attempt + 1, completedSteps })),
}));

export function normalizeStartupProgress(progress: number) {
  if (!Number.isFinite(progress)) return 0;
  return Math.min(1, Math.max(0, progress));
}

export function calculateStartupProgress(completedSteps: readonly StartupStep[]) {
  return completedSteps.reduce(
    (progress, step) => Math.max(progress, STARTUP_STEP_PROGRESS[step]),
    0,
  );
}

export function getMonotonicDisplayProgress(previous: number, actual: number) {
  return Math.max(normalizeStartupProgress(previous), normalizeStartupProgress(actual));
}

export function selectStartupProgress(state: StartupProgressState) {
  return calculateStartupProgress(state.completedSteps);
}

export function beginStartupProgress() {
  if (useStartupProgressStore.getState().completedSteps.length === 0) {
    markStartupStep('bootstrap');
  }
}

export function markStartupStep(step: StartupStep) {
  useStartupProgressStore.getState().markStep(step);
}

export function markStartupComplete() {
  markStartupStep('complete');
}

export function restartStartupProgress() {
  useStartupProgressStore.getState().reset(['bootstrap', 'linking']);
}

import { AppLoadingScreen } from '@/features/startup/AppLoadingScreen';
import { selectStartupProgress, useStartupProgressStore } from '@/features/startup/startupProgress';
import { useReducedMotion } from '@/features/startup/useReducedMotion';

export function InitializationScreen() {
  const progress = useStartupProgressStore(selectStartupProgress);
  const attempt = useStartupProgressStore((state) => state.attempt);
  const reduceMotion = useReducedMotion();

  return <AppLoadingScreen attempt={attempt} progress={progress} reduceMotion={reduceMotion} />;
}

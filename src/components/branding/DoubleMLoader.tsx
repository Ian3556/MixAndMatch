import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, View } from 'react-native';

import {
  getMonotonicDisplayProgress,
  normalizeStartupProgress,
} from '@/features/startup/startupProgress';
import { STARTUP_PROGRESS_ANIMATION_MS } from '@/features/startup/startupTiming';

import { DoubleMLogo } from './DoubleMLogo';

type DoubleMLoaderProps = {
  progress: number;
  reduceMotion: boolean;
  size: number;
};

export function DoubleMLoader({ progress, reduceMotion, size }: DoubleMLoaderProps) {
  const [animatedProgress] = useState(() => new Animated.Value(0));
  const latestTarget = useRef(0);
  const [displayProgress, setDisplayProgress] = useState(0);

  useEffect(() => {
    const listenerId = animatedProgress.addListener(({ value }) => {
      setDisplayProgress(normalizeStartupProgress(value));
    });

    return () => animatedProgress.removeListener(listenerId);
  }, [animatedProgress]);

  useEffect(() => {
    const target = getMonotonicDisplayProgress(latestTarget.current, progress);
    latestTarget.current = target;

    animatedProgress.stopAnimation();

    if (reduceMotion) {
      animatedProgress.setValue(target);
      return undefined;
    }

    const animation = Animated.timing(animatedProgress, {
      duration: STARTUP_PROGRESS_ANIMATION_MS,
      easing: Easing.out(Easing.cubic),
      toValue: target,
      useNativeDriver: false,
    });

    animation.start();
    return () => animation.stop();
  }, [animatedProgress, progress, reduceMotion]);

  return (
    <View
      accessibilityLabel="Mix and Match is loading"
      accessibilityRole="progressbar"
      accessibilityState={{ busy: displayProgress < 1 }}
      accessibilityValue={{ max: 100, min: 0, now: Math.round(displayProgress * 100) }}
      style={{ height: size, width: size }}
      testID="double-m-loader"
    >
      <DoubleMLogo progress={displayProgress} size={size} />
    </View>
  );
}

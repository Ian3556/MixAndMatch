import * as SplashScreen from 'expo-splash-screen';
import { type PropsWithChildren, useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

import { resolveAuthFlow } from '@/store/authState';
import { useAuthStore } from '@/store/authStore';

import { AppLoadingScreen } from './AppLoadingScreen';
import {
  restartStartupProgress,
  selectStartupProgress,
  useStartupProgressStore,
} from './startupProgress';
import { calculateStartupCompletionDelay, STARTUP_FADE_MS } from './startupTiming';
import { useReducedMotion } from './useReducedMotion';

void SplashScreen.preventAutoHideAsync().catch(() => undefined);

export function StartupProvider({ children }: PropsWithChildren) {
  const actualProgress = useStartupProgressStore(selectStartupProgress);
  const attempt = useStartupProgressStore((state) => state.attempt);
  const authFlow = useAuthStore(resolveAuthFlow);
  const authError = useAuthStore((state) => state.authError);
  const retryAuthState = useAuthStore((state) => state.retryAuthState);
  const reduceMotion = useReducedMotion();
  const [opacity] = useState(() => new Animated.Value(1));
  const [initialStartedAt] = useState(() => Date.now());
  const startedAt = useRef(initialStartedAt);
  const nativeSplashHidden = useRef(false);
  const loggedError = useRef<unknown>(null);
  const [isVisible, setIsVisible] = useState(true);
  const hasStartupError = isVisible && authFlow === 'error';

  const hideNativeSplash = useCallback(() => {
    if (nativeSplashHidden.current) return;
    nativeSplashHidden.current = true;
    void SplashScreen.hideAsync().catch(() => undefined);
  }, []);

  useEffect(() => {
    if (!hasStartupError || !authError || loggedError.current === authError) return;
    loggedError.current = authError;

    if (__DEV__) {
      console.error('App initialization failed.', authError.cause ?? authError);
    }
  }, [authError, hasStartupError]);

  useEffect(() => {
    if (!isVisible || hasStartupError || actualProgress < 1) return undefined;

    const elapsed = Date.now() - startedAt.current;
    const delay = calculateStartupCompletionDelay(elapsed, reduceMotion);

    const completionTimer = setTimeout(() => {
      if (reduceMotion) {
        opacity.setValue(0);
        setIsVisible(false);
        return;
      }

      Animated.timing(opacity, {
        duration: STARTUP_FADE_MS,
        easing: Easing.out(Easing.cubic),
        toValue: 0,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) setIsVisible(false);
      });
    }, delay);

    return () => {
      clearTimeout(completionTimer);
      opacity.stopAnimation();
    };
  }, [actualProgress, attempt, hasStartupError, isVisible, opacity, reduceMotion]);

  const handleRetry = useCallback(() => {
    opacity.stopAnimation();
    opacity.setValue(1);
    startedAt.current = Date.now();
    loggedError.current = null;
    setIsVisible(true);
    restartStartupProgress();
    void retryAuthState();
  }, [opacity, retryAuthState]);

  return (
    <View onLayout={hideNativeSplash} style={styles.root}>
      {children}
      {isVisible ? (
        <Animated.View pointerEvents="auto" style={[styles.overlay, { opacity }]}>
          <AppLoadingScreen
            attempt={attempt}
            hasError={hasStartupError}
            onRetry={handleRetry}
            progress={actualProgress}
            reduceMotion={reduceMotion}
          />
        </Animated.View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: '#000000',
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  root: {
    backgroundColor: '#000000',
    flex: 1,
  },
});

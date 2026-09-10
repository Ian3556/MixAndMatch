import { Pressable, StatusBar, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DoubleMLoader } from '@/components/branding/DoubleMLoader';

type AppLoadingScreenProps = {
  attempt?: number;
  hasError?: boolean;
  onRetry?: () => void;
  progress: number;
  reduceMotion: boolean;
};

export function AppLoadingScreen({
  attempt = 0,
  hasError = false,
  onRetry,
  progress,
  reduceMotion,
}: AppLoadingScreenProps) {
  const { width } = useWindowDimensions();
  const logoSize = Math.min(180, Math.max(88, width * 0.25));

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar backgroundColor="#000000" barStyle="light-content" />
      <View style={styles.content}>
        <DoubleMLoader
          key={attempt}
          progress={progress}
          reduceMotion={reduceMotion}
          size={logoSize}
        />

        {hasError ? (
          <View accessibilityLiveRegion="assertive" style={styles.errorContent}>
            <Text accessibilityRole="alert" style={styles.errorMessage}>
              Something went wrong.
            </Text>
            {onRetry ? (
              <Pressable
                accessibilityLabel="Try app initialization again"
                accessibilityRole="button"
                onPress={onRetry}
                style={({ pressed }) => [styles.retryButton, pressed && styles.retryButtonPressed]}
              >
                <Text style={styles.retryLabel}>Try Again</Text>
              </Pressable>
            ) : null}
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 32,
  },
  errorContent: {
    alignItems: 'center',
    gap: 22,
    marginTop: 28,
  },
  errorMessage: {
    color: '#F5F5F2',
    fontSize: 17,
    letterSpacing: 0.2,
    lineHeight: 24,
    textAlign: 'center',
  },
  retryButton: {
    alignItems: 'center',
    borderColor: '#F5F5F2',
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 48,
    minWidth: 132,
    paddingHorizontal: 24,
  },
  retryButtonPressed: {
    backgroundColor: '#1B1B18',
  },
  retryLabel: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.4,
  },
  screen: {
    backgroundColor: '#000000',
    flex: 1,
  },
});

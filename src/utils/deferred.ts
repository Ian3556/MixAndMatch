import { Alert } from 'react-native';

/** Phase boundary: explains an unavailable dependency without simulating completion. */
export function showDeferredNotice(feature: string) {
  Alert.alert(
    `${feature} is unavailable in Phase 3`,
    'This control depends on later-phase product or platform work. No data was changed and no success is being simulated.',
  );
}

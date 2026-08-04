import { Alert } from 'react-native';

/** Phase 2 boundary: explains a deferred action without simulating completion. */
export function showDeferredNotice(feature: string) {
  Alert.alert(
    `${feature} is not connected yet`,
    'This Phase 2 screen previews the experience only. The underlying feature will be implemented in a later phase.',
  );
}

import { ErrorState } from '@/components/ui/StateViews';
import { WardrobeImportClientError } from '@/services/wardrobeImportService';

type Props = {
  error: WardrobeImportClientError;
  onRetry: () => void;
};

export function ImportErrorPanel({ error, onRetry }: Props) {
  const noProducts = error.code === 'NO_PRODUCTS_FOUND';
  return (
    <ErrorState
      action={{ label: noProducts ? 'Try another URL' : 'Retry', onPress: onRetry }}
      message={error.message}
      title={noProducts ? 'No products found' : errorTitle(error.code)}
    />
  );
}

function errorTitle(code: WardrobeImportClientError['code']): string {
  if (code === 'ACCESS_DENIED') return 'Page unavailable';
  if (code === 'RATE_LIMITED') return 'Please wait';
  if (code === 'IMPORT_TIMEOUT') return 'Import timed out';
  if (code === 'NETWORK_ERROR') return 'Connection problem';
  if (code === 'UNSAFE_URL' || code === 'INVALID_URL' || code === 'UNSUPPORTED_PROTOCOL') {
    return 'Check the URL';
  }
  return 'Import unavailable';
}

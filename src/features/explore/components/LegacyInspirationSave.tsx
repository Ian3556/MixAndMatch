import { exploreDiscoveryContent } from '../data/exploreDiscoveryContent';
import { SaveInspirationButton } from './SaveInspirationButton';

export function LegacyInspirationSave({ inspirationId }: { inspirationId: string }) {
  const item = exploreDiscoveryContent.find(
    (candidate) => candidate.inspirationId === inspirationId,
  );
  return item ? <SaveInspirationButton inspirationId={item.id} title={item.title} /> : null;
}

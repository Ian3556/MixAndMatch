import { useCallback, useEffect, useState } from 'react';

import { getExploreDiscoveryContent } from '../services/exploreDiscoveryService';
import type { ExploreDiscoveryItem } from '../types/discovery';

type ExploreDiscoveryState =
  | { status: 'loading'; items: null; error: null }
  | { status: 'ready'; items: readonly ExploreDiscoveryItem[]; error: null }
  | { status: 'error'; items: null; error: Error };

export function useExploreDiscoveryContent() {
  const [requestVersion, setRequestVersion] = useState(0);
  const [state, setState] = useState<ExploreDiscoveryState>({
    status: 'loading',
    items: null,
    error: null,
  });

  useEffect(() => {
    let active = true;

    void getExploreDiscoveryContent()
      .then((items) => {
        if (active) setState({ status: 'ready', items, error: null });
      })
      .catch((error: unknown) => {
        if (!active) return;
        setState({
          status: 'error',
          items: null,
          error: error instanceof Error ? error : new Error('Explore content failed to load.'),
        });
      });

    return () => {
      active = false;
    };
  }, [requestVersion]);

  const retry = useCallback(() => {
    setState({ status: 'loading', items: null, error: null });
    setRequestVersion((version) => version + 1);
  }, []);

  return { ...state, retry };
}

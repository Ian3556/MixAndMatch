import { useCallback, useEffect, useState } from 'react';

import { getHomeEditorialContent } from '../services/homeEditorialService';
import type { HomeEditorialContent } from '../types/editorial';

type HomeEditorialState =
  | { status: 'loading'; content: null; error: null }
  | { status: 'ready'; content: HomeEditorialContent; error: null }
  | { status: 'error'; content: null; error: Error };

export function useHomeEditorialContent() {
  const [requestVersion, setRequestVersion] = useState(0);
  const [state, setState] = useState<HomeEditorialState>({
    status: 'loading',
    content: null,
    error: null,
  });

  useEffect(() => {
    let active = true;

    void getHomeEditorialContent()
      .then((content) => {
        if (active) setState({ status: 'ready', content, error: null });
      })
      .catch((error: unknown) => {
        if (!active) return;
        setState({
          status: 'error',
          content: null,
          error:
            error instanceof Error ? error : new Error('Home editorial content failed to load.'),
        });
      });

    return () => {
      active = false;
    };
  }, [requestVersion]);

  const retry = useCallback(() => {
    setState({ status: 'loading', content: null, error: null });
    setRequestVersion((version) => version + 1);
  }, []);

  return { ...state, retry };
}

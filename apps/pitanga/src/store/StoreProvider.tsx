'use client';

/**
 * Redux store provider component.
 * Wraps the app with Redux Provider and initializes epics.
 *
 * @author Luiz Gama
 */
import { ReactNode, useEffect, useRef } from 'react';
import { Provider } from 'react-redux';
import { initializeEpics, store, apiClient } from './store';

interface StoreProviderProps {
  children: ReactNode;
}

export function StoreProvider({ children }: StoreProviderProps) {
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initializeEpics();
      initialized.current = true;
    }
  }, []);

  return <Provider store={store}>{children}</Provider>;
}

// Re-export API client for use outside Redux
export { apiClient };

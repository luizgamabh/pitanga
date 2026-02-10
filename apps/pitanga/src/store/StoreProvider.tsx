'use client';

/**
 * Redux store provider component.
 *
 * @author Luiz Gama
 */
import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { store, apiClient } from './store';

interface StoreProviderProps {
  children: ReactNode;
}

export function StoreProvider({ children }: StoreProviderProps) {
  return <Provider store={store}>{children}</Provider>;
}

// Re-export API client for use outside Redux
export { apiClient };

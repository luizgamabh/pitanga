'use client';

/**
 * Redux store provider component.
 * Wraps the app with Redux Provider and initializes epics.
 *
 * @author Luiz Gama
 */
import { ReactNode, useEffect, useRef } from 'react';
import { Provider } from 'react-redux';
import { initializeEpics, store } from './store';
import { ApiClient } from '@pitanga/api-client';
import { EpicDependencies } from './types';

interface StoreProviderProps {
  children: ReactNode;
}

// Create API client instance
const apiClient = new ApiClient({
  baseUrl: process.env['NEXT_PUBLIC_API_URL'] || 'http://localhost:3333/api',
});

export function StoreProvider({ children }: StoreProviderProps) {
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      // Create dependencies for epics
      const dependencies: EpicDependencies = {
        api: {
          auth: {
            login: (email: string, password: string) =>
              apiClient.auth.login({ email, password }),
            register: (email: string, password: string, name?: string) =>
              apiClient.auth.register({ email, password, name }),
            logout: () => apiClient.auth.logout(),
            getSession: () => apiClient.auth.getSession(),
            getProfile: () => apiClient.auth.getProfile(),
            refreshToken: () => apiClient.auth.refreshToken(),
          },
        },
      };

      // Initialize epics with dependencies
      initializeEpics(dependencies);
      initialized.current = true;
    }
  }, []);

  return <Provider store={store}>{children}</Provider>;
}

// Export API client for use outside Redux (e.g., in components that need direct access)
export { apiClient };

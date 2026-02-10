/**
 * Redux store configuration with redux-observable middleware.
 *
 * @author Luiz Gama
 */
import { configureStore, type Action } from '@reduxjs/toolkit';
import { createEpicMiddleware } from 'redux-observable';
import { ApiClient } from '@pitanga/api-client';
import { authReducer } from './slices';
import { rootEpic } from './epics';
import { EpicDependencies } from './types';

// Create API client instance
export const apiClient = new ApiClient({
  baseUrl: process.env['NEXT_PUBLIC_API_URL'] || 'http://localhost:3333/api',
});

// Create epic dependencies
const epicDependencies: EpicDependencies = {
  api: {
    auth: {
      login: (email: string, password: string) =>
        apiClient.auth.login({ email, password }),
      register: (email: string, password: string, name?: string) =>
        apiClient.auth.register({ email, password, name }),
      logout: () => apiClient.auth.logout(),
      getSession: () => apiClient.auth.getSession(),
      getProfile: () => apiClient.auth.getProfile(),
      refreshToken: () => apiClient.auth.refreshTokens(),
    },
  },
};

// Create epic middleware with dependencies
const epicMiddleware = createEpicMiddleware<
  Action,
  Action,
  unknown,
  EpicDependencies
>({
  dependencies: epicDependencies,
});

// Configure store
export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: false, // We use epics instead of thunks
      serializableCheck: {
        // Ignore these action types for serializable check
        ignoredActions: ['auth/login', 'auth/register'],
      },
    }).concat(epicMiddleware),
  devTools: process.env.NODE_ENV !== 'production',
});

// Function to initialize epics (run after store is ready)
export const initializeEpics = () => {
  epicMiddleware.run(rootEpic as never);
};

// Export store types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

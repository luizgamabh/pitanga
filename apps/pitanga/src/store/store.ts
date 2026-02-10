/**
 * Redux store configuration with redux-observable middleware.
 *
 * @author Luiz Gama
 */
import { configureStore } from '@reduxjs/toolkit';
import { createEpicMiddleware } from 'redux-observable';
import { authReducer } from './slices';
import { rootEpic } from './epics';
import { EpicDependencies } from './types';

// Create epic middleware with dependencies placeholder
const epicMiddleware = createEpicMiddleware<
  ReturnType<typeof store.dispatch>,
  ReturnType<typeof store.dispatch>,
  ReturnType<typeof store.getState>,
  EpicDependencies
>();

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

// Function to initialize epics with dependencies
export const initializeEpics = (dependencies: EpicDependencies) => {
  epicMiddleware.run(rootEpic as never);
  // Store dependencies for later use
  (store as unknown as { dependencies: EpicDependencies }).dependencies =
    dependencies;
};

// Export store types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

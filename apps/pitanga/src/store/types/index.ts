/**
 * Redux store type definitions.
 *
 * @author Luiz Gama
 */
import { Action } from '@reduxjs/toolkit';
import { Observable } from 'rxjs';
import { store } from '../store';

// Root state type
export type RootState = ReturnType<typeof store.getState>;

// App dispatch type
export type AppDispatch = typeof store.dispatch;

// Epic type for redux-observable
export type AppEpic = (
  action$: Observable<Action>,
  state$: Observable<RootState>,
  dependencies: EpicDependencies,
) => Observable<Action>;

// Dependencies injected into epics
export interface EpicDependencies {
  api: {
    auth: {
      login: (email: string, password: string) => Promise<unknown>;
      register: (
        email: string,
        password: string,
        name?: string,
      ) => Promise<unknown>;
      logout: () => Promise<unknown>;
      getSession: () => Promise<unknown>;
      getProfile: () => Promise<unknown>;
      refreshToken: () => Promise<unknown>;
    };
  };
}

// Async operation status
export type AsyncStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

// Generic async state wrapper
export interface AsyncState<T> {
  data: T | null;
  status: AsyncStatus;
  error: string | null;
}

/**
 * Auth selectors for accessing auth state.
 *
 * @author Luiz Gama
 */
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

// Base selector
const selectAuthState = (state: RootState) => state.auth;

// Individual selectors
export const selectUser = createSelector(selectAuthState, (auth) => auth.user);

export const selectProfile = createSelector(
  selectAuthState,
  (auth) => auth.profile
);

export const selectIsAuthenticated = createSelector(
  selectAuthState,
  (auth) => auth.isAuthenticated
);

export const selectAuthStatus = createSelector(
  selectAuthState,
  (auth) => auth.status
);

export const selectAuthError = createSelector(
  selectAuthState,
  (auth) => auth.error
);

export const selectIsLoading = createSelector(
  selectAuthState,
  (auth) => auth.status === 'loading'
);

export const selectAccessToken = createSelector(
  selectAuthState,
  (auth) => auth.accessToken
);

export const selectTwoFactorRequired = createSelector(
  selectAuthState,
  (auth) => auth.twoFactorRequired
);

export const selectTwoFactorToken = createSelector(
  selectAuthState,
  (auth) => auth.twoFactorToken
);

// Composite selectors
export const selectAuthInfo = createSelector(selectAuthState, (auth) => ({
  user: auth.user,
  profile: auth.profile,
  isAuthenticated: auth.isAuthenticated,
  isLoading: auth.status === 'loading',
  error: auth.error,
}));

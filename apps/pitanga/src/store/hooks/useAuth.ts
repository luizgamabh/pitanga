'use client';

/**
 * Auth hook using Redux store.
 * Drop-in replacement for the old context-based useAuth.
 *
 * @author Luiz Gama
 */
import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { authActions } from '../slices';
import {
  selectAuthError,
  selectIsAuthenticated,
  selectIsLoading,
  selectProfile,
  selectTwoFactorRequired,
  selectTwoFactorToken,
  selectUser,
} from '../selectors';
import { apiClient } from '../store';

export function useAuth() {
  const dispatch = useAppDispatch();

  // Selectors
  const user = useAppSelector(selectUser);
  const profile = useAppSelector(selectProfile);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectIsLoading);
  const error = useAppSelector(selectAuthError);
  const twoFactorRequired = useAppSelector(selectTwoFactorRequired);
  const twoFactorToken = useAppSelector(selectTwoFactorToken);

  // Initialize auth on mount
  useEffect(() => {
    dispatch(authActions.initAuth());
  }, [dispatch]);

  // Login function
  const login = useCallback(
    async (email: string, password: string) => {
      dispatch(authActions.login({ email, password }));
    },
    [dispatch],
  );

  // Register function
  const register = useCallback(
    async (email: string, password: string, name?: string) => {
      dispatch(authActions.register({ email, password, name }));
    },
    [dispatch],
  );

  // Logout function
  const logout = useCallback(async () => {
    dispatch(authActions.logout());
  }, [dispatch]);

  // Refresh profile
  const refreshProfile = useCallback(async () => {
    dispatch(authActions.loadProfile());
  }, [dispatch]);

  // Clear error
  const clearError = useCallback(() => {
    dispatch(authActions.clearError());
  }, [dispatch]);

  return {
    // State
    user,
    profile,
    isAuthenticated,
    isLoading,
    error,
    twoFactorRequired,
    twoFactorToken,

    // Actions
    login,
    register,
    logout,
    refreshProfile,
    clearError,

    // API client for direct access when needed
    api: apiClient,
  };
}

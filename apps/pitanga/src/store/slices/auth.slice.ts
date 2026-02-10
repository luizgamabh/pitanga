/**
 * Auth slice for Redux store.
 * Manages authentication state with redux-observable.
 *
 * @author Luiz Gama
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IAuthUser, IUserProfile } from '@pitanga/auth-types';
import { AsyncStatus } from '../types';

// Auth state interface
export interface AuthState {
  user: IAuthUser | null;
  profile: IUserProfile | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  status: AsyncStatus;
  error: string | null;
  twoFactorRequired: boolean;
  twoFactorToken: string | null;
}

// Initial state
const initialState: AuthState = {
  user: null,
  profile: null,
  accessToken: null,
  isAuthenticated: false,
  status: 'loading',
  error: null,
  twoFactorRequired: false,
  twoFactorToken: null,
};

// Login payload
export interface LoginPayload {
  email: string;
  password: string;
}

// Register payload
export interface RegisterPayload {
  email: string;
  password: string;
  name?: string;
}

// Login success payload
export interface LoginSuccessPayload {
  user: IAuthUser;
  accessToken: string;
}

// Two-factor required payload
export interface TwoFactorRequiredPayload {
  twoFactorToken: string;
}

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Initialize auth - check session (only show loading on first check)
    initAuth: (state) => {
      if (!state.isAuthenticated) {
        state.status = 'loading';
      }
      state.error = null;
    },

    // Login actions
    login: (state, _action: PayloadAction<LoginPayload>) => {
      state.status = 'loading';
      state.error = null;
      state.twoFactorRequired = false;
      state.twoFactorToken = null;
    },

    loginSuccess: (state, action: PayloadAction<LoginSuccessPayload>) => {
      state.status = 'succeeded';
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
      state.error = null;
      state.twoFactorRequired = false;
      state.twoFactorToken = null;
    },

    loginTwoFactorRequired: (
      state,
      action: PayloadAction<TwoFactorRequiredPayload>,
    ) => {
      state.status = 'idle';
      state.twoFactorRequired = true;
      state.twoFactorToken = action.payload.twoFactorToken;
      state.error = null;
    },

    loginFailure: (state, action: PayloadAction<string>) => {
      state.status = 'failed';
      state.error = action.payload;
      state.isAuthenticated = false;
    },

    // Register actions
    register: (state, _action: PayloadAction<RegisterPayload>) => {
      state.status = 'loading';
      state.error = null;
    },

    registerSuccess: (state, action: PayloadAction<LoginSuccessPayload>) => {
      state.status = 'succeeded';
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
      state.error = null;
    },

    registerFailure: (state, action: PayloadAction<string>) => {
      state.status = 'failed';
      state.error = action.payload;
    },

    // Logout actions
    logout: (state) => {
      state.status = 'loading';
    },

    logoutSuccess: () => {
      return { ...initialState, status: 'idle' as const };
    },

    logoutFailure: (state, action: PayloadAction<string>) => {
      // Even on failure, clear local state
      return {
        ...initialState,
        status: 'failed' as const,
        error: action.payload,
      };
    },

    // Session actions
    sessionLoaded: (state, action: PayloadAction<IAuthUser>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.status = 'succeeded';
      state.error = null;
    },

    sessionExpired: (state) => {
      state.user = null;
      state.profile = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.status = 'idle';
    },

    noSession: (state) => {
      state.status = 'idle';
      state.isAuthenticated = false;
    },

    // Profile actions
    loadProfile: (state) => {
      // Profile loading doesn't change main status
      state.error = null;
    },

    profileLoaded: (state, action: PayloadAction<IUserProfile>) => {
      state.profile = action.payload;
    },

    profileLoadFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },

    // Token management
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Reset to initial state
    reset: () => initialState,
  },
});

// Export actions
export const authActions = authSlice.actions;

// Export reducer
export default authSlice.reducer;

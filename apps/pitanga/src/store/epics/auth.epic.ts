/**
 * Auth epics for redux-observable.
 * Handles async auth operations using RxJS.
 *
 * @author Luiz Gama
 */
import { Action } from '@reduxjs/toolkit';
import { from, Observable, of } from 'rxjs';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { authActions } from '../slices/auth.slice';
import { EpicDependencies, RootState } from '../types';
import {
  IAuthResponse,
  IAuthUser,
  ILoginResponse,
  IUserProfile,
} from '@pitanga/auth-types';

type Epic = (
  action$: Observable<Action>,
  state$: Observable<RootState>,
  dependencies: EpicDependencies,
) => Observable<Action>;

/**
 * Initialize auth - check for existing session
 */
export const initAuthEpic: Epic = (action$, _state$, { api }) =>
  action$.pipe(
    filter(authActions.initAuth.match),
    switchMap(() =>
      from(api.auth.getSession() as Promise<IAuthUser>).pipe(
        switchMap((user) =>
          from(api.auth.getProfile() as Promise<IUserProfile>).pipe(
            map((profile) => {
              // Dispatch both session and profile loaded
              return authActions.profileLoaded(profile);
            }),
            tap(() => {
              // This will be handled by the next action in the stream
            }),
          ),
        ),
        map((action) => action),
        catchError(() => of(authActions.noSession())),
      ),
    ),
  );

/**
 * Handle session loaded - also load profile
 */
export const sessionLoadedEpic: Epic = (action$, _state$, { api }) =>
  action$.pipe(
    filter(authActions.sessionLoaded.match),
    switchMap(() =>
      from(api.auth.getProfile() as Promise<IUserProfile>).pipe(
        map((profile) => authActions.profileLoaded(profile)),
        catchError((error) =>
          of(
            authActions.profileLoadFailure(
              error?.message || 'Failed to load profile',
            ),
          ),
        ),
      ),
    ),
  );

/**
 * Login epic - handles login with email/password
 */
export const loginEpic: Epic = (action$, _state$, { api }) =>
  action$.pipe(
    filter(authActions.login.match),
    switchMap((action) =>
      from(
        api.auth.login(
          action.payload.email,
          action.payload.password,
        ) as Promise<ILoginResponse>,
      ).pipe(
        map((response) => {
          if (response.requiresTwoFactor && response.twoFactorToken) {
            return authActions.loginTwoFactorRequired({
              twoFactorToken: response.twoFactorToken,
            });
          }
          return authActions.loginSuccess({
            user: response.user!,
            accessToken: response.accessToken!,
          });
        }),
        catchError((error) =>
          of(authActions.loginFailure(error?.message || 'Login failed')),
        ),
      ),
    ),
  );

/**
 * Register epic - handles user registration
 */
export const registerEpic: Epic = (action$, _state$, { api }) =>
  action$.pipe(
    filter(authActions.register.match),
    switchMap((action) =>
      from(
        api.auth.register(
          action.payload.email,
          action.payload.password,
          action.payload.name,
        ) as Promise<IAuthResponse>,
      ).pipe(
        map((response) =>
          authActions.registerSuccess({
            user: response.user,
            accessToken: response.accessToken,
          }),
        ),
        catchError((error) =>
          of(
            authActions.registerFailure(
              error?.message || 'Registration failed',
            ),
          ),
        ),
      ),
    ),
  );

/**
 * Logout epic - handles user logout
 */
export const logoutEpic: Epic = (action$, _state$, { api }) =>
  action$.pipe(
    filter(authActions.logout.match),
    switchMap(() =>
      from(api.auth.logout()).pipe(
        map(() => authActions.logoutSuccess()),
        catchError((error) =>
          of(authActions.logoutFailure(error?.message || 'Logout failed')),
        ),
      ),
    ),
  );

/**
 * Load profile epic
 */
export const loadProfileEpic: Epic = (action$, _state$, { api }) =>
  action$.pipe(
    filter(authActions.loadProfile.match),
    switchMap(() =>
      from(api.auth.getProfile() as Promise<IUserProfile>).pipe(
        map((profile) => authActions.profileLoaded(profile)),
        catchError((error) =>
          of(
            authActions.profileLoadFailure(
              error?.message || 'Failed to load profile',
            ),
          ),
        ),
      ),
    ),
  );

// Export all auth epics
export const authEpics = [
  initAuthEpic,
  sessionLoadedEpic,
  loginEpic,
  registerEpic,
  logoutEpic,
  loadProfileEpic,
];

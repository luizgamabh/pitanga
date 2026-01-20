/**
 * Root epic combining all application epics.
 *
 * @author Luiz Gama
 */
import { combineEpics } from 'redux-observable';
import { authEpics } from './auth.epic';

// Combine all epics
export const rootEpic = combineEpics(...authEpics);

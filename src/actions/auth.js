import { routeActions } from 'redux-simple-router';

import * as api from '../api';
import { Actions } from '../constants';
import { createAction } from './utils';
import * as alerts from './alerts';

export const loginRequired = redirectTo => createAction(Actions.LOGIN_REQUIRED, redirectTo);
export const setCurrentUser = user => createAction(Actions.CURRENT_USER, user);

export function logout() {
  return dispatch => {
    api.logout();
    dispatch(createAction(Actions.LOGOUT));
    dispatch(routeActions.push('/'));
  };
}

export function openRecoverPasswordForm() {
  return createAction(Actions.OPEN_RECOVER_PASSWORD_FORM);
}

export function closeRecoverPasswordForm() {
  return createAction(Actions.CLOSE_RECOVER_PASSWORD_FORM);
}

export function recoverPasswordComplete() {
  return dispatch => {
    dispatch(closeRecoverPasswordForm());
    dispatch(createAction(Actions.RECOVER_PASSWORD_SUCCESS));
    dispatch(alerts.success('Please check your email inbox to recover your password'));
  };
}

export function unauthorized() {
  return dispatch => {
    dispatch(createAction(Actions.SESSION_TIMEOUT));
    dispatch(alerts.warning('You must be logged in to continue'));
    dispatch(routeActions.push('/login/'));
  };
}

export function loginComplete(loginInfo) {
  return (dispatch, getState) => {
    const { auth } = getState();
    const nextPath = auth.redirectTo || '/dashboard/';
    dispatch(createAction(Actions.LOGIN_SUCCESS, loginInfo));
    dispatch(routeActions.push(nextPath));
    dispatch(alerts.success(`Welcome back, ${loginInfo.name}`));
  };
}

export function signupComplete(signupInfo) {
  return dispatch => {
    dispatch(createAction(Actions.SIGNUP_SUCCESS, signupInfo));
    dispatch(alerts.success(`Welcome, ${signupInfo.name}`));
    dispatch(routeActions.push('/dashboard/'));
  };
}

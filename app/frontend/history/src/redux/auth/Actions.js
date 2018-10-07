import {
  SIGNIN_REQUEST,
  SIGNIN_SUCCESS,
  SIGNIN_FAILURE,
  SIGNIN_RESET,
  SIGNOUT_REQUEST,
  AUTO_LOGIN
} from "./actionTypes";

export const trySignin = (email, password) => ({
  type: SIGNIN_REQUEST,
  payload: {
    email,
    password
  }
});
export const signinSuccess = res => ({
  type: SIGNIN_SUCCESS,
  payload: res
});
export const signinFailure = errorData => ({
  type: SIGNIN_FAILURE,
  payload: errorData
});
export const signinReset = () => ({
  type: SIGNIN_RESET
});

export const autoLogin = (user, token) => ({
  type: AUTO_LOGIN,
  payload: {
    user,
    token
  }
});

export const signout = () => ({
  type: SIGNOUT_REQUEST
});

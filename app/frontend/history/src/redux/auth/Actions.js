import {
  SIGNIN_REQUEST,
  SIGNIN_SUCCESS,
  SIGNIN_FAILURE,
  SIGNIN_RESET,
  SIGNUP_REQUEST,
  SIGNUP_SUCCESS,
  SIGNUP_FAILURE,
  SIGNUP_RESET,
  SIGNOUT_REQUEST,
  AUTO_LOGIN
} from "./actionTypes";

export const trySignin = (identity, password) => ({
  type: SIGNIN_REQUEST,
  payload: {
    identity,
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

export const trySignup = (username, email, password, password_confirmation, full_name) => ({
  type: SIGNUP_REQUEST,
  payload: {
    username,
    email,
    password,
    password_confirmation,
    full_name
  }
});
export const signupSuccess = res => ({
  type: SIGNUP_SUCCESS,
  payload: res
});
export const signupFailure = errorData => ({
  type: SIGNUP_FAILURE,
  payload: errorData
});
export const signupReset = () => ({
  type: SIGNUP_RESET
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

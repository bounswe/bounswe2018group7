import {
  SIGNIN_REQUEST,
  SIGNIN_SUCCESS,
  SIGNIN_FAILURE,
  SIGNIN_RESET,
  SIGNOUT_REQUEST,
  SIGNUP_REQUEST,
  SIGNUP_SUCCESS,
  SIGNUP_FAILURE,
  SIGNUP_RESET,
  AUTO_LOGIN
} from "./actionTypes";

const initialState = {
  user: {},
  token: "",

  loggedIn: false,

  signinInProgress: false,
  signinHasError: false,
  signinCompleted: false,
  signinError: "",

  signupInProgress: false,
  signupHasError: false,
  signupCompleted: false,
  signupError: ""
};

export default function(state = initialState, action) {
  const { payload } = action;
  if (action.type === SIGNIN_REQUEST) {
    return {
      ...state,
      signinInProgress: true,
      signinHasError: false,
      signinCompleted: false
    };
  } else if (action.type === SIGNIN_SUCCESS) {
    return {
      ...state,
      user: payload.user,
      token: payload.auth_token,
      loggedIn: true,
      signinInProgress: false,
      signinHasError: false,
      signinCompleted: true
    };
  } else if (action.type === SIGNIN_FAILURE) {
    return {
      ...state,
      signinInProgress: false,
      signinHasError: true,
      signinCompleted: true,
      signinError: payload.detail[0]
    };
  } else if (action.type === SIGNIN_RESET) {
    return {
      ...state,
      signinInProgress: false,
      signinHasError: false,
      signinCompleted: false
    };
  }
  if (action.type === SIGNUP_REQUEST) {
    return {
      ...state,
      signupInProgress: true,
      signupHasError: false,
      signupCompleted: false
    };
  } else if (action.type === SIGNUP_SUCCESS) {
    return {
      ...state,
      user: payload.user,
      token: payload.auth_token,
      loggedIn: true,
      signupInProgress: false,
      signupHasError: false,
      signupCompleted: true
    };
  } else if (action.type === SIGNUP_FAILURE) {
    return {
      ...state,
      signupInProgress: false,
      signupHasError: true,
      signupCompleted: true,
      signupError: payload.detail[0]
    };
  } else if (action.type === SIGNUP_RESET) {
    return {
      ...state,
      signupInProgress: false,
      signupHasError: false,
      signupCompleted: false
    };
  } else if (action.type === AUTO_LOGIN) {
    const { user, token } = payload;
    return {
      ...state,
      user,
      token,
      loggedIn: true
    };
  } else if (action.type === SIGNOUT_REQUEST) {
    return {
      ...state,
      user: {},
      token: "",

      loggedIn: false,

      signinInProgress: false,
      signinHasError: false,
      signinCompleted: false,
      signinError: ""
    };
  }

  return state;
}

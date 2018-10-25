import { call, put, takeLatest } from "redux-saga/effects";

import { SIGNIN_REQUEST, SIGNUP_REQUEST } from "../auth/actionTypes";
import { signinSuccess, signinFailure, signupFailure, signupSuccess } from "../auth/Actions";

import api from "./api";
import { clError, clWarning } from "utils/consolelog.js";

const trySignInSaga = function*(action) {
  const { email, password } = action.payload;

  try {
    const signinResponse = yield call(api.doSignIn, email, password);

    if (signinResponse) {
      console.log("​signinResponse", signinResponse);

      if (signinResponse.status === 200) {
        yield put(signinSuccess(signinResponse.responseBody));
      } else if (signinResponse.status === 400) {
        clError("Something wrong! Got a status 400", signinResponse.responseBody);
        yield put(signinFailure(signinResponse.responseBody));
      } else {
        clError("Something wrong! Got an unknown status. API BOZUK!!!", signinResponse);
        yield put(signinFailure({ detail: ["Unknown status. Check console!"] }));
      }
    } else {
      clError("SignIn failed by api. No response !");
      yield put(signinFailure({ detail: ["No response fetched. Please contact the API team!"] }));
    }
  } catch (err) {
    clWarning("SignIn failed by api. Error => ", err);
    yield put(signinFailure({ detail: [err.detail] }));
  }
};

const trySignUpSaga = function*(action) {
  const { username, email, password, password_confirmation, full_name } = action.payload;

  try {
    const signupResponse = yield call(api.doSignUp, username, email, password, password_confirmation, full_name);

    if (signupResponse) {
      console.log("​signupResponse", signupResponse);

      if (signupResponse.status === 200) {
        yield put(signupSuccess(signupResponse.responseBody));
      } else if (signupResponse.status === 400) {
        clError("Something wrong! Got a status 400", signupResponse.responseBody);
        yield put(signupFailure(signupResponse.responseBody));
      } else {
        clError("Something wrong! Got an unknown status. API BOZUK!!!", signupResponse);
        yield put(signupFailure({ detail: ["Unknown status. Check console!"] }));
      }
    } else {
      clError("SignIn failed by api. No response !");
      yield put(signupFailure({ detail: ["No response fetched. Please contact the API team!"] }));
    }
  } catch (err) {
    clWarning("SignIn failed by api. Error => ", err);
    yield put(signupFailure({ detail: [err.detail] }));
  }
};

const saga = function*() {
  //AUTH
  yield takeLatest(SIGNIN_REQUEST, trySignInSaga);
  yield takeLatest(SIGNUP_REQUEST, trySignUpSaga);
};

export default saga;

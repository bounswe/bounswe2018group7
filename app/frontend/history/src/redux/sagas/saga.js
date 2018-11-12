import { call, put, takeLatest } from "redux-saga/effects";

import { SIGNIN_REQUEST, SIGNUP_REQUEST, EMAIL_REQUEST } from "../auth/actionTypes";
import {
  signinSuccess,
  signinFailure,
  signupFailure,
  signupSuccess,
  verifyEmailSuccess,
  verifyEmailFailure
} from "../auth/Actions";

import api from "./api";
import { clError, clWarning } from "utils/consolelog.js";
import { createPostFailure, createPostSuccess, createPost } from "../post/Actions";
import { CREATE_POST_REQUEST } from "../post/actionTypes";

const trySignInSaga = function*(action) {
  const { identity, password } = action.payload;

  try {
    const signinResponse = yield call(api.doSignIn, identity, password);

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

const tryVerifyEmailSaga = function*(action) {
  const { token } = action.payload;

  try {
    const verifyEmailResponse = yield call(api.doVerifyIn, token);

    if (verifyEmailResponse) {
      console.log("​signinResponse", verifyEmailResponse);

      if (verifyEmailResponse.status === 200) {
        yield put(verifyEmailSuccess(verifyEmailResponse.responseBody));
      } else if (verifyEmailResponse.status === 400) {
        clError("Something wrong! Got a status 400", verifyEmailResponse.responseBody);
        yield put(verifyEmailFailure(verifyEmailResponse.responseBody));
      } else {
        clError("Something wrong! Got an unknown status. API BOZUK!!!", verifyEmailResponse);
        yield put(verifyEmailFailure({ detail: ["Unknown status. Check console!"] }));
      }
    } else {
      clError("SignIn failed by api. No response !");
      yield put(verifyEmailFailure({ detail: ["No response fetched. Please contact the API team!"] }));
    }
  } catch (err) {
    clWarning("SignIn failed by api. Error => ", err);
    yield put(verifyEmailFailure({ detail: [err.detail] }));
  }
};

const trySignUpSaga = function*(action) {
  const { username, email, password, password_confirmation, first_name, last_name } = action.payload;

  try {
    const signupResponse = yield call(
      api.doSignUp,
      username,
      email,
      password,
      password_confirmation,
      first_name,
      last_name
    );

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

const tryCreatePostSaga = function*(action) {
  const { title, time, location, stories } = action.payload;
  console.log("​------------------------------");
  console.log("​action.payload", action.payload);
  console.log("​------------------------------");

  try {
    const createPostResponse = yield call(api.createPost, title, time, location, stories);

    if (createPostResponse) {
      console.log("createPostResponse", createPostResponse);

      if (createPostResponse.status === 200) {
        yield put(createPostSuccess());
      } else if (createPostResponse.status === 201) {
        yield put(createPostSuccess());
      } else if (createPostResponse.status === 400) {
        clError("Something wrong! Got a status 400", createPostResponse.responseBody);
        yield put(createPostFailure(createPostResponse.responseBody));
      } else if (createPostResponse.status === 401) {
        clError("Unauthorized request!");
        yield put(createPostFailure({ detail: ["Unauthorized request!"] }));
      } else {
        clError("Something wrong! Got an unknown status. API BOZUK!!!", createPostResponse);
        yield put(createPostFailure({ detail: ["Unknown status. Check console!"] }));
      }
    } else {
      clError("Creating Post failed by api. No response !");
      yield put(createPostFailure({ detail: ["No response fetched. Please contact the API team"] }));
    }
  } catch (err) {
    clWarning("Creating Post failed by api. Error => ", err);
    yield put(createPostFailure({ detail: [err.detail] }));
  }
};

const saga = function*() {
  //AUTH
  yield takeLatest(SIGNIN_REQUEST, trySignInSaga);
  yield takeLatest(SIGNUP_REQUEST, trySignUpSaga);
  yield takeLatest(EMAIL_REQUEST, tryVerifyEmailSaga);
  yield takeLatest(CREATE_POST_REQUEST, tryCreatePostSaga);
};

export default saga;

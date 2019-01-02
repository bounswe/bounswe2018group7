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
import {
  createPostFailure,
  createPostSuccess,
  fetchPostSuccess,
  fetchPostFailure,
  createCommentFailure,
  createCommentSuccess,
  createAnnotateSuccess,
  createAnnotateFailure,
  fetchAnnotateSuccess,
  fetchAnnotateFailure
} from "../post/Actions";
import {
  CREATE_POST_REQUEST,
  FETCH_POST_REQUEST,
  CREATE_COMMENT_REQUEST,
  CREATE_ANNOTATE_REQUEST,
  FETCH_ANNOTATE_REQUEST
} from "../post/actionTypes";

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
      } else if (signinResponse.status === 401) {
        clError("Something wrong! Got a status 401", signinResponse.responseBody);
        yield put(signinFailure(signinResponse.responseBody));
      } else {
        clError("Something wrong! Got an unknown status. API BOZUK!!!", signinResponse);
        yield put(signinFailure({ errors: ["Unknown status. Check console!"] }));
      }
    } else {
      clError("SignIn failed by api. No response !");
      yield put(signinFailure({ errors: ["No response fetched. Please contact the API team!"] }));
    }
  } catch (err) {
    clWarning("SignIn failed by api. Error => ", err);
    yield put(signinFailure({ errors: [err.detail] }));
  }
};

const tryCreateCommentSaga = function*(action) {
  const { memory_post, content } = action.payload;
  try {
    const commentResponse = yield call(api.doComment, memory_post, content);

    if (commentResponse) {
      console.log("​--------------------------------");
      console.log("​commentResponse", commentResponse);
      console.log("​--------------------------------");
      if (commentResponse.status === 200) {
        yield put(createCommentSuccess(commentResponse.responseBody));
      } else if (commentResponse.status === 400) {
        clError("Something wrong! Got a status 400", commentResponse.responseBody);
        yield put(createCommentFailure(commentResponse.responseBody));
      } else if (commentResponse.status === 401) {
        clError("Something wrong! Got a status 401", commentResponse.responseBody);
        yield put(createCommentFailure(commentResponse.responseBody));
      } else {
        clError("Something wrong! Got an unknown status. API BOZUK!!!", commentResponse);
        yield put(createCommentFailure({ errors: ["Unknown status. Check console!"] }));
      }
    } else {
      clError("SignIn failed by api. No response !");
      yield put(createCommentFailure({ errors: ["No response fetched. Please contact the API team!"] }));
    }
  } catch (err) {
    clWarning("SignIn failed by api. Error => ", err);
    yield put(signinFailure({ errors: [err.detail] }));
  }
};

const tryCreateAnnotateSaga = function*(action) {
  const { body, target } = action.payload;
  try {
    const annotateResponse = yield call(api.doAnnotate, body, target);

    if (annotateResponse) {
      console.log("​--------------------------------");
      console.log("​annotateResponse", annotateResponse);
      console.log("​--------------------------------");
      if (annotateResponse.status === 200) {
        yield put(createAnnotateSuccess(annotateResponse.responseBody));
      } else if (annotateResponse.status === 400) {
        clError("Something wrong! Got a status 400", annotateResponse.responseBody);
        yield put(createAnnotateFailure(annotateResponse.responseBody));
      } else if (annotateResponse.status === 401) {
        clError("Something wrong! Got a status 401", annotateResponse.responseBody);
        yield put(createAnnotateFailure(annotateResponse.responseBody));
      } else {
        clError("Something wrong! Got an unknown status. API BOZUK!!!", annotateResponse);
        yield put(createAnnotateFailure({ errors: ["Unknown status. Check console!"] }));
      }
    } else {
      clError("SignIn failed by api. No response !");
      yield put(createAnnotateFailure({ errors: ["No response fetched. Please contact the API team!"] }));
    }
  } catch (err) {
    clWarning("SignIn failed by api. Error => ", err);
    yield put(signinFailure({ errors: [err.detail] }));
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

const tryFetchPostSaga = function*() {
  try {
    const fetchPostResponse = yield call(api.fetchPost);

    if (fetchPostResponse) {
      console.log("fetchPostResponse", fetchPostResponse);

      if (fetchPostResponse.status === 200) {
        yield put(fetchPostSuccess(fetchPostResponse.responseBody));
      } else if (fetchPostResponse.status === 400) {
        clError("Something wrong! Got a status 400", fetchPostResponse.responseBody);
        yield put(fetchPostFailure(fetchPostResponse.responseBody));
      } else if (fetchPostResponse.status === 401) {
        clError("Unauthorized request!");
        yield put(fetchPostFailure({ errors: ["Unauthorized request!"] }));
      } else {
        clError("Something wrong! Got an unknown status. API BOZUK!!!", fetchPostResponse.responseBody);
        yield put(fetchPostFailure({ errors: ["Unknown status. Check console!"] }));
      }
    } else {
      clError("Deleting contact failed by api. No response !");
      yield put(fetchPostFailure({ errors: ["No response fetched. Please contact the API team"] }));
    }
  } catch (err) {
    clWarning("Deleting contact failed by api. Error => ", err);
    yield put(fetchPostFailure({ errors: [err.detail] }));
  }
};

const tryFetchAnnotateSaga = function*() {
  try {
    const fetchAnnotateResponse = yield call(api.fetchAnnotate);

    if (fetchAnnotateResponse) {
      console.log("fetchAnnotateResponse", fetchAnnotateResponse);

      if (fetchAnnotateResponse.status === 200) {
        yield put(fetchAnnotateSuccess(fetchAnnotateResponse.responseBody));
      } else if (fetchAnnotateResponse.status === 400) {
        clError("Something wrong! Got a status 400", fetchAnnotateResponse.responseBody);
        yield put(fetchAnnotateFailure(fetchAnnotateResponse.responseBody));
      } else if (fetchAnnotateResponse.status === 401) {
        clError("Unauthorized request!");
        yield put(fetchAnnotateFailure({ errors: ["Unauthorized request!"] }));
      } else {
        clError("Something wrong! Got an unknown status. API BOZUK!!!", fetchAnnotateResponse.responseBody);
        yield put(fetchAnnotateFailure({ errors: ["Unknown status. Check console!"] }));
      }
    } else {
      clError("Deleting contact failed by api. No response !");
      yield put(fetchAnnotateFailure({ errors: ["No response fetched. Please contact the API team"] }));
    }
  } catch (err) {
    clWarning("Deleting contact failed by api. Error => ", err);
    yield put(fetchAnnotateFailure({ errors: [err.detail] }));
  }
};

const tryCreatePostSaga = function*(action) {
  const { title, time, location, stories, tags } = action.payload;
  console.log("​----------");
  console.log("​tags", tags);
  console.log("​----------");

  try {
    const createPostResponse = yield call(api.createPost, title, time, location, stories, tags);

    if (createPostResponse) {
      console.log("createPostResponse", createPostResponse);

      if (createPostResponse.status === 200) {
        yield put(createPostSuccess());
      } else if (createPostResponse.status === 201) {
        yield put(createPostSuccess());
      } else if (createPostResponse.status === 400) {
        clError("Something wrong! Got a status 400", createPostResponse);
        yield put(createPostFailure(createPostResponse));
      } else if (createPostResponse.status === 401) {
        clError("Unauthorized request!");
        yield put(createPostFailure({ errors: ["Unauthorized request!"] }));
      } else {
        clError("Something wrong! Got an unknown status. API BOZUK!!!", createPostResponse);
        yield put(createPostFailure({ errors: ["Unknown status. Check console!"] }));
      }
    } else {
      clError("Creating Post failed by api. No response !");
      yield put(createPostFailure({ errors: ["No response fetched. Please contact the API team"] }));
    }
  } catch (err) {
    clWarning("Creating Post failed by api. Error => ", err);
    yield put(createPostFailure({ errors: [err.detail] }));
  }
};

const saga = function*() {
  //AUTH
  yield takeLatest(SIGNIN_REQUEST, trySignInSaga);
  yield takeLatest(SIGNUP_REQUEST, trySignUpSaga);
  yield takeLatest(EMAIL_REQUEST, tryVerifyEmailSaga);
  yield takeLatest(CREATE_POST_REQUEST, tryCreatePostSaga);
  yield takeLatest(FETCH_POST_REQUEST, tryFetchPostSaga);
  yield takeLatest(FETCH_ANNOTATE_REQUEST, tryFetchAnnotateSaga);
  yield takeLatest(CREATE_ANNOTATE_REQUEST, tryCreateAnnotateSaga);
  yield takeLatest(CREATE_COMMENT_REQUEST, tryCreateCommentSaga);
};

export default saga;

import { call, put, takeLatest } from "redux-saga/effects";

import { SIGNIN_REQUEST } from "../auth/actionTypes";
import { signinSuccess, signinFailure } from "../auth/Actions";

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

const saga = function*() {
  //AUTH
  yield takeLatest(SIGNIN_REQUEST, trySignInSaga);
};

export default saga;

import { CREATE_POST_FAILURE, CREATE_POST_REQUEST, CREATE_POST_RESET, CREATE_POST_SUCCESS } from "./actionTypes";

const initialState = {
  createPostInProgress: false,
  createPostHasError: false,
  createPostCompleted: false,
  createPostError: ""
};

export default function(state = initialState, action) {
  const { payload } = action;
  if (action.type === CREATE_POST_REQUEST) {
    return {
      ...state,
      createPostInProgress: true,
      createPostHasError: false,
      createPostCompleted: false
    };
  } else if (action.type === CREATE_POST_SUCCESS) {
    return {
      ...state,
      createPostInProgress: false,
      createPostHasError: false,
      createPostCompleted: true,
      estateList: payload
    };
  } else if (action.type === CREATE_POST_FAILURE) {
    return {
      ...state,
      createPostInProgress: false,
      createPostHasError: true,
      createPostCompleted: true,
      createPostError: payload.detail || "There is an error"
    };
  } else if (action.type === CREATE_POST_RESET) {
    return {
      ...state,
      createPostInProgress: false,
      createPostHasError: false,
      createPostCompleted: false
    };
  }
  return state;
}

import { CREATE_POST_FAILURE, CREATE_POST_REQUEST, CREATE_POST_RESET, CREATE_POST_SUCCESS } from "./actionTypes";
import { FETCH_POST_REQUEST, FETCH_POST_SUCCESS, FETCH_POST_FAILURE, FETCH_POST_RESET } from "./actionTypes";
import {
  CREATE_COMMENT_REQUEST,
  CREATE_COMMENT_SUCCESS,
  CREATE_COMMENT_FAILURE,
  CREATE_COMMENT_RESET
} from "./actionTypes";
const initialState = {
  createPostInProgress: false,
  createPostHasError: false,
  createPostCompleted: false,
  createPostError: "",

  fetchPostInProgress: false,
  fetchPostHasError: false,
  fetchPostCompleted: false,
  fetchPostError: "",

  postList: [],

  createCommentInProgress: false,
  createCommentHasError: false,
  createCommentCompleted: false,
  createCommentError: ""
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
      createPostCompleted: true
    };
  } else if (action.type === CREATE_POST_FAILURE) {
    return {
      ...state,
      createPostInProgress: false,
      createPostHasError: true,
      createPostCompleted: true,
      createPostError: payload.errors || "There is an error"
    };
  } else if (action.type === CREATE_POST_RESET) {
    return {
      ...state,
      createPostInProgress: false,
      createPostHasError: false,
      createPostCompleted: false
    };
  } else if (action.type === CREATE_COMMENT_REQUEST) {
    return {
      ...state,
      createCommentInProgress: true,
      createCommentHasError: false,
      createCommentCompleted: false
    };
  } else if (action.type === CREATE_COMMENT_SUCCESS) {
    return {
      ...state,
      createCommentInProgress: false,
      createCommentHasError: false,
      createCommentCompleted: true
    };
  } else if (action.type === CREATE_COMMENT_FAILURE) {
    return {
      ...state,
      createCommentInProgress: false,
      createCommentHasError: true,
      createCommentCompleted: true,
      createCommentError: payload.errors || "There is an error"
    };
  } else if (action.type === CREATE_COMMENT_RESET) {
    return {
      ...state,
      createCommentInProgress: false,
      createCommentHasError: false,
      createCommentCompleted: false
    };
  } else if (action.type === FETCH_POST_REQUEST) {
    return {
      ...state,
      fetchPostInProgress: true,
      fetchPostHasError: false,
      fetchPostCompleted: false
    };
  } else if (action.type === FETCH_POST_SUCCESS) {
    return {
      ...state,
      fetchPostInProgress: false,
      fetchPostHasError: false,
      fetchPostCompleted: true,
      postList: payload
    };
  } else if (action.type === FETCH_POST_FAILURE) {
    return {
      ...state,
      fetchPostInProgress: false,
      fetchPostHasError: true,
      fetchPostCompleted: true,
      fetchPostError: payload.errors || "There is an error"
    };
  } else if (action.type === FETCH_POST_RESET) {
    return {
      ...state,
      fetchPostInProgress: false,
      fetchPostHasError: false,
      fetchPostCompleted: false
    };
  }
  return state;
}

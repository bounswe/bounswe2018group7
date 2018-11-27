import { FETCH_POST_REQUEST, FETCH_POST_SUCCESS, FETCH_POST_FAILURE, FETCH_POST_RESET } from "./actionTypes";
import { CREATE_POST_REQUEST, CREATE_POST_SUCCESS, CREATE_POST_FAILURE, CREATE_POST_RESET } from "./actionTypes";

export const fetchPost = () => ({
  type: FETCH_POST_REQUEST
});
export const fetchPostSuccess = res => ({
  type: FETCH_POST_SUCCESS,
  payload: res
});
export const fetchPostFailure = res => ({
  type: FETCH_POST_FAILURE,
  payload: res
});
export const fetchPostReset = () => ({
  type: FETCH_POST_RESET
});

export const createPost = (title, time, location, stories, tags) => ({
  type: CREATE_POST_REQUEST,
  payload: {
    title,
    time,
    location,
    stories,
    tags
  }
});
export const createPostSuccess = res => ({
  type: CREATE_POST_SUCCESS,
  payload: res
});
export const createPostFailure = res => ({
  type: CREATE_POST_FAILURE,
  payload: res
});
export const createPostReset = () => ({
  type: CREATE_POST_RESET
});

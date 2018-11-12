import { CREATE_POST_REQUEST, CREATE_POST_SUCCESS, CREATE_POST_FAILURE, CREATE_POST_RESET } from "./actionTypes";

export const createPost = (details, photos) => ({
  type: CREATE_POST_REQUEST,
  payload: {
    details,
    photos
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

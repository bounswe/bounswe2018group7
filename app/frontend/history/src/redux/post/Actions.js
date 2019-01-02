import {
  FETCH_POST_REQUEST,
  FETCH_POST_SUCCESS,
  FETCH_POST_FAILURE,
  FETCH_POST_RESET,
  FETCH_ANNOTATE_REQUEST,
  FETCH_ANNOTATE_FAILURE,
  FETCH_ANNOTATE_RESET,
  FETCH_ANNOTATE_SUCCESS
} from "./actionTypes";
import {
  CREATE_POST_REQUEST,
  CREATE_POST_SUCCESS,
  CREATE_POST_FAILURE,
  CREATE_POST_RESET,
  CREATE_ANNOTATE_REQUEST,
  CREATE_ANNOTATE_RESET,
  CREATE_ANNOTATE_FAILURE,
  CREATE_ANNOTATE_SUCCESS
} from "./actionTypes";
import {
  CREATE_COMMENT_REQUEST,
  CREATE_COMMENT_SUCCESS,
  CREATE_COMMENT_FAILURE,
  CREATE_COMMENT_RESET,
  PUSH_LAST_COMMENT_REQUEST
} from "./actionTypes";

export const pushLastComment = (id, memory_post, username, content, created) => ({
  type: PUSH_LAST_COMMENT_REQUEST,
  payload: {
    id,
    memory_post,
    username,
    content,
    created
  }
});

export const createAnnotate = (body, target) => ({
  type: CREATE_ANNOTATE_REQUEST,
  payload: {
    body,
    target
  }
});

export const createAnnotateSuccess = res => ({
  type: CREATE_ANNOTATE_SUCCESS,
  payload: res
});
export const createAnnotateFailure = res => ({
  type: CREATE_ANNOTATE_FAILURE,
  payload: res
});
export const createAnnotateReset = () => ({
  type: CREATE_ANNOTATE_RESET
});

export const createComment = (memory_post, content) => ({
  type: CREATE_COMMENT_REQUEST,
  payload: {
    memory_post,
    content
  }
});

export const createCommentSuccess = res => ({
  type: CREATE_COMMENT_SUCCESS,
  payload: res
});
export const createCommentFailure = res => ({
  type: CREATE_COMMENT_FAILURE,
  payload: res
});
export const createCommentReset = () => ({
  type: CREATE_COMMENT_RESET
});

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

export const fetchAnnotate = () => ({
  type: FETCH_ANNOTATE_REQUEST
});
export const fetchAnnotateSuccess = res => ({
  type: FETCH_ANNOTATE_SUCCESS,
  payload: res
});
export const fetchAnnotateFailure = res => ({
  type: FETCH_ANNOTATE_FAILURE,
  payload: res
});
export const fetchAnnotateReset = () => ({
  type: FETCH_ANNOTATE_RESET
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

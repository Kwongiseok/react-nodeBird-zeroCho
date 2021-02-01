/* eslint-disable max-len */
import {
  all,
  fork,
  put,
  takeLatest,
  delay,
  throttle,
  call,
} from "redux-saga/effects";
import axios from "axios";
import {
  ADD_POST_SUCCESS,
  ADD_POST_REQUEST,
  ADD_POST_FAILURE,
  ADD_COMMENT_REQUEST,
  ADD_COMMENT_FAILURE,
  ADD_COMMENT_SUCCESS,
  REMOVE_POST_SUCCESS,
  REMOVE_POST_REQUEST,
  REMOVE_POST_FAILURE,
  LOAD_POSTS_REQUEST,
  LOAD_POSTS_SUCCESS,
  LOAD_POSTS_FAILURE,
  LIKE_POST_REQUEST,
  UNLIKE_POST_REQUEST,
  LIKE_POST_SUCCESS,
  LIKE_POST_FAILURE,
  UNLIKE_POST_SUCCESS,
  UNLIKE_POST_FAILURE,
} from "../reducers/post";
import { ADD_POST_TO_ME, REMOVE_POST_OF_ME } from "../reducers/user";

function likePostAPI(data) {
  return axios.patch(`/post/${data}/like`); // 실제 서버에 요청을 보낸다.
}
function* likePost(action) {
  try {
    const result = yield call(likePostAPI, action.data);
    yield put({
      // put은 dispatch 기능이라 볼 수 있다.
      type: LIKE_POST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      // 비동기 액션 createor , 이벤트 리스너처럼 역할.
      type: LIKE_POST_FAILURE,
      data: err.response.data,
    });
  }
}
function unlikePostAPI(data) {
  return axios.delete(`/post/${data}/like`); // 실제 서버에 요청을 보낸다.
}
function* unlikePost(action) {
  try {
    const result = yield call(unlikePostAPI, action.data);
    yield put({
      // put은 dispatch 기능이라 볼 수 있다.
      type: UNLIKE_POST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      // 비동기 액션 createor , 이벤트 리스너처럼 역할.
      type: UNLIKE_POST_FAILURE,
      data: err.response.data,
    });
  }
}

function loadPostsAPI(data) {
  return axios.get("/posts", data); // 실제 서버에 요청을 보낸다.
}
function* loadPosts(action) {
  try {
    const result = yield call(loadPostsAPI, action.data);
    yield put({
      // put은 dispatch 기능이라 볼 수 있다.
      type: LOAD_POSTS_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      // 비동기 액션 createor , 이벤트 리스너처럼 역할.
      type: LOAD_POSTS_FAILURE,
      data: err.response.data,
    });
  }
}

function addPostAPI(data) {
  return axios.post("/post", { content: data }); // 실제 서버에 요청을 보낸다.
}
function* addPost(action) {
  try {
    const result = yield call(addPostAPI, action.data);
    yield put({
      // put은 dispatch 기능이라 볼 수 있다.
      type: ADD_POST_SUCCESS,
      data: result.data,
    });
    yield put({
      type: ADD_POST_TO_ME,
      data: result.data.id,
    });
  } catch (err) {
    yield put({
      // 비동기 액션 createor , 이벤트 리스너처럼 역할.
      type: ADD_POST_FAILURE,
      data: err.response.data,
    });
  }
}
function removePostAPI(data) {
  return axios.post("/api/post", data); // 실제 서버에 요청을 보낸다.
}

function* removePost(action) {
  try {
    // const result = yield call(addPostAPI, action.data);
    yield delay(1000);
    yield put({
      // post reducer 조작 부분
      // put은 dispatch 기능이라 볼 수 있다.
      type: REMOVE_POST_SUCCESS,
      data: action.data,
    });
    yield put({
      // user reducer 조작 부분
      type: REMOVE_POST_OF_ME,
      data: action.data,
    });
  } catch (err) {
    yield put({
      // 비동기 액션 createor , 이벤트 리스너처럼 역할.
      type: REMOVE_POST_FAILURE,
      data: err.response.data,
    });
  }
}
function addCommentAPI(data) {
  return axios.post(`/post/${data.postId}/comment`, data); // 실제 서버에 요청을 보낸다.
}

function* addComment(action) {
  try {
    const result = yield call(addCommentAPI, action.data);
    yield put({
      // put은 dispatch 기능이라 볼 수 있다.
      type: ADD_COMMENT_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.log(err);
    yield put({
      // 비동기 액션 createor , 이벤트 리스너처럼 역할.
      type: ADD_COMMENT_FAILURE,
      data: err.response.data,
    });
  }
}

function* watchLikePost() {
  yield takeLatest(LIKE_POST_REQUEST, likePost);
}

function* watchUnlikePost() {
  yield takeLatest(UNLIKE_POST_REQUEST, unlikePost);
}

function* watchLoadPosts() {
  yield throttle(5000, LOAD_POSTS_REQUEST, loadPosts);
}
function* watchAddPost() {
  yield takeLatest(ADD_POST_REQUEST, addPost);
}
function* watchRemovePost() {
  yield takeLatest(REMOVE_POST_REQUEST, removePost);
}
function* watchAddComment() {
  yield takeLatest(ADD_COMMENT_REQUEST, addComment);
}
export default function* postSaga() {
  yield all([
    fork(watchLikePost),
    fork(watchUnlikePost),
    fork(watchLoadPosts),
    fork(watchAddPost),
    fork(watchRemovePost),
    fork(watchAddComment),
  ]);
}

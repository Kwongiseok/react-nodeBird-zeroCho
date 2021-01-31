import { all, delay, fork, put, takeLatest, call } from "redux-saga/effects";
import axios from "axios";
import {
  LOG_IN_SUCCESS,
  LOG_IN_REQUEST,
  LOG_IN_FAILURE,
  LOG_OUT_SUCCESS,
  LOG_OUT_REQUEST,
  LOG_OUT_FAILURE,
  SIGN_UP_SUCCESS,
  SIGN_UP_REQUEST,
  SIGN_UP_FAILURE,
  FOLLOW_REQUEST,
  UNFOLLOW_REQUEST,
  FOLLOW_FAILURE,
  FOLLOW_SUCCESS,
  UNFOLLOW_SUCCESS,
  UNFOLLOW_FAILURE,
  LOAD_MY_INFO_REQUEST,
  LOAD_MY_INFO_FAILURE,
  LOAD_MY_INFO_SUCCESS,
} from "../reducers/user";
function loadUserAPI() {
  return axios.get("/user"); // 실제 서버에 요청을 보낸다.
}

function* loadUser() {
  // 아래 take를 통해 loadUser 이 실행되면 액션 자체가 매개변수로 실행이 된다
  try {
    const result = yield call(loadUserAPI);
    yield put({
      // put은 dispatch 기능이라 볼 수 있다.
      type: LOAD_MY_INFO_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.log(err);
    yield put({
      // 비동기 액션 createor , 이벤트 리스너처럼 역할.
      type: LOAD_MY_INFO_FAILURE,
      error: err.response.data,
    });
  }
}

function followAPI(data) {
  return axios.post("/follow", data); // 실제 서버에 요청을 보낸다.
}

function* follow(action) {
  // 아래 take를 통해 logIn 이 실행되면 액션 자체가 매개변수로 실행이 된다
  try {
    // const result = yield call(logInAPI, action.data);
    yield delay(1000);
    yield put({
      // put은 dispatch 기능이라 볼 수 있다.
      type: FOLLOW_SUCCESS,
      data: action.data, // post.User.id 를 넘겨받았다.
    });
  } catch (err) {
    yield put({
      // 비동기 액션 createor , 이벤트 리스너처럼 역할.
      type: FOLLOW_FAILURE,
      error: err.response.data,
    });
  }
}
function unfollowAPI(data) {
  return axios.post("/unfollow", data); // 실제 서버에 요청을 보낸다.
}

function* unfollow(action) {
  // 아래 take를 통해 logIn 이 실행되면 액션 자체가 매개변수로 실행이 된다
  try {
    // const result = yield call(logInAPI, action.data);
    yield delay(1000);
    yield put({
      // put은 dispatch 기능이라 볼 수 있다.
      type: UNFOLLOW_SUCCESS,
      data: action.data, // post.User.id 를 넘겨받았다.
    });
  } catch (err) {
    yield put({
      // 비동기 액션 createor , 이벤트 리스너처럼 역할.
      type: UNFOLLOW_FAILURE,
      error: err.response.data,
    });
  }
}

function logInAPI(data) {
  return axios.post("/user/login", data); // 실제 서버에 요청을 보낸다.
}

function* logIn(action) {
  // 아래 take를 통해 logIn 이 실행되면 액션 자체가 매개변수로 실행이 된다
  try {
    const result = yield call(logInAPI, action.data);
    yield put({
      // put은 dispatch 기능이라 볼 수 있다.
      type: LOG_IN_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.log(err);
    yield put({
      // 비동기 액션 createor , 이벤트 리스너처럼 역할.
      type: LOG_IN_FAILURE,
      error: err.response.data,
    });
  }
}
function logOutAPI() {
  return axios.post("/user/logout"); // 실제 서버에 요청을 보낸다.
}

function* logOut() {
  try {
    yield call(logOutAPI);
    yield put({
      // put은 dispatch 기능이라 볼 수 있다.
      type: LOG_OUT_SUCCESS,
      //   data: result.data,
    });
  } catch (err) {
    yield put({
      // 비동기 액션 createor , 이벤트 리스너처럼 역할.
      type: LOG_OUT_FAILURE,
      error: err.response.data,
    });
  }
}

function signUpAPI(data) {
  return axios.post("/user", data);
}

function* signUp(action) {
  try {
    const result = yield call(signUpAPI, action.data);
    console.log(result);
    yield put({
      type: SIGN_UP_SUCCESS,
    });
  } catch (err) {
    yield put({
      type: SIGN_UP_FAILURE,
      error: err.response.data,
    });
  }
}
function* watchLoadUser() {
  yield takeLatest(LOAD_MY_INFO_REQUEST, loadUser);
}
function* watchFollow() {
  yield takeLatest(FOLLOW_REQUEST, follow);
}
function* watchUnfollow() {
  yield takeLatest(UNFOLLOW_REQUEST, unfollow);
}
function* watchLogIn() {
  //   yield take("LOG_IN_REQUEST", logIn); // take LOG_IN -> LOG_IN 이라는 액션이 실행될 때까지 기다리겠다.
  // 액션이 실행되면 logIn 이라는 함수를 실행하겠다.
  // yield take의 치명적인 단점 -> 1회용 (한번 LOG_IN_REQUEST 하면 logIn 실행된다) 딱 한번만 받는다
  // 로그아웃했다가 다시 로그인하려했는데 이벤트 리스너가 사라져있다...
  // 이를 해결할 수 있는 방법 : while -> takeEvery , takeLatest
  //   while (true) {
  //     yield take("LOG_IN_REQUEST", logIn);
  //   }
  //   yield takeEvery("LOG_IN_REQUEST", logIn);
  yield takeLatest(LOG_IN_REQUEST, logIn);
  // 실수로 두번이상 클릭될 때 가장 마지막 것만 실행
}
function* watchLogOut() {
  yield takeLatest(LOG_OUT_REQUEST, logOut);
}
function* watchSignUp() {
  yield takeLatest(SIGN_UP_REQUEST, signUp);
}
export default function* userSaga() {
  yield all([
    fork(watchLoadUser),
    fork(watchFollow), //
    fork(watchUnfollow),
    fork(watchLogIn),
    fork(watchLogOut),
    fork(watchSignUp),
  ]);
}

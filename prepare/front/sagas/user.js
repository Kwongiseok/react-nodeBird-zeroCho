import { all, fork, takeLatest, delay, put } from "redux-saga/effects";
import axios from "axios";

function logInAPI(data) {
  return axios.post("/api/login", data); // 실제 서버에 요청을 보낸다.
}

function* logIn(action) {
  // 아래 take를 통해 logIn 이 실행되면 액션 자체가 매개변수로 실행이 된다
  try {
    console.log("saga login");
    // const result = yield call(logInAPI, action.data);
    yield delay(1000);
    yield put({
      // put은 dispatch 기능이라 볼 수 있다.
      type: "LOG_IN_SUCCESS",
      data: action.data,
    });
  } catch (err) {
    yield put({
      // 비동기 액션 createor , 이벤트 리스너처럼 역할.
      type: "LOG_IN_FAILURE",
      data: err.response.data,
    });
  }
}
function logOutAPI() {
  return axios.post("/api/logout"); // 실제 서버에 요청을 보낸다.
}

function* logOut() {
  try {
    // const result = yield call(logOutAPI);
    yield delay(1000);

    yield put({
      // put은 dispatch 기능이라 볼 수 있다.
      type: "LOG_OUT_SUCCESS",
      //   data: result.data,
    });
  } catch (err) {
    yield put({
      // 비동기 액션 createor , 이벤트 리스너처럼 역할.
      type: "LOG_OUT_FAILURE",
      data: err.response.data,
    });
  }
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
  yield takeLatest("LOG_IN_REQUEST", logIn); // 실수로 두번이상 클릭될 때 가장 마지막 것만 실행
}
function* watchLogOut() {
  yield takeLatest("LOG_OUT_REQUEST", logOut);
}
export default function* userSaga() {
  yield all([fork(watchLogIn), fork(watchLogOut)]);
}

import { all, fork } from "redux-saga/effects";
import axios from "axios";

import postSaga from "./post";
import userSaga from "./user";

axios.defaults.baseURL = "http://localhost:3060"; // baseURL 을 설정
axios.defaults.withCredentials = true;

export default function* rootSaga() {
  // generator
  yield all([fork(postSaga), fork(userSaga)]); // all 배열을 받는다 한방에 모두 실행 (동시에)
  // fork는 함수를 실행하는 것 , fork 대신에 call을 할 수 있다.
  // fork와 call의 차이를 인지하고 있어야한다.
  // -> 차이 call은 동기 함수 호출, fork 비동기 함수 호출
  // -> 그러므로 call은 결과가 나올 때까지 기다린다.
}

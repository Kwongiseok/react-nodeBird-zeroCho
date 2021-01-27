import { all, fork, put, takeLatest, delay } from "redux-saga/effects";

function addPostAPI(data) {
  return axios.post("/api/post", data); // 실제 서버에 요청을 보낸다.
}

function* addPost(action) {
  try {
    // const result = yield call(addPostAPI, action.data);
    yield delay(1000);

    yield put({
      // put은 dispatch 기능이라 볼 수 있다.
      type: "ADD_POST_SUCCESS",
      //   data: result.data,
    });
  } catch (err) {
    yield put({
      // 비동기 액션 createor , 이벤트 리스너처럼 역할.
      type: "ADD_POST_FAILURE",
      data: err.response.data,
    });
  }
}
function* watchAddPost() {
  yield takeLatest("ADD_POST_REQUEST", addPost);
}
export default function* postSaga() {
  yield all([fork(watchAddPost)]);
}

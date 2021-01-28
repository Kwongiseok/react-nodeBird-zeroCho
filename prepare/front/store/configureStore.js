import React from "react";
import { createWrapper } from "next-redux-wrapper";
import { applyMiddleware, compose, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import reducer from "../reducers";
import rootSaga from "../sagas";
import createSagaMiddleware from "redux-saga";
const configureStore = (props) => {
  console.log(props);
  const sagaMiddleware = createSagaMiddleware();
  const middlewares = [sagaMiddleware];
  const enhancer =
    process.env.NODE_ENV === "production"
      ? compose(applyMiddleware(...middlewares))
      : composeWithDevTools(applyMiddleware(...middlewares)); // 배포용일 때만 devtool연결 (redux history 남기기 위해)
  const store = createStore(reducer, enhancer); // store => state와 reducer를 포함하는 것으로 볼 수 있다.
  store.sagaTask = sagaMiddleware.run(rootSaga);
  return store;
};
const wrapper = createWrapper(configureStore, {
  debug: process.env.NODE_ENV === "development",
});
export default wrapper;

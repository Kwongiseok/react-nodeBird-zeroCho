import React from "react";
import { createWrapper } from "next-redux-wrapper";
import { createStore } from "redux";
const configureStore = (props) => {
  const store = createStore(reducer);
  return store;
};
const wrapper = createWrapper(configureStore, {
  debug: process.env.NODE_ENV === "development",
});
export default wrapper;
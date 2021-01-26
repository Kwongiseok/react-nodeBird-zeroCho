import { HYDRATE } from "next-redux-wrapper";
import { combineReducers } from "redux";
import user from "./user";
import post from "./post";

// async action creator

// (이전상태, 액션) => 다음 상태
const rootReducer = combineReducers({
  index: (state = {}, action) => {
    switch (action.type) {
      case HYDRATE:
        return { ...state, ...action.payload };
      default:
        // 해주지 않으면 reducer 초기화할 때 실행되는데 리턴 값이 undefined가 된다.
        return state;
    }
  },
  user,
  post,
});

export default rootReducer;

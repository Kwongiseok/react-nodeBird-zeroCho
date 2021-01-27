export const initialState = {
  isLoggingIn: false, // 로그인 시도중
  isLoggedIn: false,
  isLoggingOut: false, // 로그아웃 시도중
  me: null,
  signUpData: {},
  loginData: {},
};

export const loginRequestAction = (data) => {
  console.log("login reducer");
  return {
    type: "LOG_IN_REQUEST",
    data,
  };
};

export const logoutRequestAction = () => {
  return {
    type: "LOG_OUT_REQUEST",
  };
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOG_IN_REQUEST":
      return {
        ...state,
        isLoggingIn: true,
      };
    case "LOG_IN_SUCCESS":
      return {
        ...state.user,
        isLoggingIn: false,
        isLoggedIn: true,
        me: { ...action.data, nickname: "giseok" },
      };
    case "LOG_IN_FAILURE":
      return {
        ...state.user,
        isLoggingIn: false,
        isLoggedIn: false,
        me: action.data,
      };
    case "LOG_OUT_REQUEST":
      return {
        ...state.user,
        isLoggingOut: true,
        me: null,
      };
    case "LOG_OUT_SUCCESS":
      return {
        ...state,
        isLoggingOut: false,
        isLoggedIn: false,
        me: null,
      };
    case "LOG_OUT_FAILRURE":
      return {
        ...state,
        isLoggingOut: false,
        me: null,
      };
    default:
      return state;
  }
};

export default reducer;

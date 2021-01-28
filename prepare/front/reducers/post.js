export const initialState = {
  mainPosts: [
    {
      id: 1,
      User: {
        id: 1,
        nickname: "기석",
      },
      content: "첫 번째 게시글 #해시태그 #익스프레스",
      Images: [
        {
          src:
            "https://res.cloudinary.com/dsb0lexgl/image/upload/v1611502978/vfk4sfsa470omkepjgmo.png",
        },
        {
          src:
            "https://res.cloudinary.com/dsb0lexgl/image/upload/v1609911324/samples/imagecon-group.jpg",
        },
        {
          src:
            "https://res.cloudinary.com/dsb0lexgl/image/upload/v1611502978/vfk4sfsa470omkepjgmo.png",
        },
      ],
      Comments: [
        {
          User: {
            nickname: "Giseok",
          },
          content: "너무어려워요,,,",
        },
        {
          User: {
            nickname: "기석",
          },
          content: "어떡하죠,,",
        },
      ],
    },
  ],
  imagePaths: [],
  addPostLoading: false,
  addPostDone: false,
  addPostError: null,

  addCommentLoading: false,
  addCommentDone: false,
  addCommentError: null,
};
export const ADD_POST_REQUEST = "ADD_POST_REQUEST";
export const ADD_POST_SUCCESS = "ADD_POST_SUCCESS";
export const ADD_POST_FAILURE = "ADD_POST_FAILURE";

export const ADD_COMMENT_REQUEST = "ADD_COMMENT_REQUEST";
export const ADD_COMMENT_SUCCESS = "ADD_COMMENT_SUCCESS";
export const ADD_COMMENT_FAILURE = "ADD_COMMENT_FAILURE";

export const addPost = (data) => {
  type: ADD_POST_REQUEST, data;
};
export const addComment = (data) => {
  type: ADD_COMMENT_REQUEST, data;
};

const dummyPost = {
  id: 2,
  content: "더미데이터입니다.",
  User: {
    id: 1,
    nickname: "Giseok",
  },
  Images: [],
  Comments: [],
};
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_POST_REQUEST: //변수로 지정해주면 오타가 날 확률이 줄어드므로 상수로 만드는 것도 좋다.
      return {
        ...state,
        addPostLoading: true,
        addPostDone: false,
        addPostError: null,
      };
    case ADD_POST_SUCCESS:
      return {
        ...state,
        mainPosts: [dummyPost, ...state.mainPosts], // 앞에 추가해야 게시글 위에 올라간다!
        addPostLoading: false,
        addPostDone: true,
      };
    case ADD_POST_FAILURE:
      return {
        ...state,
        addPostLoading: false,
        addPostError: action.error,
      };
    case ADD_COMMENT_REQUEST: //변수로 지정해주면 오타가 날 확률이 줄어드므로 상수로 만드는 것도 좋다.
      return {
        ...state,
        addCommentLoading: true,
        addCommentDone: false,
        addCommentError: null,
      };
    case ADD_COMMENT_SUCCESS:
      return {
        ...state,
        addCommentLoading: false,
        addCommentDone: true,
      };
    case ADD_COMMENT_FAILURE:
      return {
        ...state,
        addCommentLoading: false,
        addCommentError: action.error,
      };
    default:
      return state;
  }
};

export default reducer;

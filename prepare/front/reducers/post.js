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
  postAdded: false,
};

const ADD_POST = "ADD_POST";
export const addPost = {
  type: ADD_POST,
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
    case ADD_POST: //변수로 지정해주면 오타가 날 확률이 줄어드므로 상수로 만드는 것도 좋다.
      return {
        ...state,
        mainPosts: [dummyPost, ...state.mainPosts], // 앞에 추가해야 게시글 위에 올라간다!
        postAdded: true,
      };
    default:
      return state;
  }
};

export default reducer;

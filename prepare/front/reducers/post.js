/* eslint-disable no-case-declarations */
import shortId from "shortid";
import produce from "immer";
import faker from "faker";

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
          id: shortId.generate(),
          src:
            "https://res.cloudinary.com/dsb0lexgl/image/upload/v1611502978/vfk4sfsa470omkepjgmo.png",
        },
        {
          id: shortId.generate(),
          src:
            "https://res.cloudinary.com/dsb0lexgl/image/upload/v1609911324/samples/imagecon-group.jpg",
        },
        {
          id: shortId.generate(),
          src:
            "https://res.cloudinary.com/dsb0lexgl/image/upload/v1611502978/vfk4sfsa470omkepjgmo.png",
        },
      ],
      Comments: [
        {
          id: shortId.generate(),
          User: {
            id: shortId.generate(),
            nickname: "Giseok",
          },
          content: "너무어려워요,,,",
        },
        {
          id: shortId.generate(),
          User: {
            id: shortId.generate(),
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
  removePostLoading: false,
  removePostDone: false,
  removePostError: null,

  addCommentLoading: false,
  addCommentDone: false,
  addCommentError: null,
};

initialState.mainPosts.concat(
  Array(20)
    .fill()
    .map(() => ({
      id: shortId.generate(),
      User: { id: shortId.generate(), nickname: faker.name.findName() },
      content: faker.lorem.paragraph,
      Images: [
        {
          src: faker.image.image,
        },
      ],
      Comments: [
        {
          User: {
            id: shortId.generate(),
            nickname: faker.name.findName(),
          },
          content: faker.lorem.sentence(),
        },
      ],
    }))
);

export const ADD_POST_REQUEST = "ADD_POST_REQUEST";
export const ADD_POST_SUCCESS = "ADD_POST_SUCCESS";
export const ADD_POST_FAILURE = "ADD_POST_FAILURE";

export const REMOVE_POST_REQUEST = "REMOVE_POST_REQUEST";
export const REMOVE_POST_SUCCESS = "REMOVE_POST_SUCCESS";
export const REMOVE_POST_FAILURE = "REMOVE_POST_FAILURE";

export const ADD_COMMENT_REQUEST = "ADD_COMMENT_REQUEST";
export const ADD_COMMENT_SUCCESS = "ADD_COMMENT_SUCCESS";
export const ADD_COMMENT_FAILURE = "ADD_COMMENT_FAILURE";

export const addPost = (data) => ({
  type: ADD_POST_REQUEST,
  data,
});
export const addComment = (data) => ({
  type: ADD_COMMENT_REQUEST,
  data,
});

const dummyPost = (data) => ({
  id: data.id,
  content: data.content,
  User: {
    id: 1,
    nickname: "Giseok",
  },
  Images: [],
  Comments: [],
});

const dummyComment = (data) => ({
  id: shortId.generate(),
  content: data,
  User: {
    id: 1,
    nickname: "giseork",
  },
});

// reducer -> 이전 상태를 액션을 통해 다음 상태로 만들어내는 함수 ( 불변성을 지키면서 )
// eslint-disable-next-line arrow-body-style
const reducer = (state = initialState, action) => {
  return produce(state, (draft) => {
    // immer 사용 -> 불변성을 지켜주는 역할을 한다.
    switch (action.type) {
      case ADD_POST_REQUEST: // 변수로 지정해주면 오타가 날 확률이 줄어드므로 상수로 만드는 것도 좋다.
        draft.addPostLoading = true; // state대신 draft 사용
        draft.addPostDone = false;
        draft.addPostError = null;
        break;
      case ADD_POST_SUCCESS:
        draft.addPostLoading = false;
        draft.addPostDone = true;
        draft.mainPosts.unshift(dummyPost(action.data));
        break;
      case ADD_POST_FAILURE:
        draft.addPostLoading = true;
        draft.addPostError = action.Error;
        break;

      case REMOVE_POST_REQUEST: // 변수로 지정해주면 오타가 날 확률이 줄어드므로 상수로 만드는 것도 좋다.
        draft.removePostLoading = true;
        draft.removePostDone = false;
        draft.removePostError = null;
        break;
      case REMOVE_POST_SUCCESS:
        draft.removePostLoading = false;
        draft.removePostDone = true;
        draft.mainPosts = draft.mainPosts.filter((v) => v.id !== action.data);
        break;
      case REMOVE_POST_FAILURE:
        draft.removePostLoading = false;
        draft.removePostError = action.error;
        break;
      case ADD_COMMENT_REQUEST: // 변수로 지정해주면 오타가 날 확률이 줄어드므로 상수로 만드는 것도 좋다.
        draft.addCommentLoading = true; // state대신 draft 사용
        draft.addCommentDone = false;
        draft.addCommentError = null;
        break;
      case ADD_COMMENT_SUCCESS:
        const post = draft.mainPosts.find((v) => v.id === action.data.postId);
        /* find를 통해 찾은 객체를 바로 바꿔주더라도 draft를 사용한 덕분에 불변성이 유지 되기 때문이다 */
        post.Comments.unshift(dummyComment(action.data.content)); // 아래의 코드를 immer를 사용해서 간결하게 작성가능하다
        draft.addCommentLoading = false;
        draft.addCommentDone = true;
        break;
      // const postIndex = state.mainPosts.findIndex(
      //   (v) => v.id === action.data.postId
      // );
      // const post = state.mainPosts[postIndex];
      // const Comments = [dummyComment(action.data), ...post.Comments];
      // const mainPosts = [...state.mainPosts];
      // mainPosts[postIndex] = { ...post, Comments };
      /* 불변성 , 참조를 통해 바뀌는 것만 메모리 새로쓰고 나머지는 메모리를 아끼는 코드로 짬 */
      // return {
      //   ...state,
      //   mainPosts,
      //   addCommentLoading: false,
      //   addCommentDone: true,
      // };
      case ADD_COMMENT_FAILURE:
        draft.addCommentLoading = false;
        draft.addCommentError = action.error;
        break;
      default:
        break;
    }
  });
};

export default reducer;

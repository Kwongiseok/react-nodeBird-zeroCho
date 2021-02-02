/* eslint-disable no-case-declarations */
import produce from "immer";

export const initialState = {
  mainPosts: [],
  imagePaths: [],
  hasMorePosts: true,
  likePostLoading: false,
  likePostDone: false,
  likePostError: null,
  unlikePostLoading: false,
  unlikePostDone: false,
  unlikePostError: null,
  loadPostsLoading: false,
  loadPostsDone: false,
  loadPostsError: null,
  addPostLoading: false,
  addPostDone: false,
  addPostError: null,
  removePostLoading: false,
  removePostDone: false,
  removePostError: null,
  addCommentLoading: false,
  addCommentDone: false,
  addCommentError: null,
  uploadImagesLoading: false,
  uploadImagesDone: false,
  uploadImagesError: null,
  retweetLoading: false,
  retweetDone: false,
  retweetError: null,
};

export const UPLOAD_IMAGES_REQUEST = "UPLOAD_IMAGES_REQUEST";
export const UPLOAD_IMAGES_SUCCESS = "UPLOAD_IMAGES_SUCCESS";
export const UPLOAD_IMAGES_FAILURE = "UPLOAD_IMAGES_FAILURE";

export const LIKE_POST_REQUEST = "LIKE_POST_REQUEST";
export const LIKE_POST_SUCCESS = "LIKE_POST_SUCCESS";
export const LIKE_POST_FAILURE = "LIKE_POST_FAILURE";

export const UNLIKE_POST_REQUEST = "UNLIKE_POST_REQUEST";
export const UNLIKE_POST_SUCCESS = "UNLIKE_POST_SUCCESS";
export const UNLIKE_POST_FAILURE = "UNLIKE_POST_FAILURE";

export const LOAD_POSTS_REQUEST = "LOAD_POSTS_REQUEST";
export const LOAD_POSTS_SUCCESS = "LOAD_POSTS_SUCCESS";
export const LOAD_POSTS_FAILURE = "LOAD_POSTS_FAILURE";

export const ADD_POST_REQUEST = "ADD_POST_REQUEST";
export const ADD_POST_SUCCESS = "ADD_POST_SUCCESS";
export const ADD_POST_FAILURE = "ADD_POST_FAILURE";

export const REMOVE_POST_REQUEST = "REMOVE_POST_REQUEST";
export const REMOVE_POST_SUCCESS = "REMOVE_POST_SUCCESS";
export const REMOVE_POST_FAILURE = "REMOVE_POST_FAILURE";

export const ADD_COMMENT_REQUEST = "ADD_COMMENT_REQUEST";
export const ADD_COMMENT_SUCCESS = "ADD_COMMENT_SUCCESS";
export const ADD_COMMENT_FAILURE = "ADD_COMMENT_FAILURE";

export const RETWEET_REQUEST = "RETWEET_REQUEST";
export const RETWEET_SUCCESS = "RETWEET_SUCCESS";
export const RETWEET_FAILURE = "RETWEET_FAILURE";

export const REMOVE_IMAGE = "REMOVE_IMAGE";

export const addPost = (data) => ({
  type: ADD_POST_REQUEST,
  data,
});
export const addComment = (data) => ({
  type: ADD_COMMENT_REQUEST,
  data,
});

// reducer -> 이전 상태를 액션을 통해 다음 상태로 만들어내는 함수 ( 불변성을 지키면서 )
// eslint-disable-next-line arrow-body-style
const reducer = (state = initialState, action) => {
  return produce(state, (draft) => {
    // immer 사용 -> 불변성을 지켜주는 역할을 한다.
    switch (action.type) {
      case RETWEET_REQUEST:
        draft.retweetLoading = true;
        draft.retweetDone = false;
        draft.retweetError = null;
        break;
      case RETWEET_SUCCESS: {
        draft.retweetLoading = false;
        draft.retweetDone = true;
        draft.mainPosts.unshift(action.data);
        break;
      }
      case RETWEET_FAILURE:
        draft.retweetLoading = false;
        draft.retweetError = action.error;
        break;
      case REMOVE_IMAGE:
        draft.imagePaths = draft.imagePaths.filter((v, i) => i !== action.data);
        break;
      case UPLOAD_IMAGES_REQUEST:
        draft.uploadImagesLoading = true;
        draft.uploadImagesDone = false;
        draft.uploadImagesError = null;
        break;
      case UPLOAD_IMAGES_SUCCESS: {
        draft.imagePaths = action.data;
        draft.uploadImagesLoading = false;
        draft.uploadImagesDone = true;
        break;
      }
      case UPLOAD_IMAGES_FAILURE:
        draft.uploadImagesLoading = false;
        draft.uploadImagesError = action.error;
        break;
      case UNLIKE_POST_REQUEST: // 변수로 지정해주면 오타가 날 확률이 줄어드므로 상수로 만드는 것도 좋다.
        draft.unlikePostsLoading = true; // state대신 draft 사용
        draft.unlikePostsDone = false;
        draft.unlikePostsError = null;
        break;
      case UNLIKE_POST_SUCCESS:
        const postUnlike = draft.mainPosts.find(
          (v) => v.id === action.data.PostId
        );
        postUnlike.Likers = postUnlike.Likers.filter(
          (v) => v.id !== action.data.UserId
        );
        draft.unlikePostsDone = true;
        break;
      case UNLIKE_POST_FAILURE:
        draft.unlikePostsLoading = false;
        draft.unlikePostsError = action.Error;
        break;

      case LIKE_POST_REQUEST: // 변수로 지정해주면 오타가 날 확률이 줄어드므로 상수로 만드는 것도 좋다.
        draft.likePostsLoading = true; // state대신 draft 사용
        draft.likePostsDone = false;
        draft.likePostsError = null;
        break;
      case LIKE_POST_SUCCESS:
        const postLike = draft.mainPosts.find(
          (v) => v.id === action.data.PostId
        );
        postLike.Likers.push({ id: action.data.UserId });
        draft.likePostsLoading = false;
        draft.likePostsDone = true;
        break;
      case LIKE_POST_FAILURE:
        draft.likePostsLoading = false;
        draft.likePostsError = action.Error;
        break;

      case LOAD_POSTS_REQUEST: // 변수로 지정해주면 오타가 날 확률이 줄어드므로 상수로 만드는 것도 좋다.
        draft.loadPostsLoading = true; // state대신 draft 사용
        draft.loadPostsDone = false;
        draft.loadPostsError = null;
        break;
      case LOAD_POSTS_SUCCESS:
        draft.loadPostsLoading = false;
        draft.loadPostsDone = true;
        draft.mainPosts = draft.mainPosts.concat(action.data); // 아래로 추가해서 이어붙여주는 구조
        draft.hasMorePosts = draft.mainPosts.length === 10;
        break;
      case LOAD_POSTS_FAILURE:
        draft.loadPostsLoading = false;
        draft.loadPostsError = action.Error;
        break;

      case ADD_POST_REQUEST: // 변수로 지정해주면 오타가 날 확률이 줄어드므로 상수로 만드는 것도 좋다.
        draft.addPostLoading = true; // state대신 draft 사용
        draft.addPostDone = false;
        draft.addPostError = null;
        break;
      case ADD_POST_SUCCESS:
        draft.addPostLoading = false;
        draft.addPostDone = true;
        draft.mainPosts.unshift(action.data);
        draft.imagePaths = [];
        break;
      case ADD_POST_FAILURE:
        draft.addPostLoading = false;
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
        draft.mainPosts = draft.mainPosts.filter(
          (v) => v.id !== action.data.PostId
        );
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
        const post = draft.mainPosts.find((v) => v.id === action.data.PostId);
        /* find를 통해 찾은 객체를 바로 바꿔주더라도 draft를 사용한 덕분에 불변성이 유지 되기 때문이다 */
        post.Comments.unshift(action.data); // 아래의 코드를 immer를 사용해서 간결하게 작성가능하다
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

/* eslint-disable max-len */
/* eslint-disable react/react-in-jsx-scope */

// Next 에서는 import react가 필요 없다!
// import React from 'react';
// Next가 'pages'폴더(무조건 pages이름) Next가 인식해서

import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { END } from "redux-saga";
import AppLayout from "../components/AppLayout";
import PostCard from "../components/PostCard";
import PostForm from "../components/PostForm";
import { LOAD_POSTS_REQUEST } from "../reducers/post";
import { LOAD_MY_INFO_REQUEST } from "../reducers/user";
import wrapper from "../store/configureStore";

// 모든 파일들을 코드 스플릿을 통해 개별적인 페이지(component)로 만들어준다.
const Home = () => {
  const { me } = useSelector((state) => state.user);
  const {
    mainPosts,
    hasMorePosts,
    loadPostsLoading,
    retweetError,
  } = useSelector((state) => state.post);

  const dispatch = useDispatch();
  useEffect(() => {
    if (retweetError) {
      alert(retweetError);
    }
  }, [retweetError]);

  useEffect(() => {
    function onScroll() {
      if (
        window.scrollY + document.documentElement.clientHeight >
        document.documentElement.scrollHeight - 300
      ) {
        if (hasMorePosts && !loadPostsLoading) {
          // 여러개의 request요청이 받아지는 것을 방지할 수 있다. (로딩 변수를 통해)
          const lastId = mainPosts[mainPosts.length - 1]?.id;
          dispatch({
            type: LOAD_POSTS_REQUEST,
            lastId,
          });
        }
      }
    }
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll); // 언마운트 될 때 해제해줘야한다. -> 그렇지 않으면 메모리에 계속 쌓여있는다.
    };
  }, [hasMorePosts, loadPostsLoading]);

  return (
    <AppLayout>
      {me && <PostForm />}
      {mainPosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </AppLayout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  // HYDRATE -> 서버사이드 렌더링이 완료됐을 때 실행되는 액션
  async (context) => {
    const cookie = context.req ? context.req.headers.cookie : "";
    // axios.defaults.headers.Cookie = cookie; // 다른 사람이 요청을 보냈을 때도, 내 정보로 로그인 되버리는 오류가 발생할 수 있다.
    axios.defaults.headers.Cookie = "";
    if (context.req && cookie) {
      axios.defaults.headers.Cookie = cookie;
    }
    // next에서 제공하는 wrapper로 만든 wrapper를 가져와 실행한다. -> 이 부분이 Home 보다 먼저 실행된다.
    context.store.dispatch({
      type: LOAD_MY_INFO_REQUEST,
    });
    context.store.dispatch({
      type: LOAD_POSTS_REQUEST,
    });
    context.store.dispatch(END);
    await context.store.sagaTask.toPromise();
  }
);

export default Home;

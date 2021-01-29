/* eslint-disable max-len */
/* eslint-disable react/react-in-jsx-scope */

// Next 에서는 import react가 필요 없다!
// import React from 'react';
// Next가 'pages'폴더(무조건 pages이름) Next가 인식해서

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AppLayout from "../components/AppLayout";
import PostCard from "../components/PostCard";
import PostForm from "../components/PostForm";
import { LOAD_POSTS_REQUEST } from "../reducers/post";

// 모든 파일들을 코드 스플릿을 통해 개별적인 페이지(component)로 만들어준다.
const Home = () => {
  const { me } = useSelector((state) => state.user);
  const { mainPosts, hasMorePosts, loadPostsLoading } = useSelector((state) => state.post);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({
      type: LOAD_POSTS_REQUEST,
    });
  }, []);

  useEffect(() => {
    function onScroll() {
      if (window.scrollY + document.documentElement.clientHeight > document.documentElement.scrollHeight - 300) {
        if (hasMorePosts && !loadPostsLoading) { // 여러개의 request요청이 받아지는 것을 방지할 수 있다. (로딩 변수를 통해)
          dispatch({
            type: LOAD_POSTS_REQUEST,
          });
        }
      }
    }
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll); // 언마운트 될 때 해제해줘야한다. -> 그렇지 않으면 메모리에 계속 쌓여있는다.
    };
  }, [hasMorePosts,loadPostsLoading]);

  return (
    <AppLayout>
      {me && <PostForm />}
      {mainPosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </AppLayout>
  );
};

export default Home;

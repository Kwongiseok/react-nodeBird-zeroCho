//Next 에서는 import react가 필요 없다!
// import React from 'react';
// Next가 'pages'폴더(무조건 pages이름) Next가 인식해서

import { useSelector } from "react-redux";
import AppLayout from "../components/AppLayout";
import PostCard from "../components/PostCard";
import PostForm from "../components/PostForm";

// 모든 파일들을 코드 스플릿을 통해 개별적인 페이지(component)로 만들어준다.
const Home = () => {
  const { isLoggedIn } = useSelector((state) => state.user);
  const { mainPosts } = useSelector((state) => state.post);
  return (
    <AppLayout>
      {isLoggedIn && <PostForm />}
      {mainPosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </AppLayout>
  );
};

export default Home;

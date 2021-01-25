//Next 에서는 import react가 필요 없다!
// import React from 'react';
// Next가 'pages'폴더(무조건 pages이름) Next가 인식해서

import AppLayout from "../components/AppLayout";

// 모든 파일들을 코드 스플릿을 통해 개별적인 페이지(component)로 만들어준다.
const Home = () => {
  return (
    <AppLayout>
      <div></div>
    </AppLayout>
  );
};

export default Home;

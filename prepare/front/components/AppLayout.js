import PropTypes from "prop-types"; // prop으로 넘기는애들을 검사해준다.
import Link from "next/link";
import styled, { createGlobalStyle } from "styled-components";

import { Menu, Input, Row, Col } from "antd";
import { useSelector } from "react-redux";
// 반응형 -> 화면이 처음엔 mobile이었다가 크기가 바뀜에따라 컴포넌트 크기가 달라짐
import UserProfile from "./UserProfile";
import LoginForm from "./LoginForm";

const SearchInput = styled(Input.Search)`
  vertical-align: middle;
`;
const Global = createGlobalStyle`
.ant-row {
  margin-right : 0 !important;
  margin-left : 0 !important;
}
.ant-col:first-child {
  padding-left: 0 !important;
}
.ant-col:last-child {
  padding-right : 0 !important;
}
`;

const AppLayout = ({ children }) => {
  const { me } = useSelector((state) => state.user); // isLoggedIn 이 바뀌면 알아서 펑션컴포넌트가 리렌더링된다.
  return (
    <div>
      <Global />
      <Menu mode="horizontal">
        <Menu.Item>
          <Link href="/">
            <a>노드버드</a>
          </Link>
        </Menu.Item>
        <Menu.Item>
          <Link href="/profile">
            <a>프로필</a>
          </Link>
        </Menu.Item>
        <Menu.Item>
          <SearchInput enterButton style={{ verticalAlign: "middle" }} />
        </Menu.Item>
        <Menu.Item>
          <Link href="/signup">
            <a>회원가입</a>
          </Link>
        </Menu.Item>
      </Menu>
      {/* 반응형 작성 */}
      <Row gutter={8}>
        {/* gutter column간의 간격 */}
        {/* xs:모바일, sm:태블릿, md:작은 데스크탑 */}
        <Col xs={24} md={6}>
          {me ? <UserProfile /> : <LoginForm />}
        </Col>
        {/* 모바일일 때는 24칸 차지, md는 6칸! n/24를 생각하면됨 */}
        <Col xs={24} md={12}>
          {children}
        </Col>
        {/* xs 끼리 합쳐서 24이하이면 한줄에 나올 수 있다.  */}
        <Col xs={24} md={6}>
          <a
            href="https://github.com/Kwongiseok"
            target="_blank"
            rel="noreferrer noopener"
          >
            {/* noreferrer(이전 페이지) , noopener(누가 열었는지)를 숨겨줄 필요가있다.  */}
            Made by Giseok
          </a>
        </Col>
      </Row>
    </div>
  );
};

AppLayout.propTypes = {
  children: PropTypes.node.isRequired, // node -> 리액트의 node(화면에 그릴 수 있는 모든 것들)
};
export default AppLayout;

import "antd/dist/antd.css";
import PropTypes from "prop-types";
import Head from "next/head"; //
import wrapper from "../store/configureStore";

// html 내에서 head 부분을 수정할 수 있게 next에서 제공해준다.
const NodeBird = ({ Component }) => (
  <>
    <Head>
      <meta charSet="utf-8" />
      <title>NodeBird</title>
    </Head>
    <Component />
  </>
);
NodeBird.propTypes = {
  Component: PropTypes.elementType.isRequired,
};
export default wrapper.withRedux(NodeBird);

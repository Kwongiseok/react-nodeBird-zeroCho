/* 로그인 한 사람인지 아닌 지 checking이 필요하다 */

exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next(); // next -> 사용 방법 2가지, 인자를 넣으면 에러 처리, 공백이면 다음 미들웨어로 간다.
  } else {
    res.status(401).send("로그인이 필요합니다.");
  }
};

exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next(); // next -> 사용 방법 2가지, 인자를 넣으면 에러 처리, 공백이면 다음 미들웨어로 간다.
  } else {
    res.status(401).send("로그인이 필요합니다.");
  }
};

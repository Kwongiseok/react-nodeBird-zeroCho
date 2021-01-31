const passport = require("passport");
const local = require("./local");
const { User } = require("../models");
module.exports = () => {
  passport.serializeUser((user, done) => {
    // req.logIn의 user 정보가 들어간다.
    done(null, user.id); // 쿠키와 묶어줄 id만 매치 (session에 정보를 다담고있기에는 무겁다.)
  });
  passport.deserializeUser(async (id, done) => {
    // 로그인이 성공하고 나서, 그 다음 요청(route)부터 이 부분이 실행된다. id를 통해서 DB -> 정보를 복구
    // 로그인이 성공하고나서 connection.sid와 함께 요청이 보내지고, 이부분이 실행이된다
    try {
      const user = await User.findOne({ where: { id } });
      done(null, user); // req.user에 저장
    } catch (err) {
      console.error(err);
      done(error);
    }
  });

  local();
};

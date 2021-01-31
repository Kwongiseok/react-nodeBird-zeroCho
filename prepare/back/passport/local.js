const passport = require("passport");
const { Strategy: LocalStrategy } = require("passport-local");
const { User } = require("../models");
const bcrypt = require("bcrypt");

module.exports = () => {
  passport.use(
    new LocalStrategy(
      {
        // req.body.email , req.body.password
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        try {
          // await(비동기)로 작동하면 서버에서 에러가 발생할 수 있으므로, try catch문으로 작성
          const user = await User.findOne({
            // 해당 이메일의 유저를 찾는다.
            where: { email },
          });
          if (!user) {
            return done(null, false, { reason: "존재하지 않는 이메일입니다!" }); // 첫 번째 서버에러, 두 번째 성공여부, 세 번째 클라이언트 에러
          }
          const result = await bcrypt.compare(password, user.password);
          if (result) {
            // 성공
            return done(null, user);
          } else {
            return done(null, false, { reason: "비밀번호가 틀렸습니다!" });
          }
        } catch (err) {
          console.error(err);
          return done(err);
        }
      }
    )
  );
};

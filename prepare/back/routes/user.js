const express = require("express");
const { User, Post } = require("../models"); // db.User
const bcrypt = require("bcrypt");
const passport = require("passport");
const db = require("../models");
const router = express.Router();
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");

router.get("/", async (req, res, next) => {
  // 새로 고침할 때 로그인이 유지되게끔,
  try {
    if (req.user) {
      // 확실하게 로그인 되어있을 때만 찾도록
      const fullUserWithoutPassword = await User.findOne({
        where: { id: req.user.id },
        attributes: {
          // 비밀번호 칸만 뺴고 가져오겠다.
          exclude: ["password"],
        },
        include: [
          // 다른 테이블들과 합칠 때 include,
          {
            model: Post,
            attributes: ["id"], // 모든 정보를 가져오기에는 무겁다
          },
          {
            model: User,
            as: "Followings",
            attributes: ["id"], // 모든 정보를 가져오기에는 무겁다
          },
          {
            model: User,
            as: "Followers",
            attributes: ["id"], // 모든 정보를 가져오기에는 무겁다
          },
        ],
      });
      res.status(200).json(fullUserWithoutPassword);
    } else {
      res.status(200).json(null);
    }
  } catch (err) {
    console.error(err);
    next(error);
  }
});

// Post /user/login
router.post("/login", isNotLoggedIn, (req, res, next) => {
  // 미들웨어 움직임은 위에서 아래로 왼쪽에서 오른쪽으로간다.
  // 즉 isNotLoggedIn이 실행되고 next()가 실행되면 다음 콜백이 실행이된다.
  // 로그인은 로그인 안한 사람만 할 수 있어야한다.
  // passport.authenticate를 사용하려 했더니 res , next 사용이 불가능했다.
  // middleware 확장을 통해 문제를 해결한 구조이다. express의 문법 중 하나
  passport.authenticate("local", (err, user, info) => {
    // local 규칙을 거치고,
    // done으로 리턴된 것 콜백함수
    if (err) {
      // 서버 에러
      console.error(err);
      return next(err); // 에러 처리 미들웨어로 간다.
    }
    if (info) {
      // 클라이언트 에러
      return res.status(401).send(info.reason);
    }
    return req.login(user, async (loginErr) => {
      // passport 로그인 시도 -> passport.serializeUser가 실행된다. 쿠키와 user.id만 매치시키는 작업
      if (loginErr) {
        console.error(loginErr);
        return next(loginErr);
      }
      const fullUserWithoutPassword = await User.findOne({
        where: { id: user.id },
        attributes: {
          // 비밀번호 칸만 뺴고 가져오겠다.
          exclude: ["password"],
        },
        include: [
          // 다른 테이블들과 합칠 때 include,
          {
            model: Post,
            attributes: ["id"], // 모든 정보를 가져오기에는 무겁다
          },
          {
            model: User,
            as: "Followings",
            attributes: ["id"], // 모든 정보를 가져오기에는 무겁다
          },
          {
            model: User,
            as: "Followers",
            attributes: ["id"], // 모든 정보를 가져오기에는 무겁다
          },
        ],
      });
      return res.status(200).json(fullUserWithoutPassword); // 진짜 로그인 완료
    });
  })(req, res, next);
}); // passport 적용 ,

router.post("/", isNotLoggedIn, async (req, res, next) => {
  // Post /user/
  try {
    const exUser = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (exUser) {
      return res.status(401).send("이미 사용중인 아이디 입니다."); // 응답을 한번만 보내야하므로 return (주의!!)
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10); // 뒤에 숫자만큼 강도(해쉬화하는)
    await User.create({
      email: req.body.email, // data
      nickname: req.body.nickname,
      password: hashedPassword,
    }); // 비동기 작동 순서를 맞춰주기 위한 await
    res.status(201).send("ok"); // 성공적인 요청 200
  } catch (error) {
    console.log(error);
    console.log("server 문제");
    next(error); // next로 처리하면 한방에 에러를 처리해준다.
  }
});

router.post("/logout", isLoggedIn, (req, res) => {
  console.log(req.user);
  req.logout();
  req.session.destroy();
  res.send("ok");
});
module.exports = router;

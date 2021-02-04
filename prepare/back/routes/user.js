const express = require("express");
const { User, Post, Comment, Image } = require("../models"); // db.User
const bcrypt = require("bcrypt");
const passport = require("passport");
const db = require("../models");
const router = express.Router();
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
const { Op } = require("sequelize");

router.get("/", async (req, res, next) => {
  // 새로 고침할 때 로그인이 유지되게끔,
  console.log(req.headers);
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

router.get("/:id", async (req, res, next) => {
  // GET /user/3
  try {
    const fullUserWithoutPassword = await User.findOne({
      where: { id: req.params.id },
      attributes: {
        exclude: ["password"],
      },
      include: [
        {
          model: Post,
          attributes: ["id"],
        },
        {
          model: User,
          as: "Followings",
          attributes: ["id"],
        },
        {
          model: User,
          as: "Followers",
          attributes: ["id"],
        },
      ],
    });
    if (fullUserWithoutPassword) {
      const data = fullUserWithoutPassword.toJSON();
      data.Posts = data.Posts.length; // 길이를 삽입해서 길이외에 정보들은 안나오도록 (보안)
      data.Followings = data.Followings.length;
      data.Followers = data.Followers.length;
      res.status(200).json(data);
    } else {
      res.status(404).json("존재하지 않는 사용자입니다.");
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/:userId/posts", async (req, res, next) => {
  // GET /user/1/posts
  try {
    const where = { UserId: req.params.userId };
    if (parseInt(req.query.lastId, 10)) {
      // 초기 로딩이 아닐 때
      where.id = { [Op.lt]: parseInt(req.query.lastId, 10) };
    } // 21 20 19 18 17 16 15 14 13 12 11 10 9 8 7 6 5 4 3 2 1
    const posts = await Post.findAll({
      where,
      limit: 10,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          attributes: ["id", "nickname"],
        },
        {
          model: Image,
        },
        {
          model: Comment,
          include: [
            {
              model: User,
              attributes: ["id", "nickname"],
              order: [["createdAt", "DESC"]],
            },
          ],
        },
        {
          model: User, // 좋아요 누른 사람
          as: "Likers",
          attributes: ["id"],
        },
        {
          model: Post,
          as: "Retweet",
          include: [
            {
              model: User,
              attributes: ["id", "nickname"],
            },
            {
              model: Image,
            },
          ],
        },
      ],
    });
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
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

router.patch("/nickname", isLoggedIn, async (req, res, next) => {
  try {
    await User.update(
      {
        nickname: req.body.nickname,
      },
      {
        where: { id: req.user.id },
      }
    );
    res.status(200).json({ nickname: req.body.nickname });
  } catch (err) {
    console.error(err);
    next(err);
  }
});
router.patch("/:userId/follow", isLoggedIn, async (req, res, next) => {
  // PATCH /user/1/follow
  try {
    const user = await User.findOne({ where: { id: req.params.userId } });
    if (!user) {
      res.status(403).send("없는 사람을 팔로우하려고 하시네요?");
    }
    await user.addFollowers(req.user.id);
    res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete("/:userId/follow", isLoggedIn, async (req, res, next) => {
  // DELETE /user/1/follow
  try {
    const user = await User.findOne({ where: { id: req.params.userId } });
    if (!user) {
      res.status(403).send("없는 사람을 언팔로우하려고 하시네요?");
    }
    await user.removeFollowers(req.user.id);
    res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});
router.delete("/follower/:userId", isLoggedIn, async (req, res, next) => {
  // DELETE /user/follower/2
  try {
    const user = await User.findOne({ where: { id: req.params.userId } });
    if (!user) {
      res.status(403).send("없는 사람을 차단하려고 하시네요?");
    }
    await user.removeFollowings(req.user.id);
    res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/followers", isLoggedIn, async (req, res, next) => {
  // GET /user/followers
  try {
    const user = await User.findOne({ where: { id: req.user.id } });
    if (!user) {
      res.status(403).send("없는 사람을 찾으려고 하시네요?");
    }
    const followers = await user.getFollowers();
    res.status(200).json(followers);
  } catch (error) {
    console.error(error);
    next(error);
  }
});
router.get("/followings", isLoggedIn, async (req, res, next) => {
  // GET /user/followings
  try {
    const user = await User.findOne({ where: { id: req.user.id } });
    if (!user) {
      res.status(403).send("없는 사람을 찾으려고 하시네요?");
    }
    const followings = await user.getFollowings();
    res.status(200).json(followings);
  } catch (error) {
    console.error(error);
    next(error);
  }
});
module.exports = router;

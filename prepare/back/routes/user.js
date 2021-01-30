const express = require("express");
const { User } = require("../models"); // db.User
const bcrypt = require("bcrpyt");

const router = express.Router();

router.post("/", async (req, res, next) => {
  // Post /user/
  try {
    await exUser = User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (exUser) {
      return res.status(403).send("이미 사용중인 아이디 입니다."); // 응답을 한번만 보내야하므로 return (주의!!)
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10); // 뒤에 숫자만큼 강도(해쉬화하는)
    await User.create({
      email: req.body.email, // data
      nickname: req.body.nickname,
      password: hashedPassword,
    }); // 비동기 작동 순서를 맞춰주기 위한 await
    res.status(200).send("ok"); // 성공적인 요청 200
  } catch (error) {
    console.log(error);
    next(error); // next로 처리하면 한방에 에러를 처리해준다.
  }
});

module.exports = router;

const express = require("express");
const { Post, User, Image, Comment } = require("../models");

const router = express.Router();

router.get("/", async (req, res, next) => {
  // GET /posts
  try {
    const posts = await Post.findAll({
      limit: 10,
      order: [
        ["createdAt", "DESC"],
        [Comment, "createdAt", "DESC"], // 댓글 내림차순 정렬
      ],
      // lastId: 0, // offset의 경우 데이터가 삭제, 추가 될 때 문제가 발생한다.
      // lastId 해당부분이 삭제되더라도 lastId 보다 작은 값이 대체되어 실행되어 문제가 발생하지 않는다.
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
            },
          ],
        },
      ],
    });
    console.log(posts);
    res.status(200).json(posts);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;

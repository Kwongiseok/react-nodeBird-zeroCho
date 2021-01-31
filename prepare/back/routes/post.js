const express = require("express");
const { Post, User, Comment, Image } = require("../models");
const router = express.Router();
const { isLoggedIn } = require("./middlewares");

router.post("/", isLoggedIn, async (req, res, next) => {
  // :postId 동적으로 변화
  // POST /post
  // 게시글 작성 하는 것
  try {
    const post = await Post.create({
      content: req.body.content,
      UserId: req.user.id,
    });
    const fullPost = await Post.findOne({
      where: { id: post.id },
      include: [
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
        {
          model: User,
        },
      ],
    });
    res.status(201).json(fullPost);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.post("/:postId/comment", isLoggedIn, async (req, res, next) => {
  // :postId 동적으로 변화
  // POST /post
  // 게시글 작성 하는 것
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId },
    });
    if (!post) {
      return res.status(403).send("존재하지 않는 게시글입니다.");
    }
    const comment = await Comment.create({
      content: req.body.content,
      PostId: parseInt(req.params.postId, 10), // params가 문자열이 된다 위의 /post/postId/comment로 인해서
      UserId: req.user.id,
    });
    const fullComment = await Comment.findOne({
      where: { id: comment.id },
      include: [
        {
          model: User,
          attributes: ["id", "nickname"],
        },
      ],
    });
    res.status(201).json(fullComment);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.delete("/post", isLoggedIn, (req, res) => {
  // DELETE /post
  res.json({ id: 1 });
});

module.exports = router;

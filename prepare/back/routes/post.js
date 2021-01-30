const express = require("express");

const router = express.Router();

router.post("/", (req, res) => {
  // POST /post
  // 게시글 작성 하는 것
  res.json({ id: 1, content: "hello" });
});

router.delete("/post", (req, res) => {
  // DELETE /post
  res.json({ id: 1 });
});

module.exports = router;

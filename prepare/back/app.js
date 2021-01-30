const express = require("express");

const app = express();
const postRouter = require("./routes/post");

app.use("/post", postRouter);

app.get("/", (req, res) => {
  res.send("hello express");
});

app.get("/api", (req, res) => {
  res.send("hello api");
});

app.get("/api/posts", (req, res) => {
  res.json([
    { id: 1, content: "hello" },
    { id: 2, content: "hello2" },
    { id: 3, content: "hello3" },
  ]);
});

app.listen(3000, () => {
  console.log("서버 실행 중");
});

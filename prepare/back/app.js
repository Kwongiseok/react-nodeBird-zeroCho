const express = require("express");
const db = require("./models");
const app = express();
const postRouter = require("./routes/post");
const userRouter = require("./routes/user");

db.sequelize
  .sync()
  .then(() => {
    console.log("db 연결 성공");
  })
  .catch(console.error);
app.use(express.json()); // json , urlencoded -> 프론트에서 보낸 데이터를 req.body안에 넣어주는 역할을 한다.
app.use(express.urlencoded({ extended: true })); // app.use('/user') 보다 빨라야하는 이유 post user를 찾으면 실행하고 끝나서
// 최소한 라우터들보다는 위에서 선언해줘야한다 ( 미들웨어는 처음부터 아래로 실행하므로 )

app.use("/post", postRouter);
app.use("/user", userRouter);
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

app.listen(3060, () => {
  console.log("서버 실행 중");
});

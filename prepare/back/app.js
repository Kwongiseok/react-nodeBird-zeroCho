const express = require("express");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const dotenv = require("dotenv");
const db = require("./models");
const app = express();
const morgan = require("morgan");
const path = require("path");
const postRouter = require("./routes/post");
const postsRouter = require("./routes/posts");
const userRouter = require("./routes/user");
const passportConfig = require("./passport");

dotenv.config();
db.sequelize
  .sync()
  .then(() => {
    console.log("db 연결 성공");
  })
  .catch(console.error);
passportConfig();

app.use(morgan("dev"));
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true, // 쿠키도 포함해서 전달.
  })
);
app.use("/", express.static(path.join(__dirname, "uploads")));
// __dirname/uploads, path.join을 사용하는 이유 : OS 별로 경로의 표기방법이달라서
// localhost:3060/ 주소가 된다.
app.use(express.json()); // json , urlencoded -> 프론트에서 보낸 데이터를 req.body안에 넣어주는 역할을 한다.
app.use(express.urlencoded({ extended: true })); // app.use('/user') 보다 빨라야하는 이유 post user를 찾으면 실행하고 끝나서
// 최소한 라우터들보다는 위에서 선언해줘야한다 ( 미들웨어는 처음부터 아래로 실행하므로 ) , json -> json형식으로 데이터를 보낼 때 json형태로 넣어주고
//urlencoded -> form submit을 할 때 urlencoded 방식으로 넘어오는 걸 처리해준다.
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    saveUninitialized: false,
    resave: false,
    secret: process.env.COOKIE_SECRET, // 쿠키에 secretkey를 통해 생성된 랜덤한 문자가 들어감, secretkey를 알면 데이터 복원이 가능해진다.
  })
);
app.use(passport.initialize());
app.use(passport.session()); // 미들웨어들

app.use("/posts", postsRouter);
app.use("/post", postRouter);
app.use("/user", userRouter);

/* 에러 처리 미들웨어가 내부적으로 존재한다, 우리가 직접 바꿔줄 수 있다. */
// app.use((err,req,res,next) => {

// });
app.listen(3060, () => {
  console.log("서버 실행 중");
});

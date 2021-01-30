"use strict";
const Sequelize = require("sequelize");
const env = process.env.NODE_ENV || "development"; // 배포할 떄는 productiond 으로 바뀐다.
const config = require("../config/config")[env]; // config 에서 배포, 개발 , 테스트 중 가져온다.

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
); // node와 mysql을 연결해준다.
// 드라이버에 database , username, password 설정 정보를 보내주어 node와 mysql이 연결할 수 있게 도와준다 sequelize의 역할

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

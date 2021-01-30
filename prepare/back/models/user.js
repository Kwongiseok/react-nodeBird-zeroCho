module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      // email , nickname, password are column,
      // MySQL에는 users로 테이블 생성 및 저장이 된다.
      // id가 기본적으로 들어있다.
      email: {
        type: DataTypes.STRING(40), // STRING, TEXT, BOOLEAN, FLOAT, DATETIME
        allowNull: false, // email 필수
        unique: true, // 고유한 값
      },
      nickname: {
        type: DataTypes.STRING(40),
        allowNull: false, // nickname 필수
      },
      password: {
        type: DataTypes.STRING(100), // 비밀번호는 암호화를 하면 길이가 엄청늘어나므로 넉넉하게 배치
        allowNull: false, // password 필수
      },
    },
    {
      charset: "utf8",
      collate: "utf8_general_ci", // 한글 저장
    }
  );
  User.associate = (db) => {
    db.User.hasMany(db.Post);
    db.User.hasMany(db.Comment);
    db.User.belongsToMany(db.Post, { through: "Like", as: "Liked" }); // 좋아요 , 중간테이블 명 like (다대다), 좋아요를 누른 사람들
    db.User.belongsToMany(db.User, {
      through: "Follow",
      as: "Followers",
      foreignKey: "FollowingId",
    }); // 팔로잉 팔로워 관계를 찾으려면 반대를 찾아야한다.
    db.User.belongsToMany(db.User, {
      through: "Follow",
      as: "Followings",
      foreignKey: "FollowerId",
    });
  }; // foreignKey -> 서로 다른 User 들끼리 userId column이 겹치므로 누가 팔로우, 팔로잉인지 구별해주기 위해
  return User;
};

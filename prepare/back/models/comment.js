module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define(
    "Comment",
    {
      // MySQL에는 comments로 테이블 생성 및 저장이 된다.
      // id가 기본적으로 들어있다.
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      charset: "utf8mb4",
      collate: "utf8mb4_general_ci", // 한글 + 이모티콘 저장
    }
  );
  Comment.associate = (db) => {
    db.Comment.belongsTo(db.User); // 하나의 comment를 작성한 유저는 한명
    db.Comment.belongsTo(db.Post); // 하나의 코멘트는 반드시 하나의 post에 속함
  };
  return Comment;
};

module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    "Post",
    {
      // MySQL에는 posts로 테이블 생성 및 저장이 된다.
      // id가 기본적으로 들어있다.
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      charset: "utf8mb4",
      collate: "utf8mb4_general_ci", // 이모티콘+한글 저장
    }
  );
  Post.associate = (db) => {
    db.Post.belongsTo(db.User); // post 작성자 , post.addUser, post.getUser, post.setUser, post.removeUser
    db.Post.belongsToMany(db.Hashtag, { through: "PostHashtag" }); // Many-Many 관계
    db.Post.hasMany(db.Comment);
    db.Post.hasMany(db.Image); // post.addImages, post.getImages
    db.Post.belongsTo(db.Post, { as: "Retweet" }); // 리트윗
    db.Post.belongsToMany(db.User, { through: "Like", as: "Likers" }); // post에 좋아요를 누른 사람들 post.addLikers, post.removeLikers
  };
  return Post;
};

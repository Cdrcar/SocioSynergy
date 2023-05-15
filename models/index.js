const User = require("./User");
const Post = require("./Post");
const Comment = require("./Comment");
const Followers= require("./Followers");

User.hasMany(Post, {
  foreignKey: "user_id", 
});

User.hasMany(Comment, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
});

User.hasMany(Followers,{
  foreignKey: "user_id",
  onDetele:"CASCADE",
});

Post.belongsTo(User, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
});

Post.hasMany(Comment, {
  foreignKey: "post_id",
  onDelete: "CASCADE",
});

Comment.belongsTo(User, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
});

Comment.belongsTo(Post, {
  foreignKey: "post_id",
  onDelete: "CASCADE",
});

module.exports = { User, Post, Comment, Followers};

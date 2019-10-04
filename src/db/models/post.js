'use strict';
module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    userId: DataTypes.INTEGER,
    groupId: DataTypes.INTEGER,
    content: DataTypes.STRING,
    title: DataTypes.STRING
  }, { freezeTableName: true });
  Post.associate = function(models) {
    // associations can be defined here
    Post.belongsTo(models.Group);
  };
  
  return Post;
};
'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: { type: DataTypes.STRING, unique: true },
    groupsCreated: { type: DataTypes.INTEGER, validate: { max: 3, min: 0 } },
  }, { freezeTableName: true });
  User.associate = function(models) {
    // associations can be defined here
    // many to many
    // https://sequelize-guides.netlify.com/many-many-associations/
    User.belongsToMany(models.Group, {
      through: 'Member',
    });
  };
  return User;
};
'use strict';
module.exports = (sequelize, DataTypes) => {
  const Group = sequelize.define('Group', {
    name: { type: DataTypes.STRING, unique: true },
    adminUserId: DataTypes.INTEGER,
    groupEmail: DataTypes.STRING,
    description: DataTypes.TEXT,
    website: DataTypes.STRING,
    statement: DataTypes.TEXT,
    meetingDay: DataTypes.STRING,
    meetingTime: DataTypes.STRING,
    meetingPlace: DataTypes.STRING,
    categoryId: DataTypes.INTEGER,
    mailingList: DataTypes.STRING,
    mode: DataTypes.STRING,
  }, { freezeTableName: true });
  Group.associate = function(models) {
    // associations can be defined here
    Group.belongsToMany(models.User, {
      through: 'Member',
    });
  };
  return Group;
};
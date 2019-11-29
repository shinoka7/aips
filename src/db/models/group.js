'use strict';
module.exports = (sequelize, DataTypes) => {
  const Group = sequelize.define('Group', {
    name: { type: DataTypes.STRING, unique: true },
    adminUserId: DataTypes.INTEGER,
    groupEmail: DataTypes.STRING,
    description: DataTypes.STRING,
    website: DataTypes.STRING,
    statement: DataTypes.STRING,
    meetingDay: DataTypes.STRING,
    meetingTime: DataTypes.STRING,
    meetingPlace: DataTypes.STRING,
  }, { freezeTableName: true });
  Group.associate = function(models) {
    // associations can be defined here
    Group.belongsToMany(models.User, {
      through: 'Member',
    });
  };
  return Group;
};
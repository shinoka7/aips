'use strict';
module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define('Notification', {
    userId: DataTypes.INTEGER,
    groupId: DataTypes.INTEGER,
    notifyPosts: DataTypes.BOOLEAN,
    notifyEvents: DataTypes.BOOLEAN,
  }, { freezeTableName: true });
  Notification.associate = (models) => {
    // associations can be defined here
    Notification.belongsTo(models.User);
    Notification.belongsTo(models.Group);
  };
  
  return Notification;
};
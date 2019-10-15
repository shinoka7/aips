'use strict';
module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define('Event', {
    groupId: DataTypes.INTEGER,
    startAt: DataTypes.DATE,
    endAt: DataTypes.DATE,
    name: DataTypes.STRING,
    description: DataTypes.STRING,
  }, { freezeTableName: true });
  Event.associate = (models) => {
    // associations can be defined here
    Event.belongsTo(models.Group);
  };
  
  return Event;
};
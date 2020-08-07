'use strict';
module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define('Event', {
    groupId: DataTypes.INTEGER,
    startDate: DataTypes.STRING,
    startTime: DataTypes.STRING,
    endDate: DataTypes.STRING,
    endTime: DataTypes.STRING,
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    image: DataTypes.STRING,
    goingCount: DataTypes.INTEGER,
    privateEvent: DataTypes.BOOLEAN,
  }, { freezeTableName: true });
  Event.associate = (models) => {
    // associations can be defined here
    Event.belongsTo(models.Group);
  };

  return Event;
};

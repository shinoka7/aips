'use strict';
module.exports = (sequelize, DataTypes) => {
  const Pending = sequelize.define('Pending', {
    userId: { type: DataTypes.INTEGER, unique: 'user_group' },
    groupId: { type: DataTypes.INTEGER, unique: 'user_group' },
  }, { freezeTableName: true });
  Pending.associate = (models) => {
    // associations can be defined here
    Pending.belongsTo(models.User);
    Pending.belongsTo(models.Group);
  };
  
  return Pending;
};
'use strict';
module.exports = (sequelize, DataTypes) => {
  const Page = sequelize.define('Page', {
    grantedGroupId: DataTypes.INTEGER,
    lastUpdateUserId: DataTypes.INTEGER,
  }, { freezeTableName: true });
  Page.associate = function(models) {
    // associations can be defined here
    Page.belongsTo(models.Group);
  };
  return Page;
};
'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('Page', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      grantedGroupId: {
        type: Sequelize.INTEGER,
      },
      lastUpdateUserId: {
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'), // cf. https://github.com/sequelize/sequelize/issues/5561
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'), // cf. https://github.com/sequelize/sequelize/issues/5561
        type: Sequelize.DATE
      },
      version: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
    })
  },
  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('Page');
  }
};

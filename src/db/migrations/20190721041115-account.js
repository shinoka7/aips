'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('Account', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      provider: {
        type: Sequelize.STRING,
        unique: true
      },
      accountId: {
        type: Sequelize.STRING,
        unique: true
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
    return queryInterface.dropTable('Account');
  }
};

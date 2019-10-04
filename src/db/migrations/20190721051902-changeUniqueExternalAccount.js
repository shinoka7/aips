'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeIndex('Account', 'provider', {
        type: Sequelize.STRING,
        unique: false
      }),
      queryInterface.removeIndex('Account', 'accountId', {
        type: Sequelize.STRING,
        unique: false
      })
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.addIndex('Account', {
      fields: ['provider', 'accountId'],
      unique: true
    });
  }
};

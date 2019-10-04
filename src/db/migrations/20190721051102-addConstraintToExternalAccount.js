'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addConstraint('Account', ['provider', 'accountId'], {
      type: 'unique',
      name: 'unique_provider_accountId'
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeConstraint('Account', 'unique_provider_accountId');
  }
};

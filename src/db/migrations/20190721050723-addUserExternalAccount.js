'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Account',
      'UserId', {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "User",
          key: "id"
        }
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Account', 'UserId');
  }
};

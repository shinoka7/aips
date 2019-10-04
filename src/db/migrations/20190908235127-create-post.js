'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Post', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: "User",
          key: "id"
        }
      },
      groupId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: "Group",
          key: "id"
        }
      },
      content: {
        type: Sequelize.STRING,
      },
      title: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Post');
  }
};
'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Event', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      groupId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Group",
          key: "id"
        }
      },
      startDate: {
        type: Sequelize.STRING,
      },
      startTime: {
        type: Sequelize.STRING,
      },
      endDate: {
        type: Sequelize.STRING,
      },
      endTime: {
        type: Sequelize.STRING,
      },
      name: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING,
      },
      image: {
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
    return queryInterface.dropTable('Event');
  }
};
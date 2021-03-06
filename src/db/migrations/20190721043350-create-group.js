'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Group', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        unique: true
      },
      adminUserId: {
        type: Sequelize.INTEGER
      },
      groupEmail: {
        type: Sequelize.STRING
      },
      description: {
        allowNull: false,
        type: Sequelize.TEXT,
        defaultValue: '',
      },
      website: {
        allowNull: false,
        type: Sequelize.STRING,
        defaultValue: '',
      },
      statement: {
        allowNull: false,
        type: Sequelize.TEXT,
        defaultValue: '',
      },
      meetingDay: {
        allowNull: false,
        type: Sequelize.STRING,
        defaultValue: '',
      },
      meetingTime: {
        allowNull: false,
        type: Sequelize.STRING,
        defaultValue: '',
      },
      meetingPlace: {
        allowNull: false,
        type: Sequelize.STRING,
        defaultValue: '',
      },
      categoryId: {
        type: Sequelize.INTEGER
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
      },
      mailingList: {
        allowNull: false,
        type: Sequelize.STRING,
        defaultValue: '',
      },
      mode: {
        allowNull: false,
        type: Sequelize.STRING,
        defaultValue: 'Public',
      },
      groupImage: {
        allowNull: false,
        type: Sequelize.STRING,
        defaultValue: '/resources/img/default/default_group.png',
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Group');
  }
};
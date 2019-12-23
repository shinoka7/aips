'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Pending', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            userId: {
                type: Sequelize.INTEGER,
                unique: 'user_group'
            },
            groupId: {
                type: Sequelize.INTEGER,
                unique: 'user_group'
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
        return queryInterface.dropTable('Pending');
    }
};
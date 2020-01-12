'use strict';
module.exports = (sequelize, DataTypes) => {
    const Category = sequelize.define('Category', {
        name: { type: DataTypes.STRING, unique: true },
        description: DataTypes.TEXT,
        color: DataTypes.STRING,
    }, { freezeTableName: true });
    Category.associate = function(models) {
    };
    return Category;
};
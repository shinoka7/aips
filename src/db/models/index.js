'use strict';
// https://github.com/sequelize/sequelize/issues/4578#issuecomment-338446840

const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);
const db = {};

const sequelize = require('../../services/sequelize');

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach((file) => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.sequelize.sync();

module.exports = db;

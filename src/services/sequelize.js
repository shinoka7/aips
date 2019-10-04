const { DB_HOST, DB_PORT, DB_DIALECT, DB_USER, DB_PASSWORD, DB_NAME, DB_TIMEZONE } = process.env;

const Sequelize = require('sequelize');

const config = { dialect: DB_DIALECT,
  dialectOptions: { timezone: DB_TIMEZONE },
  host: DB_HOST,
  port: DB_PORT
};

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, config);

module.exports = sequelize;
// NPM Modules
const { Sequelize } = require('sequelize');
// Config Details
const { dbDatabaseName, dbUsername, dbPassword, dbHost } = require("../config/keys")

const db = new Sequelize( dbDatabaseName, dbUsername, dbPassword, {
  host: dbHost,
  dialect: 'mysql' ,
  operatorsAliases: 0,
  pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
  }
});

module.exports = db
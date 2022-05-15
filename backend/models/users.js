// NPM Modules
const { DataTypes } = require('sequelize');
// Database config
const db = require('../database')
// Other Models
// const Category = require('./categories')

const User = db.define('User', {
    userID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true 
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userEmail: {
      type: DataTypes.STRING,
      allowNull: false
    }
})  

module.exports = User
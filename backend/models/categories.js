// NPM Modules
const { DataTypes } = require('sequelize');
// Database config
const db = require('../database')

const Category = db.define('Category', {
    categoryID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true 
    },
    categoryName:{
        type: DataTypes.STRING,
        allowNull: false
    }  
})

module.exports = Category
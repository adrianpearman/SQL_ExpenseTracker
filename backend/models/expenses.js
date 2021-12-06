// NPM Modules
const { DataTypes } = require('sequelize');
// Database config
const db = require('../database')

const Expense = db.define('Expense', {
    expenseID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true 
    },
    userID:{
        type: DataTypes.STRING,
        allowNull: false
    },
    amount:{
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    location:{
        type: DataTypes.STRING,
        allowNull: false
    },
    description:{
        type: DataTypes.STRING,
        allowNull: true
    },
    day:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    month:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    year:{
        type: DataTypes.INTEGER,
        allowNull: false
    }  
})

module.exports = Expense
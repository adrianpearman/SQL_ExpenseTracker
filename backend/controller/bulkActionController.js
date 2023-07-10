// NPM Modules
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path')

const { 
  convertCategoryToCSV,
  convertExpenseToCSV,
  insertExpenseToDB, 
  insertCategoryToDB,
  queryExpenses,
  testFunction
} = require('../utils');

const bulkActionController = {
  bulkAddToDB: async (req, res) => {
    const { dbType } = req.body
    const data = []
    const fileLocation = dbType === "expense" ? './csvFiles/expensesFile.csv' : './csvFiles/categoryFile.csv'

    fs.createReadStream(fileLocation)
      .pipe(csv())
      .on('data', (row) => {
        data.push(row)
      })
      .on('end', () => {
        dbType === "expense" ? insertExpenseToDB(data, res) : insertCategoryToDB(data, res)
      });
  },
  bulkUpdateCSV: async (req, res) => {
    await convertCategoryToCSV()
    await convertExpenseToCSV()
    res.send({ message: "Completed" })
  },
  downloadExpensePerRange: async (req, res) => {
    const { 
      month = new Date().getMonth() + 1, 
      year = new Date().getFullYear()
    } = req.body

    const t = await queryExpenses({ month, year })
    
    res.send(t)
  },
  downloadAllExpenseFile: async (req, res) => {
    const file = path.join(__dirname, '../../', 'csvFiles', 'expensesFile.csv')
    res.download(file)
  }
}

module.exports = bulkActionController;
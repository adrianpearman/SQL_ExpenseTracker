// NPM Modules
const csv = require('csv-parser');
const fs = require('fs');
// DB Expense Model
const Expense = require('../models/expenses')

const expenseController = {
  getAllExpenses: async (req, res) => {
    const totalExpenses = await Expense.findAll()

    const returnedData = { 
      totalExpenses: totalExpenses, 
      amountOfTransactions: totalExpenses.length
    }

    res.send(returnedData)
  },
  getExpense: async(req, res) => {
    const { expenseID } = req.query
    const expense = await Expense.findAll({
      where: { expenseID: expenseID }
    });
    res.send(expense)
  },
  getExpensePerMonth: async (req, res) => {
    let totalExpenses = 0
    const { month, year = new Date().getFullYear() } = req.query
    const expenses = await Expense.findAll({ 
      where: {
        month: month,
        year: year
      }
    })


    for (let i = 0; i < expenses.length; i++) {
      totalExpenses = totalExpenses + parseFloat(expenses[i].amount)
    }

    const returnedData = { 
      totalExpenses: totalExpenses.toFixed(2), 
      amountOfTransactions: expenses.length,
      transactions: expenses,
      averageExpenditure: (totalExpenses / expenses.length).toFixed(2)
    }
      
    res.send(returnedData)
  },
  getExpensePerYear: async (req, res) => {
    const { year = new Date().getFullYear() } = req.query
    const expensesObj = {}

    const expenses = await Expense.findAll({ where: { year } });

    for (let i = 0; i < expenses.length; i++) {
      const element = expenses[i];

      if(expensesObj[element.month] === undefined){
        expensesObj[element.month] = {
          transactions: [Number(element.amount)],
          averages: element.amount,
          totalExpenses: 1
        }
      } else{
        const expenseItem = expensesObj[element.month]
        expenseItem.transactions.push(Number(element.amount))
        const averageTransaction = (expenseItem.transactions.reduce(function(a, b) { return a + b; }, 0)) / i
        expenseItem.averages = Number(averageTransaction.toFixed(2))
        expenseItem.totalExpenses++
      }
    }

    res.send( expensesObj )
  },
  addExpense: async (req, res) => {
    const { UserID, Amount, Description, Day, Month, Year, Location } = req.query

    try{
      await Expense.create({ 
        userID: UserID,
        amount: Amount,
        location: Location,
        description: Description,
        day: parseInt(Day),
        month: parseInt(Month),
        year: parseInt(Year)
      })
      return res.send({message: "Successfully added expense"})
    }catch(err){
      console.log(err)
    }
  },
  bulkAddExpenses: async(req, res) => {
    const expenseList = []

    const insertExpenseToDB = async (data) => {
      let counter = {
        successCounter: 0,
        failedCounter: 0
      }

      for (let i = 0; i < data.length; i++) {
        const { UserID, Amount, Description, Day, Month, Year, Location } = data[i]
        
        try{
          await Expense.create({ 
            userID: UserID,
            amount: Amount,
            location: Location,
            description: Description,
            day: parseInt(Day),
            month: parseInt(Month),
            year: parseInt(Year)
          })

          counter.successCounter++
        }catch(err){
          counter.failedCounter++
        }
      }

      res.send({
        message: `Successfully processed file. Successful: ${counter.successCounter}; Unsuccessful: ${counter.failedCounter}`,
        metaData: counter
      })
    }

    fs.createReadStream('testCSVFile.csv')
      .pipe(csv())
      .on('data', (row) => {
        expenseList.push(row)
      })
      .on('end', () => {
        insertExpenseToDB(expenseList)
      });
  },
  updateExpense: () => {},
  deleteExpense: async(req, res) => {
    const { expenseID } = req.query
    const expense = await Expense.destroy({
      where: {
        expenseID: expenseID
      }
    })

    if(expense !== 0){
      res.send({ message: `Successfully deleted ExpenseID: ${expenseID}` })
    } else{
      res.send({ message: `No Expenses available with the ExpenseID of ${expenseID}` })  
    }
  },
  deleteAllExpenses: async(req,res) => {
    // Will need to add some logic to make this an admin function
    // API Key? 
    await Expense.drop()
    await Expense.sync({ force: true });
    res.send({message: "Successfully Cleared Database"})
  },
}

module.exports = expenseController
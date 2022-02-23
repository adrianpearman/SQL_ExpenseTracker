// NPM Modules
const csv = require('csv-parser');
const fs = require('fs');
const utils = require('../utils');
// DB Expense Model
const Expense = require('../models/expenses');
// DB Category Model
const Category = require('../models/categories');

const expenseController = {
  getAllExpenses: async (req, res) => {
    const returnedData = {}
    const totalExpenses = await Expense.findAll()

    returnedData.totalExpenses = totalExpenses, 
    returnedData.amountOfTransactions = totalExpenses.length

    res.send(returnedData)
  },
  getExpense: async(req, res) => {
    const { expenseID } = req.query
    const expense = await Expense.findAll({ where: { expenseID: expenseID } });
    res.send(expense)
  },
  getExpensePerMonth: async (req, res) => {
    let totalExpenses = 0
    const returnedData = {}
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

    returnedData.totalExpenses = Number(totalExpenses.toFixed(2)), 
    returnedData.amountOfTransactions = expenses.length,
    returnedData.transactions = expenses,
    returnedData.averageExpenditure = Number((totalExpenses / expenses.length).toFixed(2))
      
    res.send(returnedData)
  },
  getExpensePerYear: async (req, res) => {
    const { year = new Date().getFullYear() } = req.query
    const returnedData = {}

    const expenses = await Expense.findAll({ where: { year } });

    for (let i = 0; i < expenses.length; i++) {
      const element = expenses[i];

      if(returnedData[element.month] === undefined){
        returnedData[element.month] = {
          transactions: [Number(element.amount)],
          averages: element.amount,
          totalExpenses: 1
        }
      } else{
        const expenseItem = returnedData[element.month]
        expenseItem.transactions.push(Number(element.amount))
        const averageTransaction = (expenseItem.transactions.reduce(function(a, b) { return a + b; }, 0)) / expenseItem.transactions.length
        expenseItem.averages = Number(averageTransaction.toFixed(2))
        expenseItem.totalExpenses++
      }
    }

    const reducedArrayData = utils.reduceExpensesArray(expenses)

    returnedData.totalNumberOfExpenses = expenses.length
    returnedData.totalExpense = reducedArrayData
    returnedData.averageTransaction = Number((reducedArrayData / expenses.length).toFixed(2))

    res.send( returnedData )
  },
  getExpensePerLocation: async (req, res) => {
    const { location } = req.query
    const returnedData = {}

    if(!location){
      res.send({ message: "No location provided, please enter a location"})
    }else{
      const expenses = await Expense.findAll({ where: {location} })

      if(expenses.length !== 0){
        const reducedArrayData = utils.reduceExpensesArray(expenses)
        returnedData.expenses = expenses
        returnedData.totalNumberOfExpenses = expenses.length
        returnedData.location = location
        returnedData.totalExpense = reducedArrayData
        returnedData.averageTransaction = Number((reducedArrayData / expenses.length).toFixed(2))

        res.send(returnedData)
      }else{
        const reducedArrayData = utils.reduceExpensesArray([])
        returnedData.expenses = []
        returnedData.totalNumberOfExpenses = 0
        returnedData.location = location
        returnedData.totalExpense = reducedArrayData
        returnedData.averageTransaction = Number((reducedArrayData / expenses.length).toFixed(2))
    
        res.send(returnedData)
      }
    }
  },
  getExpensesPerCategory: async (req, res) => {
    const { category } = req.query
    const returnedData = {}

    const categoryName = await Category.findAll({ where: { categoryID: category }})
    const expenses = await Expense.findAll({ where: { category: category }})
    const reducedArrayData = utils.reduceExpensesArray(expenses)

    returnedData.category = categoryName[0].categoryName
    returnedData.expenses = expenses
    returnedData.totalNumberOfExpenses = expenses.length
    returnedData.totalExpense = reducedArrayData
    returnedData.averageTransaction = Number((reducedArrayData / expenses.length).toFixed(2))

    res.send(returnedData)
  },
  getAllLocations: async (req, res) => {
    const returnedData = {
      listOfLocations: [],
      location: {}
    }
    const expenses = await Expense.findAll()

    for (let i = 0; i < expenses.length; i++) {
      if(returnedData.location[expenses[i].location] === undefined){
        returnedData.listOfLocations.push(expenses[i].location)
        returnedData.location[expenses[i].location] = 1
      } else{
        returnedData.location[expenses[i].location]++
      }      
    }

    res.send(returnedData)
  },
  addExpense: async (req, res) => {
    const { userID, amount, description, day, month, year, location } = req.query
    try{
      await Expense.create({ 
        userID: userID,
        amount: amount,
        location: location,
        description: description,
        day: parseInt(day),
        month: parseInt(month),
        year: parseInt(year)
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
        const { userID, amount, description, day, month, year, location, category } = data[i]
        
        try{
          await Expense.create({ 
            userID: userID,
            amount: amount,
            location: location,
            category: category,
            description: description,
            day: parseInt(day),
            month: parseInt(month),
            year: parseInt(year)
          })
          counter.successCounter++
        } catch(err){
          counter.failedCounter++
        }
      }

      res.send({
        message: `Successfully processed file. Successful: ${counter.successCounter}; Unsuccessful: ${counter.failedCounter}`,
        metaData: counter
      })
    }
    fs.createReadStream('./csvFiles/expensesFile.csv')
      .pipe(csv())
      .on('data', (row) => {
        expenseList.push(row)
      })
      .on('end', () => {
        insertExpenseToDB(expenseList)
      });
  },
  updateExpense: async (req, res) => {
    const { userID, amount, description, day, month, year, location, expenseID } = req.query
    try{
      const originalExpense = await Expense.findAll({ where: { expenseID: expenseID } });
      const updateExpense = {
          userID: userID ? userID : originalExpense[0].userID, 
          amount: amount ? amount : originalExpense[0].amount, 
          description: description ? description : originalExpense[0].description, 
          day: day ? day : originalExpense[0].day, 
          month: month ? month : originalExpense[0].month, 
          year: year ? year : originalExpense[0].year, 
          location: location ? location : originalExpense[0].location
        }
      await Expense.update(  
        updateExpense,
        { where: { expenseID: expenseID } }
      )
      res.send({ message: `Successfully updated Expense: #${expenseID}`})
    }catch(err){
      res.send({ err: `Unable to find Expense: #${expenseID}`})
    }
  },
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
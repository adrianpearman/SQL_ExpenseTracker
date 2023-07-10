// NPM Modules
const { 
  currencyConversion, 
  queryExpenses,
  reduceExpensesArray, 
  updatedExpense 
} = require('../utils');
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
    const { expenseID } = req.body
    const expense = await queryExpenses({ expenseID: expenseID } );
    res.send(expense)
  },
  getExpensePerMonth: async (req, res) => {
    let totalExpenses = 0
    const returnedData = {}
    const { month, year = new Date().getFullYear() } = req.body

    const expenses = await queryExpenses({ month, year })

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
    const { year = new Date().getFullYear() } = req.body
    const returnedData = {}

    const expenses = await queryExpenses({ year });

    for (let i = 0; i < expenses.length; i++) {
      const element = expenses[i];

      if( returnedData[element.month] === undefined ){
        returnedData[element.month] = {
          transactions: [Number(element.amount)],
          averages: element.amount,
          totalExpenses: 1
        }
      } else {
        const expenseItem = returnedData[element.month]
        expenseItem.transactions.push(Number(element.amount))
        const averageTransaction = (expenseItem.transactions.reduce(function(a, b) { return a + b; }, 0)) / expenseItem.transactions.length
        expenseItem.averages = Number(averageTransaction.toFixed(2))
        expenseItem.totalExpenses++
      }
    }

    const reducedArrayData = reduceExpensesArray(expenses)

    returnedData.totalNumberOfExpenses = expenses.length
    returnedData.totalExpense = reducedArrayData
    returnedData.averageTransaction = Number((reducedArrayData / expenses.length).toFixed(2))

    res.send( returnedData )
  },
  getExpensePerLocation: async (req, res) => {
    const { location } = req.body
    const returnedData = {}

    if(!location){
      res.send({ message: "No location provided, please enter a location"})
    }else{
      const expenses = await queryExpenses({ location })
      if(expenses.length !== 0){
        const reducedArrayData = reduceExpensesArray(expenses)
        returnedData.expenses = expenses
        returnedData.totalNumberOfExpenses = expenses.length
        returnedData.location = location
        returnedData.totalExpense = reducedArrayData
        returnedData.averageTransaction = Number((reducedArrayData / expenses.length).toFixed(2))
        res.send(returnedData)
      }else{
        const reducedArrayData = reduceExpensesArray([])
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
    const { category } = req.body
    const returnedData = {}

    const categoryName = await Category.findAll({ where: { categoryID: category }})
    const expenses = await queryExpenses({ category })
    const reducedArrayData = reduceExpensesArray(expenses)

    returnedData.category = categoryName[0].categoryName
    returnedData.expenses = expenses
    returnedData.totalNumberOfExpenses = expenses.length
    returnedData.totalExpense = reducedArrayData
    returnedData.averageTransaction = Number((reducedArrayData / expenses.length).toFixed(2))

    res.send(returnedData)
  },
  getAllExpenseLocations: async (req, res) => {
    const returnedData = {
      listOfLocations: [],
      location: {}
    }
    const expenses = await queryExpenses({})

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
    const { 
      userID, 
      amount, 
      category, 
      description, 
      day, 
      month, 
      year, 
      location,
      currency = 'CAD'
    } = req.body
    
    try{
      const convCurr = await currencyConversion(amount, day, month, year, currency)
      
      if(convCurr.status === "failed"){ throw new Error() }

      await Expense.create({ 
        userID: userID,
        amount: currency === 'CAD' ? amount : convCurr.amount,
        currency: currency,
        category: category,
        location: location,
        description: description,
        day: parseInt(day),
        month: parseInt(month),
        year: parseInt(year)
      })
      return res.send({ message: "Successfully added expense" })
    }catch(err){
      return res.send({ messgage: errorMessage })
    }
  },
  updateExpense: async (req, res) => {
    const { expenseID } = req.body

    try{
      const originalExpense = await Expense.findAll({ where: { expenseID: expenseID } });
      const updatedExpenseData = updatedExpense(req.body, originalExpense)
      await Expense.update(  
        updatedExpenseData,
        { where: { expenseID: expenseID } }
      )
      res.send({ message: `Successfully updated Expense: #${expenseID}`})
    }catch(err){
      res.send({ err: `Unable to find Expense: #${expenseID}`})
    }
  },
  deleteExpense: async (req, res) => {
    const { expenseID } = req.body
    const expense = await Expense.destroy({
      where: { expenseID: expenseID }
    })
    if(expense !== 0){
      res.send({ message: `Successfully deleted ExpenseID: ${expenseID}` })
    } else{
      res.send({ message: `No Expenses available with the ExpenseID of ${expenseID}` })  
    }
  },
  deleteAllExpenses: async (req, res) => {
    // Will need to add some logic to make this an admin function
    // API Key? 
    await Expense.drop()
    await Expense.sync({ force: true });
    res.send({message: "Successfully Cleared Expense Database"})
  },
}

module.exports = expenseController
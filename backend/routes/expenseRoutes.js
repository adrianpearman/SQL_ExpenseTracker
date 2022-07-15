// NPM Modules
const express = require('express');
const router = express.Router({ mergeParams: true });
// Expense Controller 
const {
  addExpense,
  deleteExpense,
  deleteAllExpenses,
  getAllExpenseLocations,
  getAllExpenses,
  getExpense,
  getExpensesPerCategory,
  getExpensePerLocation,
  getExpensePerMonth,
  getExpensePerYear,
  updateExpense,
} = require('../controller/expenseController')

// GET Requests
router.get('/', getAllExpenses)
router.get('/getExpense', getExpense)
router.get('/getExpensePerMonth', getExpensePerMonth)
router.get('/getExpensePerYear', getExpensePerYear)
router.get('/getExpensesPerCategory', getExpensesPerCategory)
router.get('/getExpensesPerLocation', getExpensePerLocation)
router.get('/getLocations', getAllExpenseLocations)
// POST Requests
router.post('/addExpense', addExpense)
// UPDATE Requests
router.patch('/updateExpense', updateExpense)
// DELETE Requests
router.delete('/deleteExpense', deleteExpense)
router.delete('/deleteAllExpenses', deleteAllExpenses)

module.exports = router 
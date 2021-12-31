// NPM Modules
const express = require('express');
const router = express.Router({ mergeParams: true });
// Expense Controller 
const expenseController = require('../controller/expenseController')

// GET Requests
router.get('/', expenseController.getAllExpenses)
router.get('/getExpense', expenseController.getExpense)
router.get('/getExpensePerMonth', expenseController.getExpensePerMonth)
router.get('/getExpensePerYear', expenseController.getExpensePerYear)
router.get('/getExpensesPerCategory', expenseController.getExpensesPerCategory)
router.get('/getExpensesPerLocation', expenseController.getExpensePerLocation)
router.get('/getLocations', expenseController.getAllLocations)
// POST Requests
router.post('/addExpense', expenseController.addExpense)
router.post('/bulkAddExpenses', expenseController.bulkAddExpenses)
// UPDATE Requests
router.patch('/updateExpense', expenseController.updateExpense)
// DELETE Requests
router.delete('/deleteExpense', expenseController.deleteExpense)
router.delete('/deleteAllExpenses', expenseController.deleteAllExpenses)

module.exports = router 
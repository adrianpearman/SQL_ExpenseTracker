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
// POST Requests
router.post('/addExpense', expenseController.addExpense)
router.post('/addBulkExpenses', expenseController.bulkAddExpenses)
// UPDATE Requests
router.patch('/updateExpense', expenseController.updateExpense)
// DELETE Requests
router.delete('/deleteExpense', expenseController.deleteExpense)
router.delete('/deleteAllExpense', expenseController.deleteAllExpenses)

module.exports = router 
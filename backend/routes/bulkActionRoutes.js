// NPM Modules
const express = require('express');
const router = express.Router({ mergeParams: true });
// Expense Controller 
const {
  bulkAddToDB,
  bulkUpdateCSV,
  downloadAllExpenseFile,
  downloadExpensePerRange
} = require('../controller/bulkActionController')

// GET Requests
router.get('/downloadExpenses', downloadAllExpenseFile)
router.get('/downloadRangeOfExpense/:month/:year', downloadExpensePerRange)
// POST Requests
router.post('/bulkAddCategory', bulkAddToDB)
router.post('/bulkAddExpense', bulkAddToDB)
router.post('/bulkUpdateCSV', bulkUpdateCSV)
// UPDATE Requests
// DELETE Requests

module.exports = router 
// NPM Modules
const express = require("express");
const router = express.Router({ mergeParams: true });
// Expense Controller
const {
  bulkAddToDB,
  bulkUpdateCSV,
  downloadAllExpenseFile,
  downloadExpensePerRange,
} = require("../controller/bulkActionController");

// GET Requests
router.get("/api/downloadExpenses", downloadAllExpenseFile);
router.get("/api/downloadRangeOfExpense", downloadExpensePerRange);
// POST Requests
router.post("/api/bulkAddCategory", bulkAddToDB);
router.post("/api/bulkAddExpense", bulkAddToDB);
router.post("/api/bulkUpdateCSV", bulkUpdateCSV);
// UPDATE Requests
// DELETE Requests

module.exports = router;

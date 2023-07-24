// NPM Modules
const express = require("express");
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
} = require("../controller/expenseController");

// GET Requests
router.get("/api/expenses", getAllExpenses);
router.get("/api/getExpense", getExpense);
router.get("/api/getExpensePerMonth", getExpensePerMonth);
router.get("/api/getExpensePerYear", getExpensePerYear);
router.get("/api/getExpensesPerCategory", getExpensesPerCategory);
router.get("/api/getExpensesPerLocation", getExpensePerLocation);
// POST Requests
router.post("/api/addExpense", addExpense);
// UPDATE Requests
router.patch("/api/updateExpense", updateExpense);
// DELETE Requests
router.delete("/api/deleteExpense", deleteExpense);
router.delete("/api/deleteAllExpenses", deleteAllExpenses);

module.exports = router;

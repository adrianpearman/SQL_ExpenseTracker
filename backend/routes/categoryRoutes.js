// NPM Modules
const express = require("express");
const router = express.Router({ mergeParams: true });
// Expense Controller
const {
  addCategory,
  deleteCategory,
  deleteAllCategories,
  getAllCategories,
  updateCategory,
} = require("../controller/categoryController");

// GET Requests
router.get("/api/categories", getAllCategories);
// POST Requests
router.post("/api/addCategory", addCategory);
// UPDATE Requests
router.patch("/api/updateCategory", updateCategory);
// DELETE Requests
router.delete("/api/deleteCategory", deleteCategory);
router.delete("/api/deleteAllCategories", deleteAllCategories);

module.exports = router;

// NPM Modules
const express = require('express');
const router = express.Router({ mergeParams: true });
// Expense Controller 
const {
  addCategory,
  deleteCategory,
  deleteAllCategories,
  getAllCategories,
  updateCategory,
} = require('../controller/categoryController')

// GET Requests
router.get('/categories', getAllCategories)
// POST Requests
router.post('/addCategory', addCategory)
// UPDATE Requests
router.patch('/updateCategory', updateCategory)
// DELETE Requests
router.delete('/deleteCategory', deleteCategory)
router.delete('/deleteAllCategories', deleteAllCategories)

module.exports = router 
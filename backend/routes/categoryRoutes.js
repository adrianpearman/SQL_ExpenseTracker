// NPM Modules
const express = require('express');
const router = express.Router({ mergeParams: true });
// Expense Controller 
const categoryController = require('../controller/categoryController')

// GET Requests
router.get('/categories', categoryController.getAllCategories)
// POST Requests
router.post('/addCategory', categoryController.addCategory)
router.post('/bulkAddCategory', categoryController.bulkAddCategories)
// UPDATE Requests
router.patch('/updateCategory', categoryController.updateCategory)
// DELETE Requests
router.delete('/deleteCategory', categoryController.deleteCategory)
router.delete('/deleteAllCategories', categoryController.deleteAllCategories)

module.exports = router 
const express = require('express')
const adminController = require('../controller/adminController')
const router = express.Router({ mergeParams: true })

// GET
// POST
// UPDATE
// DELETE
router.delete('/resetDatabase', adminController.resetDatabase)

module.exports = router
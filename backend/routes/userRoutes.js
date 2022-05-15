const express = require('express')
const userController = require('../controller/userController')
const router = express.Router({ mergeParams: true })

// GET
router.get('/getUser', userController.getUser)
// POST
// UPDATE
// DELETE
router.delete('/deleteAllUsers', userController.deleteUsers)
router.delete('/resetDatabase', userController.resetDatabase)

module.exports = router
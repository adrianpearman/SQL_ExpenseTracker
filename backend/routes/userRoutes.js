const express = require("express");
const userController = require("../controller/userController");
const router = express.Router({ mergeParams: true });

// GET
router.get("/api/getUser", userController.getUser);
// POST
router.post("/api/createUser", userController.createUser);
// UPDATE
// DELETE
router.delete("/api/deleteAllUsers", userController.deleteUsers);
router.delete("/api/resetDatabase", userController.resetDatabase);

module.exports = router;

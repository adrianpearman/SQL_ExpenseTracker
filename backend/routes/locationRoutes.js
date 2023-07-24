// NPM Modules
const express = require("express");
const router = express.Router({ mergeParams: true });
// Expense Controller
const { getAllLocations } = require("../controller/locationController");

// GET Requests
router.get("/api/getLocations", getAllLocations);
// POST Requests
// UPDATE Requests
// DELETE Requests

module.exports = router;

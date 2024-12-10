const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

// Provider routes
router.use("/providers", require("./providerRoutes"));
// Service routes
router.use("/services", require("./serviceRoutes"));

module.exports = router;

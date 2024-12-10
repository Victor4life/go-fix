const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/authController");
const UserController = require("../controllers/userController");
const ServiceController = require("../controllers/serviceController");
const auth = require("../middleware/auth");

// Auth routes
router.get("/check", AuthController.checkAuth);
router.post("/login", AuthController.login);
router.post("/signup", AuthController.signup);
router.post("/logout", AuthController.logout);

// User routes
router.get("/profile", auth, UserController.getProfile);
router.put("/profile", auth, UserController.updateProfile);
router.patch("/role", auth, UserController.updateRole);
router.delete("/account", auth, UserController.deleteAccount);

// Service routes
router.post("/services", auth, ServiceController.createService);
router.get("/services", ServiceController.getServices);

module.exports = router;

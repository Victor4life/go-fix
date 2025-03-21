const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/authController");
const UserController = require("../controllers/userController");
const ServiceController = require("../controllers/serviceController");
const auth = require("../middleware/auth");
const multer = require("multer");

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Not an image! Please upload an image."), false);
    }
  },
});

// Auth routes
router.get("/check", AuthController.checkAuth);
router.post("/login", AuthController.login);
// Modify the signup route to handle file upload
router.post("/signup", upload.single("profileImage"), AuthController.signup);
router.post("/logout", AuthController.logout);
router.get("/verify/:token", UserController.verifyEmail);

// User routes
router.get("/profile", auth, UserController.getProfile);
router.put("/profile", auth, UserController.updateProfile);
router.patch("/role", auth, UserController.updateRole);
router.delete("/account", auth, UserController.deleteAccount);

// Service routes
router.post("/services", auth, ServiceController.createService);
router.get("/services", ServiceController.getServices);

module.exports = router;

const express = require("express");
const router = express.Router();
const ServiceController = require("../controllers/serviceController");
const auth = require("../middleware/auth");

// Public routes
router.get("/services", ServiceController.getServices);
router.get("/services/search", ServiceController.searchServices);
router.get("/services/:id", ServiceController.getServiceById);

// Protected routes
router.post("/services", auth, ServiceController.createService);
router.put("/services/:id", auth, ServiceController.updateService);
router.delete("/services/:id", auth, ServiceController.deleteService);
router.get("/provider/services", auth, ServiceController.getProviderServices);
router.patch(
  "/services/:id/toggle",
  auth,
  ServiceController.toggleServiceStatus
);

module.exports = router;

const express = require("express");
const router = express.Router();
const Service = require("../models/Service");
const auth = require("../middleware/auth");

// Get all services
router.get("/", async (req, res) => {
  try {
    const services = await Service.find().populate(
      "providerId",
      "businessName contact location"
    );
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get provider's services
router.get("/provider/:providerId", async (req, res) => {
  try {
    const services = await Service.find({
      providerId: req.params.providerId,
    }).populate("providerId", "businessName contact location");
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new service
router.post("/", auth, async (req, res) => {
  try {
    const provider = await ServiceProvider.findOne({ userId: req.user.id });
    if (!provider) {
      return res.status(404).json({ message: "Provider profile not found" });
    }

    const service = new Service({
      providerId: provider._id,
      ...req.body,
    });
    const newService = await service.save();
    res.status(201).json(newService);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update service
router.put("/:id", auth, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    const provider = await ServiceProvider.findOne({ userId: req.user.id });
    if (
      !provider ||
      service.providerId.toString() !== provider._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    Object.assign(service, req.body);
    const updatedService = await service.save();
    res.json(updatedService);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete service
router.delete("/:id", auth, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    const provider = await ServiceProvider.findOne({ userId: req.user.id });
    if (
      !provider ||
      service.providerId.toString() !== provider._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await service.remove();
    res.json({ message: "Service deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

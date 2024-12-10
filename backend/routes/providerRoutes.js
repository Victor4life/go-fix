const express = require("express");
const router = express.Router();
const ServiceProvider = require("../models/ServiceProvider");
const auth = require("../middleware/auth");

// Get all providers
router.get("/", async (req, res) => {
  try {
    const providers = await ServiceProvider.find();
    res.json(providers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get provider by ID
router.get("/:id", async (req, res) => {
  try {
    const provider = await ServiceProvider.findById(req.params.id);
    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }
    res.json(provider);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create provider profile
router.post("/", auth, async (req, res) => {
  try {
    const provider = new ServiceProvider({
      userId: req.user.id,
      ...req.body,
    });
    const newProvider = await provider.save();
    res.status(201).json(newProvider);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update provider profile
router.put("/:id", auth, async (req, res) => {
  try {
    const provider = await ServiceProvider.findById(req.params.id);
    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }
    if (provider.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }
    Object.assign(provider, req.body);
    const updatedProvider = await provider.save();
    res.json(updatedProvider);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;

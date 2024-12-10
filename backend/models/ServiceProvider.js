const mongoose = require("mongoose");

const serviceProviderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
  },
  businessName: {
    type: String,
    required: true,
  },
  services: [
    {
      type: String,
      required: true,
    },
  ],
  description: {
    type: String,
    required: true,
  },
  contact: {
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
  },
  location: {
    type: String,
    required: true,
  },
  availability: [
    {
      type: String,
      required: true,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("ServiceProvider", serviceProviderSchema);

// middleware/auth.js
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;

// routes/provider.js
const express = require("express");
const router = express.Router();
const ServiceProvider = require("../models/ServiceProvider");
const auth = require("../middleware/auth");

// Get provider profile
router.get("/profile", auth, async (req, res) => {
  try {
    const profile = await ServiceProvider.findOne({ userId: req.user.id });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(profile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update provider profile
router.put("/profile", auth, async (req, res) => {
  try {
    const {
      businessName,
      services,
      description,
      contact,
      location,
      availability,
    } = req.body;

    // Validation
    if (
      !businessName ||
      !services?.length ||
      !description ||
      !contact?.email ||
      !contact?.phone ||
      !location ||
      !availability?.length
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Update or create profile
    const profile = await ServiceProvider.findOneAndUpdate(
      { userId: req.user.id },
      {
        businessName,
        services,
        description,
        contact,
        location,
        availability,
        updatedAt: Date.now(),
      },
      { new: true, upsert: true }
    );

    res.json(profile);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

// app.js or index.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const providerRoutes = require("./routes/provider");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/provider", providerRoutes);

// Database connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

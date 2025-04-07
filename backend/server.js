require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
const { sendWelcomeEmail, sendAdminNotification } = require("./emailService");
const path = require("path");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;
const upload = require("./middleware/uploadMiddleware");
const multer = require("multer");

const app = express();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes",
});

// Enhanced CORS configuration
const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 204,
};

// Add this before your middleware setup
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// Add CSP headers here, before other middleware
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; img-src 'self' data:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
  );
  next();
});

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use("/api/", limiter);
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Add this line

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(
      `${new Date().toISOString()} - ${req.method} ${req.path} - ${
        res.statusCode
      } - ${duration}ms`
    );
  });
  next();
});

// Verify environment variables
if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET is not set in environment variables");
  process.exit(1);
}

if (!process.env.MONGODB_URI) {
  console.error("MONGODB_URI is not set in environment variables");
  process.exit(1);
}

// User Schema and Model
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "user",
    },
    profile: {
      skills: [String],
      experience: String,
      hourlyRate: Number,
      availability: String,
      phone: String,
      location: String,
      businessName: String,
      serviceType: String,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

// Authentication Middleware
const authenticateToken = async (req, res, next) => {
  try {
    console.log("Cookies:", req.cookies);
    console.log("Authorization header:", req.headers.authorization);

    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    console.log("Token found:", !!token);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token decoded:", decoded);

    const user = await User.findById(decoded.userId).select("-password");
    console.log("User found:", !!user);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

// MongoDB Connection with timeout handling
mongoose.set("strictQuery", false);

const connectWithRetry = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      heartbeatFrequencyMS: 2000,
      retryWrites: true,
      maxPoolSize: 10,
      minPoolSize: 5,
    });
    console.log("Connected to MongoDB successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    console.log("Retrying connection in 5 seconds...");
    setTimeout(connectWithRetry, 5000);
  }
};

connectWithRetry();

// MongoDB event handlers
mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected. Attempting to reconnect...");
  connectWithRetry();
});

mongoose.connection.on("connected", () => {
  console.log("MongoDB connected");
});

// Routes
// Upload route
app.post("/api/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    res.status(200).json({
      success: true,
      message: "Upload successful",
      imageUrl: req.file.path,
      publicId: req.file.filename,
      fileDetails: {
        originalName: req.file.originalname,
        size: req.file.size,
        mimeType: req.file.mimetype,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      success: false,
      message: "Upload failed",
      error: error.message,
    });
  }
});

// Update the signup route in server.js
app.post(
  "/api/auth/signup",
  upload.single("profileImage"),
  async (req, res) => {
    try {
      // Only log essential non-sensitive information
      console.log("New signup request received");
      console.log("Service type:", req.body.serviceType);
      console.log("Has profile image:", !!req.file);

      const {
        username,
        email,
        password,
        phoneNumber,
        address,
        businessName,
        serviceType,
        experience,
        availability,
      } = req.body;

      // Validate required fields without logging their values
      const missingFields = [];
      if (!username) missingFields.push("username");
      if (!email) missingFields.push("email");
      if (!password) missingFields.push("password");
      if (!phoneNumber) missingFields.push("phoneNumber");
      if (!address) missingFields.push("address");
      if (!businessName) missingFields.push("businessName");
      if (!serviceType) missingFields.push("serviceType");
      if (!experience) missingFields.push("experience");
      if (!availability) missingFields.push("availability");

      if (missingFields.length > 0) {
        console.log("Signup failed: Missing required fields");
        return res.status(400).json({
          success: false,
          message: `Missing required fields: ${missingFields.join(", ")}`,
        });
      }

      const existingUser = await User.findOne({
        $or: [{ email }, { username }],
      });

      if (existingUser) {
        console.log("Signup failed: User already exists");
        return res.status(400).json({
          success: false,
          message: "User already exists",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const user = new User({
        username,
        email,
        password: hashedPassword,
        profile: {
          phone: phoneNumber,
          location: address,
          skills: [],
          experience: experience,
          hourlyRate: 0,
          availability: availability,
          businessName: businessName,
          serviceType: serviceType,
          profileImage: req.file ? req.file.path : null,
        },
      });

      await user.save();
      console.log("New user created successfully");

      // Send welcome email to user and notification to admin
      const emailResults = await Promise.allSettled([
        sendWelcomeEmail(email, username),
        sendAdminNotification({
          username,
          email,
          phoneNumber,
          businessName,
          serviceType,
          address,
        }),
      ]);

      // Log email status without sensitive details
      emailResults.forEach((result, index) => {
        if (result.status === "rejected") {
          console.error(
            `Failed to send ${index === 0 ? "welcome" : "admin"} email`
          );
        }
      });

      res.status(201).json({
        success: true,
        message: "User created successfully",
      });
    } catch (error) {
      console.error("Signup error occurred");
      res.status(500).json({
        success: false,
        message: "Error creating user",
        error:
          process.env.NODE_ENV === "development"
            ? "An error occurred"
            : undefined,
      });
    }
  }
);

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt for email:", email);

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Error during login",
      error: error.message,
    });
  }
});

// Generic Profile Routes
app.get("/api/profile", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json({
      success: true,
      profile: user,
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching profile",
      error: error.message,
    });
  }
});

app.put("/api/profile", authenticateToken, async (req, res) => {
  try {
    console.log("Received update data:", req.body); // Debug incoming data

    // First, get the current user data
    const currentUser = await User.findById(req.user._id);

    // Prepare the update object, maintaining existing values if not provided
    const updates = {
      username: req.body.username || currentUser.username,
      email: req.body.email || currentUser.email,
      profile: {
        ...currentUser.profile.toObject(), // Preserve existing profile data
        phone: req.body.phoneNumber || currentUser.profile.phone,
        location: req.body.address || currentUser.profile.location,
        experience: req.body.experience || currentUser.profile.experience,
        availability: req.body.availability || currentUser.profile.availability,
        skills: req.body.skills || currentUser.profile.skills,
        hourlyRate: req.body.hourlyRate || currentUser.profile.hourlyRate,
        businessName: req.body.businessName || currentUser.profile.businessName,
        serviceType: req.body.serviceType || currentUser.profile.serviceType,
      },
    };

    console.log("Update object to be applied:", updates); // Debug update object

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    console.log("Updated user object:", user); // Debug resulting user object

    res.json({
      success: true,
      message: "Profile updated successfully",
      profile: user,
    });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating profile",
      error: error.message,
    });
  }
});

app.get("/api/auth/check", authenticateToken, async (req, res) => {
  try {
    res.json({
      success: true,
      isAuthenticated: true,
      user: req.user,
    });
  } catch (error) {
    console.error("Auth check error:", error);
    res.status(500).json({
      success: false,
      message: "Error checking authentication status",
    });
  }
});

app.post("/api/auth/logout", (req, res) => {
  res.clearCookie("token");
  res.json({
    success: true,
    message: "Logged out successfully",
  });
});

// Provider Profile Routes
app.get("/api/provider/profile", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json({
      success: true,
      profile: user,
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching profile",
      error: error.message,
    });
  }
});

app.put("/api/provider/profile", authenticateToken, async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true }
    ).select("-password");

    res.json({
      success: true,
      message: "Profile updated successfully",
      profile: user,
    });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating profile",
      error: error.message,
    });
  }
});

// Role update route
app.put("/api/auth/update-role", authenticateToken, async (req, res) => {
  try {
    const { userId, newRole } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role: newRole },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "Role updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update role error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating role",
      error: error.message,
    });
  }
});

// Add this route after your existing routes
app.get("/api/profiles/:categoryName", async (req, res) => {
  try {
    const { categoryName } = req.params;
    console.log("Searching for category:", categoryName); // Debug log

    // Make the search case-insensitive using regex
    const profiles = await User.find({
      "profile.serviceType": new RegExp(categoryName, "i"),
    }).select("-password");

    console.log("Found profiles:", profiles.length); // Debug log

    if (profiles.length === 0) {
      // If no profiles found, let's check what service types exist
      const existingServiceTypes = await User.distinct("profile.serviceType");
      console.log("Existing service types:", existingServiceTypes);

      return res.status(200).json({
        success: true,
        message: "No profiles found for this category",
        data: [],
        availableCategories: existingServiceTypes,
      });
    }

    // Transform the data to match the frontend expectations
    const formattedProfiles = profiles.map((user) => ({
      _id: user._id,
      name: user.username,
      profession: user.profile.serviceType,
      profileImage: user.profile.profileImage,
      bio: user.profile.experience,
      rating: 0,
      reviewCount: 0,
      location: user.profile.location,
      experience: user.profile.experience,
      businessName: user.profile.businessName,
      availability: user.profile.availability,
      hourlyRate: user.profile.hourlyRate,
      skills: user.profile.skills || [],
      // Add these new fields
      email: user.email,
      phoneNumber: user.profile.phone,
    }));

    res.status(200).json({
      success: true,
      count: formattedProfiles.length,
      data: formattedProfiles,
    });
  } catch (error) {
    console.error("Error fetching profiles:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching profiles",
      error: error.message,
    });
  }
});

// Add this route to get all service providers
app.get("/api/profiles", async (req, res) => {
  try {
    const profiles = await User.find({
      "profile.serviceType": { $exists: true },
    }).select("-password");

    const formattedProfiles = profiles.map((user) => ({
      _id: user._id,
      name: user.username,
      profession: user.profile.serviceType,
      profileImage: user.profile.profileImage,
      bio: user.profile.experience,
      rating: 0,
      reviewCount: 0,
      location: user.profile.location,
      experience: user.profile.experience,
      businessName: user.profile.businessName,
      availability: user.profile.availability,
      hourlyRate: user.profile.hourlyRate,
      skills: user.profile.skills || [],
    }));

    res.status(200).json({
      success: true,
      count: formattedProfiles.length,
      data: formattedProfiles,
    });
  } catch (error) {
    console.error("Error fetching profiles:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching profiles",
      error: error.message,
    });
  }
});

// Add a helper route to see all service types
app.get("/api/service-types", async (req, res) => {
  try {
    const serviceTypes = await User.distinct("profile.serviceType");
    res.json({
      success: true,
      data: serviceTypes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching service types",
      error: error.message,
    });
  }
});

// Add this route to get a specific service provider by ID
const serviceRequestRoutes = require("./routes/serviceRequests");
app.use("/api", serviceRequestRoutes);

//Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File is too large. Maximum size is 5MB",
      });
    }
  }
  res.status(500).json({
    success: false,
    message: error.message,
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

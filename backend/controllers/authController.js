const User = require("../models/User");
const jwt = require("jsonwebtoken");

class AuthController {
  static async signup(req, res) {
    try {
      // Debug logs
      console.log("========= DEBUG START =========");
      console.log("Headers:", req.headers);
      console.log("Body:", req.body);
      console.log("Files:", req.files);
      console.log("File:", req.file);
      console.log("Content Type:", req.headers["content-type"]);
      console.log("========= DEBUG END =========");

      const {
        name,
        email,
        password,
        phoneNumber,
        address,
        businessName,
        serviceType,
        experience,
        availability,
        role = "provider",
      } = req.body;

      // Log individual fields
      console.log("Parsed fields:", {
        name,
        email,
        password,
        phoneNumber,
        address,
        businessName,
        serviceType,
        experience,
        availability,
        role,
      });

      // Input validation with detailed logging
      const missingFields = [];
      if (!name) missingFields.push("name");
      if (!email) missingFields.push("email");
      if (!password) missingFields.push("password");
      if (!phoneNumber) missingFields.push("phoneNumber");
      if (!address) missingFields.push("address");
      if (!businessName) missingFields.push("businessName");
      if (!serviceType) missingFields.push("serviceType");
      if (!experience) missingFields.push("experience");
      if (!availability) missingFields.push("availability");

      if (missingFields.length > 0) {
        console.log("Missing fields:", missingFields);
        return res.status(400).json({
          success: false,
          message: `All required fields must be provided. Missing: ${missingFields.join(
            ", "
          )}`,
        });
      }

      // Rest of your existing code...
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "User already exists",
        });
      }

      // Create user profile
      const userProfile = {
        name,
        email,
        password,
        phoneNumber,
        address,
        businessName,
        serviceType,
        experience,
        availability,
        role,
        profileImage: req.file ? req.file.path : null,
      };

      // Create new user
      const user = await User.create(userProfile);

      // Generate JWT token
      const token = jwt.sign(
        {
          id: user._id,
          role: user.role,
          email: user.email,
        },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      // Remove password from response
      const userResponse = user.toObject();
      delete userResponse.password;

      res.status(201).json({
        success: true,
        token,
        user: userResponse,
      });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({
        success: false,
        message: "Error during signup",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;

      // Input validation
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email and password are required",
        });
      }

      // Find user and include all fields
      const user = await User.findOne({ email }).select("+password");

      // Check if user exists and password is correct
      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        {
          id: user._id,
          role: user.role,
          email: user.email,
        },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      // Remove password from response
      const userResponse = user.toObject();
      delete userResponse.password;

      // Update last login timestamp
      await User.findByIdAndUpdate(user._id, {
        lastLogin: new Date(),
      });

      res.json({
        success: true,
        token,
        user: userResponse,
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({
        success: false,
        message: "Login failed",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  // Add refresh token method
  static async refreshToken(req, res) {
    try {
      const { token } = req.body;

      if (!token) {
        return res.status(400).json({
          success: false,
          message: "Token is required",
        });
      }

      // Verify the existing token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find user
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Generate new token
      const newToken = jwt.sign(
        {
          id: user._id,
          role: user.role,
          email: user.email,
        },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      res.json({
        success: true,
        token: newToken,
      });
    } catch (error) {
      console.error("Token refresh error:", error);
      res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }
  }

  // Add logout method
  static async logout(req, res) {
    try {
      // Since JWT is stateless, we can't invalidate the token server-side
      // But we can clear client-side data and optionally blacklist the token

      // If you implement token blacklisting, add the token to blacklist here

      res.json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({
        success: false,
        message: "Logout failed",
      });
    }
  }
}

module.exports = AuthController;

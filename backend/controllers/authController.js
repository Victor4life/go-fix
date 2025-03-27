const User = require("../models/User");
const jwt = require("jsonwebtoken");

class AuthController {
  static async signup(req, res) {
    try {
      console.log("=== START OF SIGNUP PROCESS ===");

      // 1. Log the entire request body
      console.log("1. Request body:", JSON.stringify(req.body, null, 2));

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

      // 2. Log extracted data
      console.log("2. Extracted data:", {
        name,
        email,
        phoneNumber,
        address,
        businessName,
        serviceType,
        experience,
        availability,
        role,
      });

      // 3. Check database BEFORE any operation
      console.log("3. Checking database for ALL users");
      const allUsers = await User.find({});
      console.log(
        "Current users in database:",
        allUsers.map((u) => ({
          email: u.email,
          name: u.name,
        }))
      );

      // 4. Explicitly check for the email
      console.log("4. Checking specifically for email:", email);
      const existingUser = await User.findOne({ email: email });
      console.log("Existing user check result:", existingUser);

      if (existingUser) {
        console.log("5. Found existing user with email:", email);
        return res.status(400).json({
          success: false,
          message: "User already exists",
          debug: {
            existingUserId: existingUser._id,
            existingUserEmail: existingUser.email,
          },
        });
      }

      console.log("6. No existing user found, proceeding with creation");

      // Create user profile
      const userProfile = {
        name,
        email: email.toLowerCase(),
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

      console.log("7. Attempting to create user with profile:", {
        ...userProfile,
        password: "[HIDDEN]",
      });

      // Create new user
      const user = await User.create(userProfile);
      console.log("8. User created successfully:", user._id);

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

      console.log("9. JWT token generated successfully");

      // Remove password from response
      const userResponse = user.toObject();
      delete userResponse.password;

      console.log("=== END OF SIGNUP PROCESS ===");

      res.status(201).json({
        success: true,
        token,
        user: userResponse,
      });
    } catch (error) {
      console.error("Signup error:", {
        message: error.message,
        stack: error.stack,
        name: error.name,
      });
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

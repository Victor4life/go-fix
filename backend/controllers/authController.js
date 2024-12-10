const User = require("../models/User");
const jwt = require("jsonwebtoken");

class AuthController {
  static async signup(req, res) {
    try {
      const {
        email,
        password,
        name,
        role, // 'provider' or 'seeker'
        // Provider specific fields
        skills,
        experience,
        hourlyRate,
        availability,
        // Seeker specific fields
        company,
        industry,
        projectDescription,
        budget,
      } = req.body;

      // Input validation
      if (!email || !password || !name || !role) {
        return res.status(400).json({
          success: false,
          message: "Required fields missing",
        });
      }

      // Validate role
      if (!["provider", "seeker"].includes(role)) {
        return res.status(400).json({
          success: false,
          message: "Invalid role specified",
        });
      }

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "User already exists",
        });
      }

      // Create user profile based on role
      let userProfile = {
        email,
        password,
        name,
        role,
      };

      // Add role-specific fields
      if (role === "provider") {
        // Validate provider-specific fields
        if (!skills || !experience || !hourlyRate) {
          return res.status(400).json({
            success: false,
            message: "Missing required provider fields",
          });
        }

        userProfile = {
          ...userProfile,
          skills,
          experience,
          hourlyRate,
          availability,
        };
      } else if (role === "seeker") {
        // Validate seeker-specific fields
        if (!company || !industry || !projectDescription || !budget) {
          return res.status(400).json({
            success: false,
            message: "Missing required seeker fields",
          });
        }

        userProfile = {
          ...userProfile,
          company,
          industry,
          projectDescription,
          budget,
        };
      }

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

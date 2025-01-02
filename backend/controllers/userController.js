const User = require("../models/User");

class UserController {
  // Get user profile
  static async getProfile(req, res) {
    try {
      const user = await User.findById(req.user.id).select("-password");

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.json({
        success: true,
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          role: user.role || "provider", // Default to provider if role not set
          company: user.company,
          industry: user.industry,
          projectDescription: user.projectDescription,
          budget: user.budget,
          skills: user.skills,
          experience: user.experience,
          hourlyRate: user.hourlyRate,
          availability: user.availability,
          contact: user.contact,
          location: user.location,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      });
    } catch (error) {
      console.error("Error in getProfile:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching profile",
        error: error.message,
      });
    }
  }

  // Update user profile
  static async updateProfile(req, res) {
    try {
      const {
        name,
        email,
        role,
        company,
        industry,
        projectDescription,
        budget,
        skills,
        experience,
        hourlyRate,
        availability,
        contact,
        location,
        businessName,
        serviceType,
        phoneNumber, // Add this
      } = req.body;

      // Build update object
      let updateData = {
        username: name, // Map name to username
        email,
        businessName, // Add at root level
        serviceType, // Add at root level
        profile: {
          // Nest these fields under profile
          phone: phoneNumber,
          location,
          experience,
          availability,
          businessName, // Also include in profile
          serviceType, // Also include in profile
        },
      };

      // Remove undefined fields from profile
      Object.keys(updateData.profile).forEach(
        (key) =>
          updateData.profile[key] === undefined &&
          delete updateData.profile[key]
      );

      // Remove undefined fields from root
      Object.keys(updateData).forEach(
        (key) => updateData[key] === undefined && delete updateData[key]
      );

      const user = await User.findByIdAndUpdate(
        req.user.id,
        { $set: updateData },
        { new: true, runValidators: true }
      ).select("-password");

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Format the response to match the expected structure
      res.json({
        success: true,
        message: "Profile updated successfully",
        profile: {
          _id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          businessName: user.businessName,
          serviceType: user.serviceType,
          profile: {
            phone: user.profile?.phone,
            location: user.profile?.location,
            experience: user.profile?.experience,
            availability: user.profile?.availability,
            skills: user.profile?.skills || [],
          },
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      });
    } catch (error) {
      console.error("Error in updateProfile:", error);
      res.status(500).json({
        success: false,
        message: "Error updating profile",
        error: error.message,
      });
    }
  }

  // Update user role
  static async updateRole(req, res) {
    try {
      const { role } = req.body;

      if (!role || !["provider", "seeker"].includes(role)) {
        return res.status(400).json({
          success: false,
          message: "Invalid role specified",
        });
      }

      const user = await User.findByIdAndUpdate(
        req.user.id,
        { role },
        { new: true }
      ).select("-password");

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.json({
        success: true,
        message: "Role updated successfully",
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("Error in updateRole:", error);
      res.status(500).json({
        success: false,
        message: "Error updating role",
        error: error.message,
      });
    }
  }

  // Delete user account
  static async deleteAccount(req, res) {
    try {
      const user = await User.findByIdAndDelete(req.user.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.json({
        success: true,
        message: "Account deleted successfully",
      });
    } catch (error) {
      console.error("Error in deleteAccount:", error);
      res.status(500).json({
        success: false,
        message: "Error deleting account",
        error: error.message,
      });
    }
  }

  // Add new methods

  // Get all providers
  static async getAllProviders(req, res) {
    try {
      const providers = await User.find({ role: "provider" })
        .select("-password")
        .sort({ createdAt: -1 });

      res.json({
        success: true,
        count: providers.length,
        providers,
      });
    } catch (error) {
      console.error("Error in getAllProviders:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching providers",
        error: error.message,
      });
    }
  }

  // Get all seekers
  static async getAllSeekers(req, res) {
    try {
      const seekers = await User.find({ role: "seeker" })
        .select("-password")
        .sort({ createdAt: -1 });

      res.json({
        success: true,
        count: seekers.length,
        seekers,
      });
    } catch (error) {
      console.error("Error in getAllSeekers:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching seekers",
        error: error.message,
      });
    }
  }

  // Search users by criteria
  static async searchUsers(req, res) {
    try {
      const { role, skills, location, hourlyRateMin, hourlyRateMax, industry } =
        req.query;

      let query = {};

      if (role) query.role = role;
      if (location) query.location = new RegExp(location, "i");
      if (skills)
        query.skills = {
          $in: skills.split(",").map((skill) => new RegExp(skill.trim(), "i")),
        };
      if (hourlyRateMin || hourlyRateMax) {
        query.hourlyRate = {};
        if (hourlyRateMin) query.hourlyRate.$gte = parseInt(hourlyRateMin);
        if (hourlyRateMax) query.hourlyRate.$lte = parseInt(hourlyRateMax);
      }
      if (industry) query.industry = new RegExp(industry, "i");

      const users = await User.find(query)
        .select("-password")
        .sort({ createdAt: -1 });

      res.json({
        success: true,
        count: users.length,
        users,
      });
    } catch (error) {
      console.error("Error in searchUsers:", error);
      res.status(500).json({
        success: false,
        message: "Error searching users",
        error: error.message,
      });
    }
  }

  // Update user status
  static async updateStatus(req, res) {
    try {
      const { status } = req.body;

      if (!["active", "inactive"].includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid status specified",
        });
      }

      const user = await User.findByIdAndUpdate(
        req.user.id,
        { status },
        { new: true }
      ).select("-password");

      res.json({
        success: true,
        message: "Status updated successfully",
        user,
      });
    } catch (error) {
      console.error("Error in updateStatus:", error);
      res.status(500).json({
        success: false,
        message: "Error updating status",
        error: error.message,
      });
    }
  }
}

module.exports = UserController;

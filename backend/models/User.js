const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: validator.isEmail,
        message: "Please provide a valid email",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    role: {
      type: String,
      enum: {
        values: ["provider", "seeker"],
        message: "Role must be either provider or seeker",
      },
      required: true,
      default: "provider",
    },
    profile: {
      phone: {
        type: String,
        trim: true,
      },
      location: {
        type: String,
        trim: true,
      },
      businessName: {
        type: String,
        trim: true,
      },
      serviceType: {
        type: String,
        trim: true,
      },
      experience: {
        type: String,
        trim: true,
      },
      availability: {
        type: String,
        trim: true,
      },
      skills: [
        {
          type: String,
          trim: true,
        },
      ],
    },
    profileComplete: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// userSchema methods
userSchema.methods.updateProfile = async function (updateData) {
  // Direct field updates
  if (updateData.username) this.name = updateData.username;
  if (updateData.email) this.email = updateData.email;

  // Handle nested profile data
  if (updateData.profile) {
    if (!this.profile) {
      this.profile = {};
    }

    // Update profile fields
    this.profile = {
      ...this.profile,
      phone: updateData.profile.phone || this.profile.phone,
      location: updateData.profile.location || this.profile.location,
      businessName:
        updateData.profile.businessName || this.profile.businessName,
      serviceType: updateData.profile.serviceType || this.profile.serviceType,
      experience: updateData.profile.experience || this.profile.experience,
      availability:
        updateData.profile.availability || this.profile.availability,
      skills: updateData.profile.skills || this.profile.skills || [],
    };
  }

  this.updatedAt = Date.now();
  return await this.save();
};

// Indexes for better query performance
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Update profileComplete status before saving
userSchema.pre("save", function (next) {
  if (this.role === "provider") {
    this.profileComplete = !!(
      this.profile?.businessName &&
      this.profile?.serviceType &&
      this.profile?.experience &&
      this.profile?.availability
    );
  } else {
    // For seekers or other roles
    this.profileComplete = !!(this.name && this.email && this.profile?.phone);
  }
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Generate Password Reset Token
userSchema.methods.generateResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

  return resetToken;
};

// Virtual for full name
userSchema.virtual("fullName").get(function () {
  return `${this.name}`;
});

// Instance method to get public profile
userSchema.methods.getPublicProfile = function () {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.resetPasswordToken;
  delete userObject.resetPasswordExpire;
  return userObject;
};

// Static method to get active providers
userSchema.statics.getActiveProviders = function () {
  return this.find({ role: "provider", active: true });
};

// Static method to get active seekers
userSchema.statics.getActiveSeekers = function () {
  return this.find({ role: "seeker", active: true });
};

const User = mongoose.model("User", userSchema);

module.exports = User;

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
      select: false, // Won't include password in queries by default
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
    // Provider specific fields
    skills: [
      {
        type: String,
        trim: true,
        required: function () {
          return this.role === "provider";
        },
        validate: {
          validator: function (value) {
            return value.length > 0;
          },
          message: "At least one skill is required for providers",
        },
      },
    ],
    experience: {
      type: String,
      required: function () {
        return this.role === "provider";
      },
      trim: true,
      minlength: [10, "Experience description must be at least 10 characters"],
    },
    hourlyRate: {
      type: Number,
      required: function () {
        return this.role === "provider";
      },
      min: [0, "Hourly rate cannot be negative"],
      validate: {
        validator: Number.isInteger,
        message: "Hourly rate must be a whole number",
      },
    },
    availability: {
      type: String,
      required: function () {
        return this.role === "provider";
      },
      enum: {
        values: ["full-time", "part-time", "contract", "flexible"],
        message: "Invalid availability option",
      },
    },
    // Seeker specific fields
    company: {
      type: String,
      required: function () {
        return this.role === "seeker";
      },
      trim: true,
      minlength: [2, "Company name must be at least 2 characters"],
    },
    industry: {
      type: String,
      required: function () {
        return this.role === "seeker";
      },
      trim: true,
    },
    projectDescription: {
      type: String,
      required: function () {
        return this.role === "seeker";
      },
      trim: true,
      minlength: [20, "Project description must be at least 20 characters"],
    },
    budget: {
      type: Number,
      required: function () {
        return this.role === "seeker";
      },
      min: [0, "Budget cannot be negative"],
    },
    // Common fields
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
    timestamps: true, // Automatically handle updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

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
      this.skills.length &&
      this.experience &&
      this.hourlyRate &&
      this.availability
    );
  } else if (this.role === "seeker") {
    this.profileComplete = !!(
      this.company &&
      this.industry &&
      this.projectDescription &&
      this.budget
    );
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

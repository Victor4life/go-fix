const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceProvider",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["development", "design", "marketing", "writing", "other"],
    },
    pricing: {
      amount: {
        type: Number,
        required: true,
      },
      unit: {
        type: String,
        enum: ["hour", "project", "day", "month"],
        default: "hour",
      },
    },
    availability: {
      type: String,
      enum: ["immediate", "1-3 days", "3-7 days", "1-2 weeks", "2+ weeks"],
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "pending"],
      default: "active",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Add indexes for better search performance
serviceSchema.index({ name: "text", description: "text" });
serviceSchema.index({ category: 1, status: 1 });
serviceSchema.index({ providerId: 1 });

module.exports = mongoose.model("Service", serviceSchema);

const mongoose = require("mongoose");

const userProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sign",
      required: true,
      unique: true,
    },

    phone: {
      type: String,
      required: true,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },
    
    birthday: {
      type: Date,
    },

    age: {
      type: Number,
    },

    address1: {
      type: String,
      required: true,
    },

    address2: {
      type: String,
    },

    city: {
      type: String,
      required: true,
    },

    pincode: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },

    profileImage: {
      type: String,
    },
  },
    { timestamps: true },
);
module.exports = mongoose.model("UserProfile", userProfileSchema);
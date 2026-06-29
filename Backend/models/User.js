const mongoose = require("mongoose");

/**
 * User Model
 *
 * Stores registered user accounts. Used for authentication and
 * linking orders to users.
 *
 * Fields:
 * - fullName:   Display name shown in UI and order receipts
 * - email:      Unique login identifier, stored lowercase for consistency
 * - phone:      Unique login identifier (supports email OR phone login)
 * - password:   Bcrypt-hashed, never returned in API responses
 * - address:    Default delivery address (can be overridden at checkout)
 * - role:       "user" or "admin" — controls access to admin endpoints
 * - isVerified: Reserved for future email/phone verification flow
 */
const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    address: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;

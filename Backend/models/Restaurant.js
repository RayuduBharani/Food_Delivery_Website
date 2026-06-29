const mongoose = require("mongoose");

/**
 * Restaurant Model
 *
 * Represents a restaurant that users can order food from.
 *
 * Fields:
 * - name:         Restaurant name displayed on cards and detail pages
 * - image:        URL to the restaurant's cover/hero image
 * - cuisine:      Array of cuisine types (e.g., ["North Indian", "Chinese"])
 *                 — an array because most restaurants serve multiple cuisines
 * - rating:       Average customer rating (1.0–5.0), used for sorting/display
 * - deliveryTime: Estimated delivery time in minutes (e.g., 30)
 * - address:      Restaurant's physical address
 * - isOpen:       Whether the restaurant is currently accepting orders
 *                 — allows toggling availability without deleting the record
 */
const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Restaurant name is required"],
      trim: true,
    },
    image: {
      type: String,
      required: [true, "Restaurant image URL is required"],
    },
    cuisine: {
      type: [String],
      required: [true, "At least one cuisine type is required"],
    },
    rating: {
      type: Number,
      default: 4.0,
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },
    deliveryTime: {
      type: Number, // minutes
      required: [true, "Delivery time is required"],
    },
    address: {
      type: String,
      default: "",
    },
    isOpen: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

module.exports = Restaurant;

const mongoose = require("mongoose");

/**
 * MenuItem Model
 *
 * Represents a single dish on a restaurant's menu.
 *
 * Fields:
 * - restaurantId:  References the parent Restaurant document.
 *                  This foreign key enables fetching all items for a restaurant.
 * - name:          Dish name (e.g., "Butter Chicken")
 * - description:   Short description shown on the menu card
 * - image:         URL to the dish photo
 * - price:         Price in INR (stored as Number for calculations)
 * - category:      Groups items in the menu (e.g., "Starters", "Main Course")
 *                  — used to render category headers on the detail page
 * - isAvailable:   Toggle availability without deleting the item
 *                  — useful when an item is temporarily out of stock
 */
const menuItemSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: [true, "Restaurant reference is required"],
      index: true, // Index for fast lookups by restaurant
    },
    name: {
      type: String,
      required: [true, "Item name is required"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const MenuItem = mongoose.model("MenuItem", menuItemSchema);

module.exports = MenuItem;

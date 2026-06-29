const mongoose = require("mongoose");

/**
 * Order Model
 *
 * Represents a customer's food order. Items are embedded (denormalized)
 * rather than referenced — this is intentional because:
 * 1. Menu prices can change, but the order should reflect the price at
 *    the time of purchase.
 * 2. Menu items can be deleted, but historical orders should remain intact.
 *
 * Fields:
 * - userId:        Optional ref to User — allows guest checkout
 * - customerName:  Name for the delivery (may differ from account name)
 * - phone:         Contact number for delivery updates
 * - address:       Delivery address for this specific order
 * - items:         Array of ordered items with name, price, quantity snapshot
 * - subtotal:      Sum of (price × quantity) for all items
 * - deliveryFee:   Delivery charge (can be 0 for free delivery promotions)
 * - total:         subtotal + deliveryFee (final amount the customer pays)
 * - status:        Order lifecycle state, updated by the restaurant/admin
 * - paymentMethod: How the customer intends to pay
 */

const orderItemSchema = new mongoose.Schema(
  {
    menuItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MenuItem",
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, "Quantity must be at least 1"],
    },
    image: {
      type: String,
      default: "",
    },
  },
  { _id: false } // Sub-documents don't need their own _id
);

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null, // Null = guest checkout
    },
    customerName: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
    },
    address: {
      type: String,
      required: [true, "Delivery address is required"],
    },
    items: {
      type: [orderItemSchema],
      validate: {
        validator: (v) => Array.isArray(v) && v.length > 0,
        message: "Order must contain at least one item",
      },
    },
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
    },
    restaurantName: {
      type: String,
      default: "",
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    deliveryFee: {
      type: Number,
      default: 40,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["placed", "confirmed", "preparing", "out_for_delivery", "delivered", "cancelled"],
      default: "placed",
    },
    paymentMethod: {
      type: String,
      enum: ["cod", "online"],
      default: "cod",
    },
  },
  {
    timestamps: true, // createdAt = order placed time
  }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;

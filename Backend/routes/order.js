const express = require("express");
const router = express.Router();
const { optionalAuth, protect } = require("../middleware/authMiddleware");
const {
  placeOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
} = require("../controllers/orderController");

/**
 * Order Routes
 *
 * POST   /api/orders              — Place a new order (guest OR logged-in user)
 * GET    /api/orders              — List orders (filtered by userId for user panel)
 * GET    /api/orders/:id          — Get a single order
 * PATCH  /api/orders/:id/status   — Update status (admin — handled via admin routes)
 */

// optionalAuth: reads JWT if present so req.user is set for logged-in users,
// but does NOT block guests — enabling both guest checkout and user-linked orders
router.post("/", optionalAuth, placeOrder);

// protect: user must be logged in to view their own order history
router.get("/", protect, getAllOrders);

router.get("/:id", protect, getOrderById);
router.patch("/:id/status", updateOrderStatus);

module.exports = router;

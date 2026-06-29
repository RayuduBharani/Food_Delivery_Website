const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middleware/authMiddleware");
const {
  getStats,
  getAllOrders, updateOrderStatus,
  getRestaurants, createRestaurant, updateRestaurant, deleteRestaurant,
  getMenuItems, createMenuItem, updateMenuItem, deleteMenuItem,
  getUsers,
} = require("../controllers/adminController");

// All admin routes require authentication AND admin role
router.use(protect, adminOnly);

// Dashboard
router.get("/stats", getStats);

// Orders
router.get("/orders", getAllOrders);
router.patch("/orders/:id/status", updateOrderStatus);

// Restaurants
router.get("/restaurants", getRestaurants);
router.post("/restaurants", createRestaurant);
router.patch("/restaurants/:id", updateRestaurant);
router.delete("/restaurants/:id", deleteRestaurant);

// Menu Items (scoped to a restaurant)
router.get("/restaurants/:id/menu", getMenuItems);
router.post("/restaurants/:id/menu", createMenuItem);

// Menu Items (by item ID)
router.patch("/menu/:id", updateMenuItem);
router.delete("/menu/:id", deleteMenuItem);

// Users
router.get("/users", getUsers);

module.exports = router;

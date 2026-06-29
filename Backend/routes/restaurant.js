const express = require("express");
const router = express.Router();
const {
  getAllRestaurants,
  getRestaurantById,
  getMenuByRestaurant,
} = require("../controllers/restaurantController");

/**
 * Restaurant Routes
 *
 * GET  /api/restaurants           — List all restaurants (search, filter, paginate)
 * GET  /api/restaurants/:id       — Get single restaurant with menu
 * GET  /api/restaurants/:id/menu  — Get menu items only (grouped by category)
 */
router.get("/", getAllRestaurants);
router.get("/:id", getRestaurantById);
router.get("/:id/menu", getMenuByRestaurant);

module.exports = router;

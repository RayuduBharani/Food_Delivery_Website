const Restaurant = require("../models/Restaurant");
const MenuItem = require("../models/MenuItem");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

/**
 * @desc    Get all restaurants (with optional search & cuisine filter)
 * @route   GET /api/restaurants
 * @access  Public
 *
 * Query params:
 *   ?search=spice        — searches by name (case-insensitive)
 *   ?cuisine=Chinese     — filters by cuisine type
 *   ?page=1&limit=10     — pagination
 */
const getAllRestaurants = asyncHandler(async (req, res) => {
  const { search, cuisine, page = 1, limit = 12 } = req.query;

  // Build dynamic filter object
  const filter = {};

  if (search) {
    // Case-insensitive partial match on restaurant name
    filter.name = { $regex: search, $options: "i" };
  }

  if (cuisine) {
    // Match any restaurant that has this cuisine in its array
    filter.cuisine = { $in: [new RegExp(cuisine, "i")] };
  }

  // Pagination
  const skip = (Number(page) - 1) * Number(limit);
  const total = await Restaurant.countDocuments(filter);

  const restaurants = await Restaurant.find(filter)
    .sort({ rating: -1 }) // Best rated first
    .skip(skip)
    .limit(Number(limit));

  res.status(200).json({
    success: true,
    count: restaurants.length,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / Number(limit)),
    data: restaurants,
  });
});

/**
 * @desc    Get a single restaurant by ID (with its menu items)
 * @route   GET /api/restaurants/:id
 * @access  Public
 */
const getRestaurantById = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id);

  if (!restaurant) {
    throw new ApiError(404, "Restaurant not found");
  }

  // Fetch menu items for this restaurant
  const menuItems = await MenuItem.find({
    restaurantId: restaurant._id,
    isAvailable: true,
  }).sort({ category: 1, name: 1 });

  res.status(200).json({
    success: true,
    data: {
      restaurant,
      menuItems,
    },
  });
});

/**
 * @desc    Get menu items for a specific restaurant
 * @route   GET /api/restaurants/:id/menu
 * @access  Public
 *
 * Query params:
 *   ?category=Starters   — filter by category
 */
const getMenuByRestaurant = asyncHandler(async (req, res) => {
  // Verify restaurant exists
  const restaurant = await Restaurant.findById(req.params.id);
  if (!restaurant) {
    throw new ApiError(404, "Restaurant not found");
  }

  const filter = { restaurantId: req.params.id };

  if (req.query.category) {
    filter.category = { $regex: req.query.category, $options: "i" };
  }

  const menuItems = await MenuItem.find(filter).sort({ category: 1, name: 1 });

  // Group items by category for easier frontend rendering
  const grouped = menuItems.reduce((acc, item) => {
    const cat = item.category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  res.status(200).json({
    success: true,
    count: menuItems.length,
    data: menuItems,
    grouped,
  });
});

module.exports = { getAllRestaurants, getRestaurantById, getMenuByRestaurant };

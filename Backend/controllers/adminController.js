const Order = require("../models/Order");
const Restaurant = require("../models/Restaurant");
const MenuItem = require("../models/MenuItem");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

// ─────────────────────────────────────────────────────────────────────────────
//  DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @desc  Get admin dashboard stats
 * @route GET /api/admin/stats
 * @access Admin
 */
const getStats = asyncHandler(async (_req, res) => {
  const [
    totalOrders,
    totalRestaurants,
    totalUsers,
    revenueAgg,
    ordersByStatus,
    recentOrders,
  ] = await Promise.all([
    Order.countDocuments(),
    Restaurant.countDocuments(),
    User.countDocuments({ role: "user" }),
    Order.aggregate([
      { $match: { status: { $ne: "cancelled" } } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]),
    Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),
    Order.find().sort({ createdAt: -1 }).limit(5).select("customerName total status createdAt"),
  ]);

  const totalRevenue = revenueAgg[0]?.total || 0;
  const statusMap = {};
  ordersByStatus.forEach(({ _id, count }) => { statusMap[_id] = count; });

  res.json({
    success: true,
    data: {
      totalOrders,
      totalRestaurants,
      totalUsers,
      totalRevenue,
      ordersByStatus: statusMap,
      recentOrders,
    },
  });
});

// ─────────────────────────────────────────────────────────────────────────────
//  ORDERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @desc  Get all orders with pagination + status filter
 * @route GET /api/admin/orders
 */
const getAllOrders = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const filter = status ? { status } : {};
  const skip = (Number(page) - 1) * Number(limit);

  const [orders, total] = await Promise.all([
    Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Order.countDocuments(filter),
  ]);

  res.json({
    success: true,
    count: orders.length,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / Number(limit)),
    data: orders,
  });
});

/**
 * @desc  Update order status
 * @route PATCH /api/admin/orders/:id/status
 */
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const VALID = ["placed", "confirmed", "preparing", "out_for_delivery", "delivered", "cancelled"];

  if (!status || !VALID.includes(status)) {
    throw new ApiError(400, `Invalid status. Must be one of: ${VALID.join(", ")}`);
  }

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status },
    { returnDocument: "after", runValidators: true }
  );
  if (!order) throw new ApiError(404, "Order not found");

  res.json({ success: true, message: `Order status → "${status}"`, data: order });
});

// ─────────────────────────────────────────────────────────────────────────────
//  RESTAURANTS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @desc  Get all restaurants (admin view — includes closed ones)
 * @route GET /api/admin/restaurants
 */
const getRestaurants = asyncHandler(async (_req, res) => {
  const restaurants = await Restaurant.find().sort({ createdAt: -1 });
  res.json({ success: true, count: restaurants.length, data: restaurants });
});

/**
 * @desc  Create a new restaurant
 * @route POST /api/admin/restaurants
 */
const createRestaurant = asyncHandler(async (req, res) => {
  const { name, image, cuisine, rating, deliveryTime, address, isOpen } = req.body;
  if (!name || !image || !cuisine || !deliveryTime) {
    throw new ApiError(400, "name, image, cuisine, and deliveryTime are required");
  }
  const restaurant = await Restaurant.create({ name, image, cuisine, rating, deliveryTime, address, isOpen });
  res.status(201).json({ success: true, message: "Restaurant created", data: restaurant });
});

/**
 * @desc  Update a restaurant
 * @route PATCH /api/admin/restaurants/:id
 */
const updateRestaurant = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!restaurant) throw new ApiError(404, "Restaurant not found");
  res.json({ success: true, message: "Restaurant updated", data: restaurant });
});

/**
 * @desc  Delete a restaurant and its menu items
 * @route DELETE /api/admin/restaurants/:id
 */
const deleteRestaurant = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findByIdAndDelete(req.params.id);
  if (!restaurant) throw new ApiError(404, "Restaurant not found");
  await MenuItem.deleteMany({ restaurantId: req.params.id });
  res.json({ success: true, message: "Restaurant and its menu items deleted" });
});

// ─────────────────────────────────────────────────────────────────────────────
//  MENU ITEMS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @desc  Get all menu items for a restaurant
 * @route GET /api/admin/restaurants/:id/menu
 */
const getMenuItems = asyncHandler(async (req, res) => {
  const items = await MenuItem.find({ restaurantId: req.params.id }).sort({ category: 1, name: 1 });
  res.json({ success: true, count: items.length, data: items });
});

/**
 * @desc  Create a new menu item
 * @route POST /api/admin/restaurants/:id/menu
 */
const createMenuItem = asyncHandler(async (req, res) => {
  const { name, description, price, category, image, isAvailable } = req.body;
  if (!name || !price || !category) throw new ApiError(400, "name, price, and category are required");

  const restaurant = await Restaurant.findById(req.params.id);
  if (!restaurant) throw new ApiError(404, "Restaurant not found");

  const item = await MenuItem.create({
    restaurantId: req.params.id,
    name, description, price, category, image, isAvailable,
  });
  res.status(201).json({ success: true, message: "Menu item created", data: item });
});

/**
 * @desc  Update a menu item
 * @route PATCH /api/admin/menu/:id
 */
const updateMenuItem = asyncHandler(async (req, res) => {
  const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!item) throw new ApiError(404, "Menu item not found");
  res.json({ success: true, message: "Menu item updated", data: item });
});

/**
 * @desc  Delete a menu item
 * @route DELETE /api/admin/menu/:id
 */
const deleteMenuItem = asyncHandler(async (req, res) => {
  const item = await MenuItem.findByIdAndDelete(req.params.id);
  if (!item) throw new ApiError(404, "Menu item not found");
  res.json({ success: true, message: "Menu item deleted" });
});

// ─────────────────────────────────────────────────────────────────────────────
//  USERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @desc  Get all users (excluding passwords)
 * @route GET /api/admin/users
 */
const getUsers = asyncHandler(async (_req, res) => {
  const users = await User.find({ role: "user" }).select("-password").sort({ createdAt: -1 });
  res.json({ success: true, count: users.length, data: users });
});

module.exports = {
  getStats,
  getAllOrders, updateOrderStatus,
  getRestaurants, createRestaurant, updateRestaurant, deleteRestaurant,
  getMenuItems, createMenuItem, updateMenuItem, deleteMenuItem,
  getUsers,
};

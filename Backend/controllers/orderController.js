const Order = require("../models/Order");
const MenuItem = require("../models/MenuItem");
const Restaurant = require("../models/Restaurant");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

/**
 * @desc    Place a new order
 * @route   POST /api/orders
 * @access  Public (guest checkout) or Authenticated
 *
 * Request body:
 * {
 *   customerName: "John Doe",
 *   phone: "+91 98765 43210",
 *   address: "123 Main St",
 *   items: [{ menuItem: "ObjectId", quantity: 2 }, ...],
 *   paymentMethod: "cod"
 * }
 *
 * Server-side responsibilities:
 * - Validates that all menu item IDs exist
 * - Fetches current prices from the database (never trusts client prices)
 * - Calculates subtotal and total server-side (prevents price manipulation)
 */
const placeOrder = asyncHandler(async (req, res) => {
  const { customerName, phone, address, items, paymentMethod } = req.body;

  // ── Validation ─────────────────────────────────────────────────
  if (!customerName || !phone || !address) {
    throw new ApiError(400, "Customer name, phone, and address are required");
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new ApiError(400, "Order must contain at least one item");
  }

  // ── Fetch actual menu items from DB ────────────────────────────
  const menuItemIds = items.map((i) => i.menuItem);
  const dbItems = await MenuItem.find({ _id: { $in: menuItemIds } });

  if (dbItems.length !== menuItemIds.length) {
    throw new ApiError(400, "One or more menu items are invalid");
  }

  // ── Build order items with server-side prices ─────────────────
  let subtotal = 0;
  const orderItems = items.map((item) => {
    const dbItem = dbItems.find((d) => d._id.toString() === item.menuItem);
    if (!dbItem) throw new ApiError(400, `Menu item ${item.menuItem} not found`);
    if (!dbItem.isAvailable) {
      throw new ApiError(400, `"${dbItem.name}" is currently unavailable`);
    }

    const lineTotal = dbItem.price * item.quantity;
    subtotal += lineTotal;

    return {
      menuItem: dbItem._id,
      name: dbItem.name,
      price: dbItem.price,
      quantity: item.quantity,
      image: dbItem.image,
    };
  });

  const deliveryFee = subtotal >= 500 ? 0 : 40; // Free delivery on orders ≥ ₹500
  const total = subtotal + deliveryFee;

  // ── Determine restaurant (all items should be from same restaurant)
  const restaurantId = dbItems[0].restaurantId;
  const restaurant = await Restaurant.findById(restaurantId).select("name");
  const restaurantName = restaurant?.name || "";

  // ── Create the order ──────────────────────────────────────────
  const order = await Order.create({
    userId: req.user?._id || null, // null for guest checkout
    customerName,
    phone,
    address,
    items: orderItems,
    restaurantId,
    restaurantName,
    subtotal,
    deliveryFee,
    total,
    paymentMethod: paymentMethod || "cod",
    status: "placed",
  });

  res.status(201).json({
    success: true,
    message: "Order placed successfully!",
    data: order,
  });
});

/**
 * @desc    Get all orders (optionally filtered by userId)
 * @route   GET /api/orders
 * @access  Public
 *
 * Query params:
 *   ?userId=<id>   — filter by user
 *   ?page=1        — pagination
 */
const getAllOrders = asyncHandler(async (req, res) => {
  const { userId, page = 1, limit = 20 } = req.query;
  const filter = {};

  if (req.user?.role === "admin" && userId) {
    // Admin can filter by a specific userId
    filter.userId = userId;
  } else if (req.user?.role !== "admin") {
    // Regular users only see their own orders
    filter.userId = req.user._id;
  }
  // Admin with no userId filter sees all orders

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Order.countDocuments(filter);

  const orders = await Order.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  res.status(200).json({
    success: true,
    count: orders.length,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / Number(limit)),
    data: orders,
  });
});

/**
 * @desc    Get a single order by ID
 * @route   GET /api/orders/:id
 * @access  Public
 */
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  res.status(200).json({
    success: true,
    data: order,
  });
});

/**
 * @desc    Update order status
 * @route   PATCH /api/orders/:id/status
 * @access  Admin only
 */
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const validStatuses = [
    "placed",
    "confirmed",
    "preparing",
    "out_for_delivery",
    "delivered",
    "cancelled",
  ];

  if (!status || !validStatuses.includes(status)) {
    throw new ApiError(
      400,
      `Invalid status. Must be one of: ${validStatuses.join(", ")}`
    );
  }

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status },
    { returnDocument: "after", runValidators: true }
  );

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  res.status(200).json({
    success: true,
    message: `Order status updated to "${status}"`,
    data: order,
  });
});

module.exports = { placeOrder, getAllOrders, getOrderById, updateOrderStatus };

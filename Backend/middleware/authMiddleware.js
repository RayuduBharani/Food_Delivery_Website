const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");

/**
 * protect — Requires a valid JWT.
 * Throws 401 if missing or invalid.
 */
const protect = async (req, _res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError(401, "Not authorized — no token provided");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) throw new ApiError(401, "User no longer exists");
    next();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(401, "Not authorized — token is invalid or expired");
  }
};

/**
 * optionalAuth — Reads JWT if present, but does NOT block the request
 * if it is missing or invalid. Sets req.user = null for guests.
 *
 * Use this on routes that support both guest AND logged-in access,
 * e.g. POST /api/orders (allows guest checkout but links order to user if logged in).
 */
const optionalAuth = async (req, _res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    req.user = null;
    return next(); // Guest — no token
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
  } catch {
    req.user = null; // Invalid token — treat as guest
  }

  next();
};

/**
 * adminOnly — Must be used AFTER protect.
 * Checks that the authenticated user has the "admin" role.
 */
const adminOnly = (req, _res, next) => {
  if (req.user?.role !== "admin") {
    throw new ApiError(403, "Forbidden — admin access required");
  }
  next();
};

module.exports = { protect, optionalAuth, adminOnly };

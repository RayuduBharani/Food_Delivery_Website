const express = require("express");
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler");

/**
 * app.js — Express application configuration.
 *
 * This file is separated from server.js so the Express app can be
 * imported independently for testing without starting the HTTP server.
 */
const app = express();

// ─── Global Middleware ───────────────────────────────────────────────
app.use(express.json()); // Parse JSON request bodies
app.use(cors()); // Allow all origins in development

// ─── Health Check ────────────────────────────────────────────────────
app.get("/", (_req, res) => {
  res.json({ success: true, message: "FoodRush API is running 🍕" });
});

// ─── API Routes ──────────────────────────────────────────────────────
app.use("/api/auth", require("./routes/auth"));
app.use("/api/restaurants", require("./routes/restaurant"));
app.use("/api/orders", require("./routes/order"));
app.use("/api/admin", require("./routes/admin"));

// ─── 404 Handler (must be after all routes) ──────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// ─── Global Error Handler (must be last middleware) ──────────────────
app.use(errorHandler);

module.exports = app;

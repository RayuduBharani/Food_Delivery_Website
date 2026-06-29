/**
 * app.js — Express application configuration.
 *
 * This file configures the Express app AND handles DB connection so that
 * it works in both environments:
 *   • Local dev   → server.js imports this, then calls app.listen()
 *   • Vercel      → api/index.js imports this; Vercel manages HTTP itself
 *
 * dotenv is loaded here (before anything else) so that every import that
 * follows can safely access process.env, whether the caller is server.js
 * or Vercel's serverless runtime.
 */
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// ─── CORS & Global Middleware ────────────────────────────────────────
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:5175",
];
if (process.env.CLIENT_URL) {
  allowedOrigins.push(process.env.CLIENT_URL);
}

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman)
      if (!origin) return callback(null, true);

      const isAllowed =
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app") ||
        /^http:\/\/localhost:\d+$/.test(origin);

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json()); // Parse JSON request bodies

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

// ─── Database Connection ─────────────────────────────────────────────
// Connect to MongoDB once. In serverless environments the connection is
// reused across warm invocations; in local dev server.js already awaits
// this before calling listen(), but calling it here as well is safe
// because mongoose.connect() is idempotent when already connected.
connectDB();

module.exports = app;

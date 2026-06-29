const mongoose = require("mongoose");

/**
 * Connects to MongoDB using the MONGODB_URI environment variable.
 *
 * Falls back to a local MongoDB instance for development.
 * Exits the process on failure — this is intentional because the app
 * cannot function without a database, and failing fast makes deployment
 * issues immediately visible.
 */
const connectDB = async () => {
  try {
    const uri =
      process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/FoodDeliveryWebsite";
    await mongoose.connect(uri);
    console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error.message);
    process.exit(1); // Fail fast — app cannot work without DB
  }
};

module.exports = connectDB;
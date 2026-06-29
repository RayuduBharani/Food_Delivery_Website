/**
 * seed/index.js — Populates MongoDB with restaurants, menu items, and admin user.
 *
 * Run with: npm run seed
 *
 * ⚠️  This script CLEARS existing restaurants, menu items, and non-admin users
 *     before re-inserting — safe for development, dangerous in production.
 */

require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const connectDB = require("../config/db");
const Restaurant = require("../models/Restaurant");
const MenuItem = require("../models/MenuItem");
const User = require("../models/User");
const { restaurants, menuItems, adminUser } = require("./data");

async function seed() {
  await connectDB();

  console.log("🌱 Starting seed...\n");

  // ── Clear existing data ───────────────────────────────────────────
  await Restaurant.deleteMany({});
  await MenuItem.deleteMany({});
  await User.deleteMany({ role: { $ne: "admin" } }); // keep existing admins

  console.log("🗑️  Cleared restaurants, menu items, and non-admin users");

  // ── Insert restaurants ────────────────────────────────────────────
  const insertedRestaurants = await Restaurant.insertMany(restaurants);
  console.log(`🍽️  Inserted ${insertedRestaurants.length} restaurants`);

  // ── Insert menu items (map index → real ObjectId) ─────────────────
  const itemsWithIds = menuItems.map((item) => ({
    ...item,
    restaurantId: insertedRestaurants[item.restaurantIndex]._id,
    restaurantIndex: undefined,
  }));
  const insertedItems = await MenuItem.insertMany(itemsWithIds);
  console.log(`🍔  Inserted ${insertedItems.length} menu items`);

  // ── Upsert admin user ─────────────────────────────────────────────
  const existingAdmin = await User.findOne({ email: adminUser.email });
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminUser.password, 10);
    await User.create({ ...adminUser, password: hashedPassword });
    console.log(`👑  Admin user created: ${adminUser.email} / ${adminUser.password}`);
  } else {
    console.log(`👑  Admin user already exists: ${adminUser.email}`);
  }

  console.log("\n✅ Seed complete!");
  console.log("─────────────────────────────────────────");
  console.log("  Admin login:");
  console.log(`  Email   : ${adminUser.email}`);
  console.log(`  Password: ${adminUser.password}`);
  console.log("─────────────────────────────────────────");

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});

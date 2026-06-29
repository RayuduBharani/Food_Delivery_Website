/**
 * server.js — Application entry point.
 *
 * Loads environment variables, connects to MongoDB, then starts
 * the Express HTTP server. This is the file you run:
 *   node server.js   (production)
 *   nodemon server.js (development)
 */
require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 8000;

const startServer = async () => {
  // Connect to MongoDB first — app.js is useless without a DB
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
  });
};

startServer();

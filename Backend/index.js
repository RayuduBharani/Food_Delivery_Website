/**
 * index.js — Legacy entry point.
 *
 * The app has been refactored to use server.js as the main entry point
 * and app.js for Express configuration. This file simply re-exports
 * server.js for backward compatibility.
 *
 * Usage:
 *   npm run dev   → runs nodemon server.js
 *   npm start     → runs node server.js
 */
require("./server");
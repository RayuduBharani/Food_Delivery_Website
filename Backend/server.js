/**
 * server.js — Local development entry point.
 *
 * This file is ONLY used when running the server locally:
 *   node server.js      (production-like local)
 *   nodemon server.js   (hot-reload development)
 *
 * On Vercel, this file is NEVER executed. Vercel uses api/index.js
 * as the serverless function entry point instead.
 *
 * NOTE: dotenv and connectDB are already called inside app.js,
 * so this file simply imports the configured app and starts listening.
 */
const app = require("./app");

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

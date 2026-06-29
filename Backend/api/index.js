/**
 * api/index.js — Vercel Serverless Function entry point.
 *
 * Vercel looks for files inside the /api directory and exposes each one
 * as a serverless function. By exporting the Express app here, Vercel
 * wraps every incoming HTTP request and hands it off to Express to handle.
 *
 * This file MUST NOT call app.listen() — Vercel manages the HTTP server.
 */
const app = require("../app");

module.exports = app;

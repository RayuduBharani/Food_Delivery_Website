/**
 * index.js — Backward-compatibility shim for local development.
 *
 * The real entry points are:
 *   • Local dev  → server.js  (via `npm start` / `npm run dev`)
 *   • Vercel     → api/index.js  (Vercel serverless function)
 *
 * This file is kept only for tools that resolve "main" from package.json.
 * Do NOT use this file directly.
 */
require("./server");
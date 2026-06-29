/**
 * Wraps an async Express route handler so that any rejected promise
 * is automatically forwarded to Express's error-handling middleware.
 *
 * Without this wrapper, every async controller would need its own
 * try/catch block — this keeps controllers clean and DRY.
 *
 * Usage:
 *   router.get("/", asyncHandler(async (req, res) => { ... }));
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;

/**
 * Global error-handling middleware.
 *
 * Express recognises this as an error handler because it has 4 parameters.
 * Every unhandled error (including those from asyncHandler) lands here,
 * producing a consistent JSON shape for the frontend to consume.
 */
const errorHandler = (err, _req, res, _next) => {
  // Default to 500 if no status code was set
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  // Log the full error in development for debugging
  if (process.env.NODE_ENV !== "production") {
    console.error(`[ERROR] ${statusCode} — ${message}`);
    if (statusCode === 500) console.error(err.stack);
  }

  res.status(statusCode).json({
    success: false,
    message,
    // Include stack trace only in development
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
};

module.exports = errorHandler;

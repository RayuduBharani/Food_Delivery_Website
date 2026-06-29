/**
 * Custom error class that carries an HTTP status code.
 * Throwing an ApiError inside any controller will be caught by
 * the global error handler and returned as a structured JSON response.
 *
 * Usage:
 *   throw new ApiError(404, "Restaurant not found");
 */
class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // distinguishes expected errors from bugs
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;

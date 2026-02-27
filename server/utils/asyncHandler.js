/**
 * Higher-order function to wrap async route handlers
 * Automatically catches errors and passes them to the error handler
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((error) => {
    next(error);
  });
};

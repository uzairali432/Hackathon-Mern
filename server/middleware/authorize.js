import { ApiError } from '../utils/ApiError.js';

/**
 * Role-based access control middleware
 * @param  {...string} roles - Allowed roles
 * @returns Middleware function
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new ApiError('User not authenticated', 401);
    }

    if (!roles.includes(req.user.role)) {
      throw new ApiError(
        `User role '${req.user.role}' is not authorized to access this resource`,
        403
      );
    }

    next();
  };
};

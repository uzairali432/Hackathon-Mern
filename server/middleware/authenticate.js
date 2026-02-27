import jwt from 'jsonwebtoken';
import { config } from '../config/environment.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import User from '../models/User.js';

export const authenticate = asyncHandler(async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    throw new ApiError('No token provided. Please log in.', 401);
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    req.user = decoded;

    // Optional: Fetch user from database to get fresh data
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      throw new ApiError('User not found', 404);
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new ApiError('Token has expired', 401);
    }
    if (error.name === 'JsonWebTokenError') {
      throw new ApiError('Invalid token', 401);
    }
    throw error;
  }
});

import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { authValidators } from '../validators/authValidator.js';
import { AuthService } from '../services/authService.js';

/**
 * Validate request body against schema
 * @param {Object} schema - Joi schema
 * @param {Object} data - Data to validate
 */
const validate = (schema, data) => {
  const { error, value } = schema.validate(data, { abortEarly: false });
  if (error) {
    const messages = error.details.map((detail) => detail.message).join(', ');
    throw new ApiError(messages, 400);
  }
  return value;
};

/**
 * User signup
 * POST /api/v1/auth/signup
 */
export const signup = asyncHandler(async (req, res) => {
  // Validate request
  const validatedData = validate(authValidators.signup, req.body);

  // Register user
  const result = await AuthService.register(validatedData);

  // Set refresh token in httpOnly cookie
  res.cookie('refreshToken', result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });

  res.status(201).json(
    new ApiResponse(201, {
      user: result.user,
      accessToken: result.accessToken,
    }, 'User registered successfully')
  );
});

/**
 * User login
 * POST /api/v1/auth/login
 */
export const login = asyncHandler(async (req, res) => {
  // Validate request
  const validatedData = validate(authValidators.login, req.body);

  // Login user
  const result = await AuthService.login(validatedData.email, validatedData.password);

  // Set refresh token in httpOnly cookie
  res.cookie('refreshToken', result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });

  res.status(200).json(
    new ApiResponse(200, {
      user: result.user,
      accessToken: result.accessToken,
    }, 'Logged in successfully')
  );
});

/**
 * Refresh access token
 * POST /api/v1/auth/refresh
 */
export const refreshToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

  if (!refreshToken) {
    throw new ApiError('Refresh token is required', 400);
  }

  const tokens = await AuthService.refreshAccessToken(refreshToken);

  // Update refresh token cookie
  res.cookie('refreshToken', tokens.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });

  res.status(200).json(
    new ApiResponse(200, {
      accessToken: tokens.accessToken,
    }, 'Token refreshed successfully')
  );
});

/**
 * User logout
 * POST /api/v1/auth/logout
 */
export const logout = asyncHandler(async (req, res) => {
  res.clearCookie('refreshToken');

  res.status(200).json(
    new ApiResponse(200, null, 'Logged out successfully')
  );
});

/**
 * Get current user
 * GET /api/v1/auth/me
 */
export const getCurrentUser = asyncHandler(async (req, res) => {
  res.status(200).json(
    new ApiResponse(200, req.user, 'Current user retrieved successfully')
  );
});

import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { userValidators } from '../validators/userValidator.js';
import { UserService } from '../services/userService.js';

/**
 * Validate request body against schema
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
 * Get user by ID
 * GET /api/v1/users/:id
 */
export const getUserById = asyncHandler(async (req, res) => {
  const user = await UserService.getUserById(req.params.id);

  res.status(200).json(
    new ApiResponse(200, user, 'User retrieved successfully')
  );
});

/**
 * Get all users (admin only)
 * GET /api/v1/users
 */
export const getAllUsers = asyncHandler(async (req, res) => {
  const { limit = 10, skip = 0, role } = req.query;

  const result = await UserService.getAllUsers({
    limit: parseInt(limit),
    skip: parseInt(skip),
    role,
  });

  res.status(200).json(
    new ApiResponse(200, result, 'Users retrieved successfully')
  );
});

/**
 * Update user profile
 * PUT /api/v1/users/profile
 */
export const updateProfile = asyncHandler(async (req, res) => {
  // Validate request
  const validatedData = validate(userValidators.updateProfile, req.body);

  const user = await UserService.updateProfile(req.user._id, validatedData);

  res.status(200).json(
    new ApiResponse(200, user, 'Profile updated successfully')
  );
});

/**
 * Change password
 * POST /api/v1/users/change-password
 */
export const changePassword = asyncHandler(async (req, res) => {
  // Validate request
  const validatedData = validate(userValidators.changePassword, req.body);

  const user = await UserService.changePassword(
    req.user._id,
    validatedData.currentPassword,
    validatedData.newPassword
  );

  res.status(200).json(
    new ApiResponse(200, user, 'Password changed successfully')
  );
});

/**
 * Update user role (admin only)
 * PATCH /api/v1/users/:id/role
 */
export const updateUserRole = asyncHandler(async (req, res) => {
  // Validate request
  const validatedData = validate(userValidators.updateRole, {
    userId: req.params.id,
    role: req.body.role,
  });

  const user = await UserService.updateUserRole(validatedData.userId, validatedData.role);

  res.status(200).json(
    new ApiResponse(200, user, 'User role updated successfully')
  );
});

/**
 * Deactivate user account
 * POST /api/v1/users/deactivate
 */
export const deactivateAccount = asyncHandler(async (req, res) => {
  const user = await UserService.deactivateAccount(req.user._id);

  res.status(200).json(
    new ApiResponse(200, user, 'Account deactivated successfully')
  );
});

/**
 * Delete user (admin only)
 * DELETE /api/v1/users/:id
 */
export const deleteUser = asyncHandler(async (req, res) => {
  await UserService.deleteUser(req.params.id);

  res.status(200).json(
    new ApiResponse(200, null, 'User deleted successfully')
  );
});

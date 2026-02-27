import User from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';

export class UserService {
  /**
   * Get user by ID
   * @param {string} userId - User ID
   * @returns {Object} User document
   */
  static async getUserById(userId) {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError('User not found', 404);
    }

    return user;
  }

  /**
   * Get all users (admin only)
   * @param {Object} options - Query options
   * @returns {Array} Array of users
   */
  static async getAllUsers(options = {}) {
    const { limit = 10, skip = 0, role } = options;

    const query = {};
    if (role) query.role = role;

    const users = await User.find(query)
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    return {
      users,
      total,
      limit,
      skip,
    };
  }

  /**
   * Update user profile
   * @param {string} userId - User ID
   * @param {Object} updateData - Data to update
   * @returns {Object} Updated user
   */
  static async updateProfile(userId, updateData) {
    const { firstName, lastName, bio } = updateData;

    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError('User not found', 404);
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (bio !== undefined) user.bio = bio;

    await user.save();

    return user;
  }

  /**
   * Change user password
   * @param {string} userId - User ID
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Object} Updated user
   */
  static async changePassword(userId, currentPassword, newPassword) {
    const user = await User.findById(userId).select('+password');

    if (!user) {
      throw new ApiError('User not found', 404);
    }

    const isPasswordCorrect = await user.comparePassword(currentPassword);

    if (!isPasswordCorrect) {
      throw new ApiError('Current password is incorrect', 401);
    }

    user.password = newPassword;
    await user.save();

    return user.toJSON();
  }

  /**
   * Update user role (admin only)
   * @param {string} userId - User ID
   * @param {string} role - New role
   * @returns {Object} Updated user
   */
  static async updateUserRole(userId, role) {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError('User not found', 404);
    }

    user.role = role;
    await user.save();

    return user;
  }

  /**
   * Deactivate user account
   * @param {string} userId - User ID
   * @returns {Object} Updated user
   */
  static async deactivateAccount(userId) {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError('User not found', 404);
    }

    user.isActive = false;
    await user.save();

    return user.toJSON();
  }

  /**
   * Delete user (admin only)
   * @param {string} userId - User ID
   * @returns {void}
   */
  static async deleteUser(userId) {
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      throw new ApiError('User not found', 404);
    }
  }
}

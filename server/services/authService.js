import jwt from 'jsonwebtoken';
import { config } from '../config/environment.js';
import User from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';

export class AuthService {
  /**
   * Generate access token
   * @param {string} userId - User ID
   * @returns {string} JWT access token
   */
  static generateAccessToken(user) {
    return jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      config.jwt.secret,
      {
        expiresIn: config.jwt.expire,
      }
    );
  }

  /**
   * Generate refresh token
   * @param {string} userId - User ID
   * @returns {string} JWT refresh token
   */
  static generateRefreshToken(user) {
    return jwt.sign(
      {
        id: user._id,
      },
      config.jwt.refreshSecret,
      {
        expiresIn: config.jwt.refreshExpire,
      }
    );
  }

  /**
   * Verify refresh token and generate new access token
   * @param {string} refreshToken - Refresh token
   * @returns {Object} New tokens
   */
  static async refreshAccessToken(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret);
      const user = await User.findById(decoded.id);

      if (!user) {
        throw new ApiError('User not found', 404);
      }

      if (!user.isActive) {
        throw new ApiError('User account is inactive', 403);
      }

      const newAccessToken = this.generateAccessToken(user);
      const newRefreshToken = this.generateRefreshToken(user);

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new ApiError('Refresh token has expired. Please log in again.', 401);
      }
      if (error.name === 'JsonWebTokenError') {
        throw new ApiError('Invalid refresh token', 401);
      }
      throw error;
    }
  }

  /**
   * Register a new user
   * @param {Object} userData - User data
   * @returns {Object} Created user and tokens
   */
  static async register(userData) {
    const { firstName, lastName, email, password } = userData;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      throw new ApiError('Email already registered', 409);
    }

    // Create new user
    const user = new User({
      firstName,
      lastName,
      email,
      password,
    });

    await user.save();

    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    return {
      user: user.toJSON(),
      accessToken,
      refreshToken,
    };
  }

  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Object} User and tokens
   */
  static async login(email, password) {
    const user = await User.findByEmail(email).select('+password');

    if (!user) {
      throw new ApiError('Invalid email or password', 401);
    }

    if (!user.isActive) {
      throw new ApiError('Your account has been deactivated', 403);
    }

    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      throw new ApiError('Invalid email or password', 401);
    }

    // Update last login
    await user.updateLastLogin();

    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    return {
      user: user.toJSON(),
      accessToken,
      refreshToken,
    };
  }
}

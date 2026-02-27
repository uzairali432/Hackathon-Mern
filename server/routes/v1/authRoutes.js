import express from 'express';
import * as authController from '../../controllers/authController.js';
import { authenticate } from '../../middleware/authenticate.js';

const router = express.Router();

/**
 * Public routes
 */
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/refresh', authController.refreshToken);

/**
 * Protected routes
 */
router.get('/me', authenticate, authController.getCurrentUser);
router.post('/logout', authenticate, authController.logout);

export default router;

import express from 'express';
import * as userController from '../../controllers/userController.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';

const router = express.Router();

/**
 * Public routes
 */
router.get('/:id', userController.getUserById);

/**
 * Protected routes - User
 */
router.put('/profile', authenticate, userController.updateProfile);
router.post('/change-password', authenticate, userController.changePassword);
router.post('/deactivate', authenticate, userController.deactivateAccount);

/**
 * Protected routes - Admin only
 */
router.get('/', authenticate, authorize('admin'), userController.getAllUsers);
router.patch('/:id/role', authenticate, authorize('admin'), userController.updateUserRole);
router.delete('/:id', authenticate, authorize('admin'), userController.deleteUser);

export default router;

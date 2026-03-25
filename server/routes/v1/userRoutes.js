import express from 'express';
import * as userController from '../../controllers/userController.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { requireFeature } from '../../middleware/featureAccess.js';

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
// Admin - get users by role
router.get('/role/:role', authenticate, authorize('admin'), userController.getUsersByRole);
// Admin - analytics (simulated)
router.get('/analytics', authenticate, authorize('admin'), requireFeature('advancedAnalytics'), userController.getAnalytics);
// Admin - system usage and health
router.get('/system/usage', authenticate, authorize('admin'), userController.getSystemUsage);
router.get('/system/health', authenticate, authorize('admin'), userController.getSystemHealth);
// Admin - update subscription (simulated)
router.patch('/:id/subscription', authenticate, authorize('admin'), userController.updateSubscription);

export default router;

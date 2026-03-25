import express from 'express';
import * as analyticsController from '../../controllers/analyticsController.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { requireFeature } from '../../middleware/featureAccess.js';

const router = express.Router();

/**
 * All routes require admin role
 */
router.get('/', authenticate, authorize('admin'), requireFeature('advancedAnalytics'), analyticsController.getAnalytics);

export default router;

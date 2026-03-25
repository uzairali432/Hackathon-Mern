import { ApiError } from '../utils/ApiError.js';
import { hasFeatureAccess, normalizePlan } from '../config/subscriptionPlans.js';

/**
 * Restrict endpoint access to users who have the requested feature
 * in their current subscription plan.
 */
export const requireFeature = (featureKey) => {
  return (req, _res, next) => {
    if (!req.user) {
      throw new ApiError('User not authenticated', 401);
    }

    if (hasFeatureAccess(req.user, featureKey)) {
      return next();
    }

    const plan = normalizePlan(req.user.subscription?.plan);
    throw new ApiError(
      `Feature '${featureKey}' is not available on the '${plan}' plan. Upgrade to Pro.`,
      403
    );
  };
};

const FREE_PLAN_PATIENT_LIMIT = Number(process.env.FREE_PLAN_PATIENT_LIMIT || 25);

export const SUBSCRIPTION_PLANS = {
  free: {
    key: 'free',
    features: {
      aiFeatures: false,
      advancedAnalytics: false,
    },
    limits: {
      maxPatients: FREE_PLAN_PATIENT_LIMIT,
    },
  },
  pro: {
    key: 'pro',
    features: {
      aiFeatures: true,
      advancedAnalytics: true,
    },
    limits: {
      maxPatients: Number.POSITIVE_INFINITY,
    },
  },
  // Keep backward compatibility for existing users on "basic".
  basic: {
    key: 'basic',
    features: {
      aiFeatures: false,
      advancedAnalytics: false,
    },
    limits: {
      maxPatients: FREE_PLAN_PATIENT_LIMIT,
    },
  },
};

export const normalizePlan = (plan) => {
  const normalized = String(plan || 'free').toLowerCase();
  return SUBSCRIPTION_PLANS[normalized] ? normalized : 'free';
};

export const getPlanConfig = (plan) => {
  return SUBSCRIPTION_PLANS[normalizePlan(plan)];
};

export const getUserPlanConfig = (user) => {
  return getPlanConfig(user?.subscription?.plan);
};

export const hasFeatureAccess = (user, featureKey) => {
  const plan = getUserPlanConfig(user);
  return Boolean(plan.features?.[featureKey]);
};

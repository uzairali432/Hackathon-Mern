import Stripe from 'stripe';

import { config } from '../config/environment.js';
import User from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';

const ALLOWED_PLANS = ['basic', 'pro'];

let stripeClient;

const getStripeClient = () => {
  if (!config.stripe.secretKey) {
    throw new ApiError('Stripe is not configured. Set STRIPE_SECRET_KEY in server environment.', 500);
  }

  if (!stripeClient) {
    stripeClient = new Stripe(config.stripe.secretKey);
  }

  return stripeClient;
};

const getPriceIdForPlan = (plan) => {
  const normalized = String(plan || '').toLowerCase();

  if (!ALLOWED_PLANS.includes(normalized)) {
    throw new ApiError('Invalid plan. Allowed plans are: basic, pro', 400);
  }

  const priceId = config.stripe.prices[normalized];
  if (!priceId) {
    throw new ApiError(`Missing Stripe price configuration for '${normalized}'.`, 500);
  }

  return priceId;
};

const mapStripePlanFromPriceId = (priceId) => {
  if (priceId === config.stripe.prices.pro) return 'pro';
  if (priceId === config.stripe.prices.basic) return 'basic';
  return 'free';
};

const mapSubscriptionStatus = (status) => {
  if (status === 'active' || status === 'trialing') return 'active';
  if (status === 'past_due' || status === 'unpaid') return 'past_due';
  return 'inactive';
};

const ensureCustomerForUser = async (user) => {
  const stripe = getStripeClient();

  if (user.stripeCustomerId) {
    return user.stripeCustomerId;
  }

  const customer = await stripe.customers.create({
    email: user.email,
    name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
    metadata: {
      userId: String(user._id),
    },
  });

  user.stripeCustomerId = customer.id;
  await user.save();

  return customer.id;
};

export const createSubscriptionCheckoutSession = async (user, plan) => {
  const stripe = getStripeClient();
  const priceId = getPriceIdForPlan(plan);
  const customerId = await ensureCustomerForUser(user);
  const successUrlHasQuery = config.stripe.successUrl.includes('?');
  const successUrl = `${config.stripe.successUrl}${successUrlHasQuery ? '&' : '?'}session_id={CHECKOUT_SESSION_ID}`;

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: customerId,
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: config.stripe.cancelUrl,
    metadata: {
      userId: String(user._id),
      plan: String(plan).toLowerCase(),
    },
  });

  return {
    sessionId: session.id,
    checkoutUrl: session.url,
  };
};

const updateUserFromStripeSubscription = async (stripeSubscription) => {
  const customerId =
    typeof stripeSubscription.customer === 'string'
      ? stripeSubscription.customer
      : stripeSubscription.customer?.id;

  if (!customerId) {
    return;
  }

  const user = await User.findOne({ stripeCustomerId: customerId });
  if (!user) {
    return;
  }

  const firstItem = stripeSubscription.items?.data?.[0];
  const priceId = firstItem?.price?.id;

  user.subscription = user.subscription || {};
  user.subscription.plan = mapStripePlanFromPriceId(priceId);
  user.subscription.status = mapSubscriptionStatus(stripeSubscription.status);
  user.subscription.stripeSubscriptionId = stripeSubscription.id;
  user.subscription.expiresAt = stripeSubscription.current_period_end
    ? new Date(stripeSubscription.current_period_end * 1000)
    : null;

  await user.save();
};

export const handleStripeWebhookEvent = async (payload, signature) => {
  if (!config.stripe.webhookSecret) {
    throw new ApiError('Stripe webhook secret is not configured.', 500);
  }

  const stripe = getStripeClient();
  const event = stripe.webhooks.constructEvent(payload, signature, config.stripe.webhookSecret);

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session?.metadata?.userId;
    if (userId && session.customer) {
      await User.findByIdAndUpdate(userId, {
        stripeCustomerId: String(session.customer),
      });
    }
  }

  if (event.type === 'customer.subscription.created' || event.type === 'customer.subscription.updated') {
    await updateUserFromStripeSubscription(event.data.object);
  }

  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object;
    const customerId =
      typeof subscription.customer === 'string'
        ? subscription.customer
        : subscription.customer?.id;

    if (!customerId) {
      return event.type;
    }

    const user = await User.findOne({ stripeCustomerId: customerId });
    if (!user) {
      return event.type;
    }

    user.subscription = user.subscription || {};
    user.subscription.plan = 'free';
    user.subscription.status = 'inactive';
    user.subscription.expiresAt = null;
    user.subscription.stripeSubscriptionId = null;

    await user.save();
  }

  return event.type;
};

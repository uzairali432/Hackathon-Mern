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

const normalizeStripePlan = (plan) => {
  const normalized = String(plan || '').toLowerCase();
  if (ALLOWED_PLANS.includes(normalized)) {
    return normalized;
  }
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

export const createSubscriptionCheckoutSession = async (user, plan, options = {}) => {
  if (user?.role !== 'patient') {
    throw new ApiError('Only patients can purchase subscriptions.', 403);
  }

  const stripe = getStripeClient();
  const priceId = getPriceIdForPlan(plan);
  const customerId = await ensureCustomerForUser(user);
  const successBaseUrl = String(options?.successUrl || config.stripe.successUrl || '').trim();
  const cancelBaseUrl = String(options?.cancelUrl || config.stripe.cancelUrl || '').trim();

  if (!successBaseUrl || !cancelBaseUrl) {
    throw new ApiError('Stripe success/cancel URLs are not configured.', 500);
  }

  const successUrlHasQuery = successBaseUrl.includes('?');
  const successUrl = `${successBaseUrl}${successUrlHasQuery ? '&' : '?'}session_id={CHECKOUT_SESSION_ID}`;

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
    cancel_url: cancelBaseUrl,
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

export const confirmSubscriptionCheckoutSession = async (user, sessionId) => {
  if (user?.role !== 'patient') {
    throw new ApiError('Only patients can confirm subscriptions.', 403);
  }

  const stripe = getStripeClient();
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['subscription'],
  });

  if (!session || session.mode !== 'subscription') {
    throw new ApiError('Invalid Stripe checkout session.', 400);
  }

  const metadataUserId = String(session.metadata?.userId || '');
  if (!metadataUserId || metadataUserId !== String(user._id)) {
    throw new ApiError('Checkout session does not belong to the authenticated user.', 403);
  }

  const sessionStatus = String(session.status || '').toLowerCase();
  if (sessionStatus !== 'complete') {
    throw new ApiError('Payment is not completed yet for this checkout session.', 400);
  }

  const paymentStatus = String(session.payment_status || '').toLowerCase();

  if (session.customer && !user.stripeCustomerId) {
    user.stripeCustomerId = String(session.customer);
    await user.save();
  }

  const subscriptionId =
    typeof session.subscription === 'string'
      ? session.subscription
      : session.subscription?.id;

  if (!subscriptionId) {
    throw new ApiError('No subscription was found for this checkout session.', 400);
  }

  const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId);
  await updateUserFromStripeSubscription(stripeSubscription);

  let updatedUser = await User.findById(user._id);
  if (!updatedUser) {
    throw new ApiError('User not found after subscription confirmation.', 404);
  }

  const subscriptionStatus = String(updatedUser.subscription?.status || '').toLowerCase();
  if (subscriptionStatus !== 'active' && paymentStatus === 'paid') {
    const firstItem = stripeSubscription.items?.data?.[0];
    const mappedPlan = mapStripePlanFromPriceId(firstItem?.price?.id);
    const fallbackPlan = normalizeStripePlan(session.metadata?.plan);

    updatedUser.subscription = updatedUser.subscription || {};
    updatedUser.subscription.plan = mappedPlan !== 'free' ? mappedPlan : fallbackPlan;
    updatedUser.subscription.status = 'active';
    updatedUser.subscription.stripeSubscriptionId = stripeSubscription.id || updatedUser.subscription.stripeSubscriptionId;
    updatedUser.subscription.expiresAt = stripeSubscription.current_period_end
      ? new Date(stripeSubscription.current_period_end * 1000)
      : updatedUser.subscription.expiresAt || null;

    await updatedUser.save();
  }

  updatedUser = await User.findById(user._id);
  if (!updatedUser) {
    throw new ApiError('User not found after subscription activation.', 404);
  }

  return updatedUser;
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

  if (user.role !== 'patient') {
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
      await User.findOneAndUpdate({ _id: userId, role: 'patient' }, {
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

    if (user.role !== 'patient') {
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

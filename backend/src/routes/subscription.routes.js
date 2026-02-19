import express from 'express';
import { asyncHandler } from '../middleware/error.middleware.js';
import { protect } from '../middleware/auth.middleware.js';
import { AppError } from '../utils/appError.js';

const router = express.Router();

router.use(protect);

const SUBSCRIPTION_PLANS = {
  free: { credits: 100, price: 0 },
  pro: { credits: 1000, price: 20 },
  enterprise: { credits: 10000, price: 100 }
};

/**
 * @desc    Get subscription plans
 * @route   GET /api/subscriptions/plans
 * @access  Private
 */
export const getPlans = asyncHandler(async (req, res) => {
  res.status(200).json({
    status: 'success',
    data: { plans: SUBSCRIPTION_PLANS }
  });
});

/**
 * @desc    Subscribe to a plan
 * @route   POST /api/subscriptions/subscribe
 * @access  Private
 */
export const subscribe = asyncHandler(async (req, res, next) => {
  const { tier } = req.body;

  if (!SUBSCRIPTION_PLANS[tier]) {
    return next(new AppError('Invalid subscription tier', 400));
  }

  req.user.subscription.tier = tier;
  req.user.subscription.status = 'active';
  req.user.subscription.startDate = new Date();
  req.user.subscription.endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  req.user.credits.total = SUBSCRIPTION_PLANS[tier].credits;
  req.user.credits.used = 0;
  req.user.credits.remaining = SUBSCRIPTION_PLANS[tier].credits;

  await req.user.save();

  res.status(200).json({
    status: 'success',
    data: {
      subscription: req.user.subscription,
      credits: req.user.credits
    }
  });
});

router.get('/plans', getPlans);
router.post('/subscribe', subscribe);

export default router;

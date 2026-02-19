import express from 'express';
import { asyncHandler } from '../middleware/error.middleware.js';
import { protect } from '../middleware/auth.middleware.js';
import Generation from '../models/Generation.model.js';

const router = express.Router();

router.use(protect);

/**
 * @desc    Get user credits
 * @route   GET /api/usage/credits
 * @access  Private
 */
export const getCredits = asyncHandler(async (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      credits: req.user.credits,
      subscription: req.user.subscription
    }
  });
});

/**
 * @desc    Get usage statistics
 * @route   GET /api/usage/stats
 * @access  Private
 */
export const getStats = asyncHandler(async (req, res) => {
  const stats = await Generation.aggregate([
    { $match: { user: req.user._id } },
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 },
        totalCredits: { $sum: '$credits' }
      }
    }
  ]);

  const totalGenerations = await Generation.countDocuments({ user: req.user._id });

  res.status(200).json({
    status: 'success',
    data: {
      totalGenerations,
      byType: stats,
      credits: req.user.credits,
      usage: req.user.usage
    }
  });
});

/**
 * @desc    Get usage history
 * @route   GET /api/usage/history
 * @access  Private
 */
export const getHistory = asyncHandler(async (req, res) => {
  const { days = 30 } = req.query;

  const dateFrom = new Date();
  dateFrom.setDate(dateFrom.getDate() - parseInt(days));

  const history = await Generation.aggregate([
    {
      $match: {
        user: req.user._id,
        createdAt: { $gte: dateFrom }
      }
    },
    {
      $group: {
        _id: {
          date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          type: '$type'
        },
        count: { $sum: 1 },
        credits: { $sum: '$credits' }
      }
    },
    { $sort: { '_id.date': 1 } }
  ]);

  res.status(200).json({
    status: 'success',
    data: { history }
  });
});

router.get('/credits', getCredits);
router.get('/stats', getStats);
router.get('/history', getHistory);

export default router;

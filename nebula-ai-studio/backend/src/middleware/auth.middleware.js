import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';
import { AppError } from '../utils/appError.js';
import logger from '../utils/logger.js';

export const protect = async (req, res, next) => {
  try {
    let token;

    // Get token from header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('You are not logged in. Please log in to get access.', 401));
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user still exists
    const user = await User.findById(decoded.id).select('+refreshToken');
    if (!user) {
      return next(new AppError('The user belonging to this token no longer exists.', 401));
    }

    // Check if user is active
    if (!user.isActive) {
      return next(new AppError('Your account has been deactivated. Please contact support.', 401));
    }

    // Check if user changed password after token was issued
    if (user.changedPasswordAfter(decoded.iat)) {
      return next(new AppError('User recently changed password. Please log in again.', 401));
    }

    // Grant access to protected route
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(new AppError('Invalid token. Please log in again.', 401));
    }
    if (error.name === 'TokenExpiredError') {
      return next(new AppError('Your token has expired. Please log in again.', 401));
    }
    logger.error('Auth middleware error:', error);
    next(error);
  }
};

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action.', 403)
      );
    }
    next();
  };
};

export const checkSubscription = (...allowedTiers) => {
  return (req, res, next) => {
    if (!allowedTiers.includes(req.user.subscription.tier)) {
      return next(
        new AppError(
          `This feature is only available for ${allowedTiers.join(', ')} subscribers.`,
          403
        )
      );
    }
    next();
  };
};

export const checkCredits = (requiredCredits = 1) => {
  return (req, res, next) => {
    if (!req.user.hasCredits(requiredCredits)) {
      return next(
        new AppError(
          'Insufficient credits. Please upgrade your subscription or purchase more credits.',
          402
        )
      );
    }
    next();
  };
};

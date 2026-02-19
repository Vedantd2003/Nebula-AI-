import rateLimit from 'express-rate-limit';
import logger from '../utils/logger.js';

// Helper to normalize IP for IPv6 (handles localhost mappings)
const normalizeIP = (ip) => {
  if (!ip) return 'unknown';
  // Handle IPv6 localhost mapping ::ffff:127.0.0.1
  if (ip.startsWith('::ffff:')) {
    return ip.substring(7);
  }
  return ip;
};

export const rateLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => normalizeIP(req.ip),
  handler: (req, res) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      status: 'error',
      message: 'Too many requests. Please try again later.',
      retryAfter: req.rateLimit.resetTime
    });
  }
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: 'Too many login attempts, please try again later.',
  skipSuccessfulRequests: true,
  keyGenerator: (req) => normalizeIP(req.ip)
});

export const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 AI requests per minute
  message: 'Too many AI requests, please slow down.',
  keyGenerator: (req) => {
    return req.user ? req.user._id.toString() : normalizeIP(req.ip);
  }
});

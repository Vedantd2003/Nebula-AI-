import express from 'express';
import {
  generateText,
  analyzeDocument,
  summarizeText,
  generateContent,
  getHistory,
  getGeneration,
  deleteGeneration
} from '../controllers/ai.controller.js';
import { protect, checkCredits } from '../middleware/auth.middleware.js';
import { aiLimiter } from '../middleware/rateLimit.middleware.js';

const router = express.Router();

// Protect all routes
router.use(protect);

/**
 * @swagger
 * /api/ai/generate-text:
 *   post:
 *     summary: Generate AI text
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - prompt
 *             properties:
 *               prompt:
 *                 type: string
 *               options:
 *                 type: object
 *     responses:
 *       200:
 *         description: Text generated successfully
 */
router.post('/generate-text', aiLimiter, checkCredits(1), generateText);
router.post('/analyze-document', aiLimiter, checkCredits(2), analyzeDocument);
router.post('/summarize', aiLimiter, checkCredits(1), summarizeText);
router.post('/generate-content', aiLimiter, checkCredits(2), generateContent);

router.get('/history', getHistory);
router.get('/history/:id', getGeneration);
router.delete('/history/:id', deleteGeneration);

export default router;

import aiService from '../services/ai.service.js';
import Generation from '../models/Generation.model.js';
import { asyncHandler } from '../middleware/error.middleware.js';
import { AppError } from '../utils/appError.js';
import logger from '../utils/logger.js';

/**
 * @desc    Generate AI text
 * @route   POST /api/ai/generate-text
 * @access  Private
 */
export const generateText = asyncHandler(async (req, res, next) => {
  const { prompt, options } = req.body;

  if (!prompt) {
    return next(new AppError('Prompt is required', 400));
  }

  const startTime = Date.now();

  try {
    // Generate text
    const result = await aiService.generateText(prompt, options);

    // Calculate credits
    const credits = aiService.calculateCredits(result.metadata.usage);

    // Deduct credits from user
    await req.user.deductCredits(credits);

    // Save generation to database
    const generation = await Generation.create({
      user: req.user._id,
      type: 'text',
      prompt,
      response: result.text,
      metadata: {
        ...result.metadata,
        duration: Date.now() - startTime
      },
      credits
    });

    logger.info(`Text generated for user ${req.user.email}, credits used: ${credits}`);

    res.status(200).json({
      status: 'success',
      data: {
        text: result.text,
        generation: generation._id,
        creditsUsed: credits,
        creditsRemaining: req.user.credits.remaining
      }
    });
  } catch (error) {
    logger.error('Text generation error:', error);
    return next(new AppError('Text generation failed', 500));
  }
});

/**
 * @desc    Analyze document
 * @route   POST /api/ai/analyze-document
 * @access  Private
 */
export const analyzeDocument = asyncHandler(async (req, res, next) => {
  const { text, analysisType } = req.body;

  if (!text) {
    return next(new AppError('Text content is required', 400));
  }

  const startTime = Date.now();

  try {
    // Analyze document
    const result = await aiService.analyzeDocument(text, analysisType);

    // Calculate credits
    const credits = aiService.calculateCredits(result.metadata.usage);

    // Deduct credits
    await req.user.deductCredits(credits);

    // Save to database
    const generation = await Generation.create({
      user: req.user._id,
      type: 'analysis',
      prompt: `Analysis type: ${analysisType}`,
      response: result.analysis,
      metadata: {
        ...result.metadata,
        duration: Date.now() - startTime,
        analysisType
      },
      credits
    });

    res.status(200).json({
      status: 'success',
      data: {
        analysis: result.analysis,
        type: result.type,
        generation: generation._id,
        creditsUsed: credits,
        creditsRemaining: req.user.credits.remaining
      }
    });
  } catch (error) {
    logger.error('Document analysis error:', error);
    return next(new AppError('Document analysis failed', 500));
  }
});

/**
 * @desc    Summarize text
 * @route   POST /api/ai/summarize
 * @access  Private
 */
export const summarizeText = asyncHandler(async (req, res, next) => {
  const { text, options } = req.body;

  if (!text) {
    return next(new AppError('Text is required', 400));
  }

  const startTime = Date.now();

  try {
    // Summarize text
    const result = await aiService.summarizeText(text, options);

    // Calculate credits
    const credits = aiService.calculateCredits(result.metadata.usage);

    // Deduct credits
    await req.user.deductCredits(credits);

    // Save to database
    const generation = await Generation.create({
      user: req.user._id,
      type: 'summary',
      prompt: 'Text summarization',
      response: result.summary,
      metadata: {
        ...result.metadata,
        duration: Date.now() - startTime,
        compressionRatio: result.compressionRatio
      },
      credits
    });

    res.status(200).json({
      status: 'success',
      data: {
        summary: result.summary,
        stats: {
          originalLength: result.originalLength,
          summaryLength: result.summaryLength,
          compressionRatio: result.compressionRatio
        },
        generation: generation._id,
        creditsUsed: credits,
        creditsRemaining: req.user.credits.remaining
      }
    });
  } catch (error) {
    logger.error('Summarization error:', error);
    return next(new AppError('Summarization failed', 500));
  }
});

/**
 * @desc    Generate creative content
 * @route   POST /api/ai/generate-content
 * @access  Private
 */
export const generateContent = asyncHandler(async (req, res, next) => {
  const { prompt, contentType } = req.body;

  if (!prompt) {
    return next(new AppError('Prompt is required', 400));
  }

  const startTime = Date.now();

  try {
    const result = await aiService.generateCreativeContent(prompt, contentType);

    const credits = aiService.calculateCredits(result.metadata.usage);
    await req.user.deductCredits(credits);

    const generation = await Generation.create({
      user: req.user._id,
      type: 'text',
      prompt,
      response: result.content,
      metadata: {
        ...result.metadata,
        duration: Date.now() - startTime,
        contentType,
        wordCount: result.wordCount
      },
      credits
    });

    res.status(200).json({
      status: 'success',
      data: {
        content: result.content,
        type: result.type,
        wordCount: result.wordCount,
        generation: generation._id,
        creditsUsed: credits,
        creditsRemaining: req.user.credits.remaining
      }
    });
  } catch (error) {
    logger.error('Content generation error:', error);
    return next(new AppError('Content generation failed', 500));
  }
});

/**
 * @desc    Get generation history
 * @route   GET /api/ai/history
 * @access  Private
 */
export const getHistory = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, type } = req.query;

  const query = { user: req.user._id };
  if (type) query.type = type;

  const generations = await Generation.find(query)
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .select('-__v');

  const count = await Generation.countDocuments(query);

  res.status(200).json({
    status: 'success',
    data: {
      generations,
      pagination: {
        total: count,
        pages: Math.ceil(count / limit),
        currentPage: parseInt(page),
        perPage: parseInt(limit)
      }
    }
  });
});

/**
 * @desc    Get single generation
 * @route   GET /api/ai/history/:id
 * @access  Private
 */
export const getGeneration = asyncHandler(async (req, res, next) => {
  const generation = await Generation.findOne({
    _id: req.params.id,
    user: req.user._id
  });

  if (!generation) {
    return next(new AppError('Generation not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { generation }
  });
});

/**
 * @desc    Delete generation
 * @route   DELETE /api/ai/history/:id
 * @access  Private
 */
export const deleteGeneration = asyncHandler(async (req, res, next) => {
  const generation = await Generation.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id
  });

  if (!generation) {
    return next(new AppError('Generation not found', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'Generation deleted successfully'
  });
});

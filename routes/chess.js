const express = require('express');
const router = express.Router();
const { validateFEN } = require('../utils/fenValidator');
const aiService = require('../services/aiService');

router.post('/ask', async (req, res) => {
  try {
    const { fen, question } = req.body;

    // Validate input
    if (!fen) {
      return res.status(400).json({
        success: false,
        error: 'FEN notation is required'
      });
    }

    if (!question) {
      return res.status(400).json({
        success: false,
        error: 'Question is required'
      });
    }

    if (typeof question !== 'string' || question.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Question must be a non-empty string'
      });
    }

    // Validate FEN
    const fenValidation = validateFEN(fen);
    if (!fenValidation.isValid) {
      return res.status(400).json({
        success: false,
        error: `Invalid FEN: ${fenValidation.error}`
      });
    }

    // Get AI analysis
    const result = await aiService.analyzeChessPosition(fen, question.trim());

    res.json({
      success: true,
      data: {
        fen,
        question: question.trim(),
        analysis: result.analysis,
        timestamp: new Date().toISOString()
      },
      usage: result.usage
    });

  } catch (error) {
    console.error('Chess analysis error:', error);

    // Handle specific AI service errors
    if (error.message.includes('OpenAI API key')) {
      return res.status(500).json({
        success: false,
        error: 'AI service configuration error'
      });
    }

    if (error.message.includes('Rate limit')) {
      return res.status(429).json({
        success: false,
        error: 'Service temporarily unavailable due to rate limiting'
      });
    }

    if (error.message.includes('temporarily unavailable')) {
      return res.status(503).json({
        success: false,
        error: 'AI service temporarily unavailable'
      });
    }

    // Generic error response
    res.status(500).json({
      success: false,
      error: 'Failed to analyze chess position'
    });
  }
});

// GET endpoint to test FEN validation
router.get('/validate/:fen', (req, res) => {
  try {
    const fen = decodeURIComponent(req.params.fen);
    const validation = validateFEN(fen);

    res.json({
      fen,
      isValid: validation.isValid,
      error: validation.error || null
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: 'Invalid FEN parameter'
    });
  }
});

module.exports = router;
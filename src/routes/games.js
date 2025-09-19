const express = require('express');
const { getCollection, ObjectId } = require('../db');
const Chess = require('chess.js').Chess;

const router = express.Router();

function computeStatus(chess) {
  if (chess.in_checkmate()) return 'checkmate';
  if (chess.in_stalemate()) return 'stalemate';
  if (chess.in_draw()) return 'draw';
  return 'ongoing';
}

// POST /api/v1/games - start a new game
router.post('/', async (req, res, next) => {
  try {
    const games = getCollection('games');
    const { initialFen, players } = req.body || {};

    const chess = initialFen ? new Chess(initialFen) : new Chess();

    const now = new Date();
    const doc = {
      fen: chess.fen(),
      status: computeStatus(chess),
      moves: [],
      players: {
        white: players?.white || req.user?.sub || req.user?.id || null,
        black: players?.black || null,
      },
      createdBy: req.user?.sub || req.user?.id || null,
      createdAt: now,
      updatedAt: now,
    };

    const result = await games.insertOne(doc);
    return res.status(201).json({ gameId: result.insertedId.toHexString(), fen: doc.fen, status: doc.status });
  } catch (err) {
    return next(err);
  }
});

// GET /api/v1/games/:gameId - retrieve game state
router.get('/:gameId', async (req, res, next) => {
  try {
    const { gameId } = req.params;
    if (!ObjectId.isValid(gameId)) {
      return res.status(400).json({ error: 'Invalid gameId' });
    }
    const games = getCollection('games');
    const game = await games.findOne({ _id: new ObjectId(gameId) });
    if (!game) return res.status(404).json({ error: 'Game not found' });

    return res.json({
      gameId: game._id.toHexString(),
      fen: game.fen,
      status: game.status,
      moves: game.moves,
      players: game.players,
      createdAt: game.createdAt,
      updatedAt: game.updatedAt,
    });
  } catch (err) {
    return next(err);
  }
});

// POST /api/v1/games/:gameId/move - make a move
router.post('/:gameId/move', async (req, res, next) => {
  try {
    const { gameId } = req.params;
    if (!ObjectId.isValid(gameId)) {
      return res.status(400).json({ error: 'Invalid gameId' });
    }
    const body = req.body || {};
    const moveInput = body.move;
    if (!moveInput) return res.status(400).json({ error: 'Missing move in request body' });

    const games = getCollection('games');
    const game = await games.findOne({ _id: new ObjectId(gameId) });
    if (!game) return res.status(404).json({ error: 'Game not found' });

    const chess = new Chess(game.fen);
    const moveResult = chess.move(moveInput);
    if (!moveResult) {
      return res.status(400).json({ error: 'Illegal move' });
    }

    const now = new Date();
    const status = computeStatus(chess);
    const newFen = chess.fen();
    const moveEntry = {
      san: moveResult.san,
      from: moveResult.from,
      to: moveResult.to,
      piece: moveResult.piece,
      color: moveResult.color,
      promotion: moveResult.promotion || null,
      timestamp: now,
    };

    await games.updateOne(
      { _id: new ObjectId(gameId) },
      {
        $set: { fen: newFen, status, updatedAt: now },
        $push: { moves: moveEntry },
      }
    );

    return res.json({ gameId, fen: newFen, status, move: moveEntry });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;


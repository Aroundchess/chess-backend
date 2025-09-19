const request = require('supertest');
const app = require('../server');

describe('Chess API Endpoints', () => {

  describe('POST /api/chess/analyze', () => {
    it('should reject requests without FEN', async () => {
      const response = await request(app)
        .post('/api/chess/analyze')
        .send({ question: 'What is the best move?' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('FEN notation is required');
    });

    it('should reject requests without question', async () => {
      const response = await request(app)
        .post('/api/chess/analyze')
        .send({ fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Question is required');
    });

    it('should reject invalid FEN notation', async () => {
      const response = await request(app)
        .post('/api/chess/analyze')
        .send({
          fen: 'invalid-fen-string',
          question: 'What is the best move?'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Invalid FEN');
    });

    it('should reject empty question', async () => {
      const response = await request(app)
        .post('/api/chess/analyze')
        .send({
          fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
          question: '   '
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Question must be a non-empty string');
    });

    // Note: This test would require a valid OpenAI API key
    // it('should analyze valid FEN with question', async () => {
    //   const response = await request(app)
    //     .post('/api/chess/analyze')
    //     .send({
    //       fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    //       question: 'What is the opening position called?'
    //     });

    //   expect(response.status).toBe(200);
    //   expect(response.body.success).toBe(true);
    //   expect(response.body.data.analysis).toBeDefined();
    // });
  });

  describe('GET /api/chess/validate/:fen', () => {
    it('should validate correct starting position FEN', async () => {
      const fen = encodeURIComponent('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
      const response = await request(app)
        .get(`/api/chess/validate/${fen}`);

      expect(response.status).toBe(200);
      expect(response.body.isValid).toBe(true);
      expect(response.body.error).toBe(null);
    });

    it('should invalidate incorrect FEN', async () => {
      const fen = encodeURIComponent('invalid-fen');
      const response = await request(app)
        .get(`/api/chess/validate/${fen}`);

      expect(response.status).toBe(200);
      expect(response.body.isValid).toBe(false);
      expect(response.body.error).toBeDefined();
    });

    it('should validate minimal FEN (board position only)', async () => {
      const fen = encodeURIComponent('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR');
      const response = await request(app)
        .get(`/api/chess/validate/${fen}`);

      expect(response.status).toBe(200);
      expect(response.body.isValid).toBe(true);
    });
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('OK');
      expect(response.body.timestamp).toBeDefined();
    });
  });

  describe('404 handling', () => {
    it('should return 404 for unknown endpoints', async () => {
      const response = await request(app).get('/unknown-endpoint');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Endpoint not found');
    });
  });
});
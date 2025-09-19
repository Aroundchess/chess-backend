# Chess Backend API

A Node.js API that analyzes chess positions using FEN notation and AI-powered analysis.

## Features

- **FEN Validation**: Validates chess positions in FEN notation
- **AI Analysis**: Uses OpenAI GPT-4 to analyze chess positions and answer questions
- **RESTful API**: Clean REST endpoints for chess analysis
- **Error Handling**: Comprehensive error handling and validation

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment:
```bash
cp .env.example .env
```

3. Add your OpenAI API key to `.env`:
```
OPENAI_API_KEY=your_openai_api_key_here
```

4. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### POST /api/chess/analyze

Analyzes a chess position and answers questions about it.

**Request Body:**
```json
{
  "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  "question": "What is the best opening move for White?"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    "question": "What is the best opening move for White?",
    "analysis": "AI analysis of the position...",
    "timestamp": "2024-01-01T12:00:00.000Z"
  },
  "usage": {
    "prompt_tokens": 150,
    "completion_tokens": 200,
    "total_tokens": 350
  }
}
```

### GET /api/chess/validate/:fen

Validates FEN notation.

**Example:**
```
GET /api/chess/validate/rnbqkbnr%2Fpppppppp%2F8%2F8%2F8%2F8%2FPPPPPPPP%2FRNBQKBNR%20w%20KQkq%20-%200%201
```

**Response:**
```json
{
  "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  "isValid": true,
  "error": null
}
```

### GET /health

Health check endpoint.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

## Testing

Run tests:
```bash
npm test
```

## Example Usage

### Starting Position Analysis
```bash
curl -X POST http://localhost:3000/api/chess/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    "question": "What are the most popular opening moves?"
  }'
```

### Tactical Position
```bash
curl -X POST http://localhost:3000/api/chess/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "fen": "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4",
    "question": "Is there a fork available in this position?"
  }'
```

## Error Handling

The API returns appropriate HTTP status codes:

- `200`: Success
- `400`: Invalid input (bad FEN, missing parameters)
- `429`: Rate limit exceeded
- `500`: Server error
- `503`: AI service unavailable

## FEN Notation Support

This API supports full FEN notation as described in the documentation:

- Board position (required)
- Active color (w/b)
- Castling rights (KQkq)
- En passant target square
- Halfmove clock
- Fullmove number

Example: `rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1`
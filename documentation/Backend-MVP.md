# Chess Backend MVP

This document records what has been implemented so far for the backend-only MVP described in `Project-Plan.md`.

## Summary
- Node.js + Express server exposing a minimal REST API.
- Health-check endpoint implemented.
- Chess game endpoints implemented with move validation via `chess.js`.
- MongoDB persistence for games with basic indexes.
- JWT-based auth for protected routes.
- Rate limiting to mitigate abuse.
- Default port set to `8080` (overridable via `PORT`).

## Stack
- Express 4
- MongoDB Node driver 6
- chess.js 0.13.x (move validation and FEN updates)
- jsonwebtoken 9 (JWT verification)
- express-rate-limit 7 (global limiter)

## Run Locally
1. Install dependencies:
   - `npm install`
2. Set environment variables:
   - `export JWT_SECRET=your-secret`
   - `export MONGODB_URI='mongodb://localhost:27017/chess'`
   - Optional: `export PORT=8080` (defaults to 8080 if unset)
3. Start the server:
   - `npm start`
4. Health-check:
   - `curl http://localhost:8080/api/v1/health-check` → `{ "status": "healthy" }`

## Authentication
- Protected routes require `Authorization: Bearer <JWT>`.
- Tokens are verified with `JWT_SECRET`.
- Any payload is accepted; typical claims: `{ sub: "user-id" }`.

## Endpoints

### GET /api/v1/health-check
- Public (no auth required).
- Returns a structured response:
  - Example:
    {
      "success": true,
      "message": "Service is healthy | Version 0.1.0",
      "data": null,
      "statusCode": 200
    }

### POST /api/v1/games
- Purpose: Start a new game.
- Auth: Required.
- Body (JSON, optional fields):
  - `initialFen` (string): custom starting position.
  - `players.white` (string): white player id (defaults to `req.user.sub` if present).
  - `players.black` (string): black player id (optional).
- Response: `{ gameId, fen, status }`.
- Example:
  - `curl -X POST http://localhost:8080/api/v1/games \
     -H "Authorization: Bearer <TOKEN>" -H "Content-Type: application/json" \
     -d '{"players": {"black": "userB"}}'`

### GET /api/v1/games/:gameId
- Purpose: Retrieve game state.
- Auth: Required.
- Response: `{ gameId, fen, status, moves, players, createdAt, updatedAt }`.

### POST /api/v1/games/:gameId/move
- Purpose: Make a move (validated by chess.js).
- Auth: Required.
- Body (JSON):
  - `move`: SAN string (e.g., `"e4"`) or object `{ from, to, promotion? }`.
- Response: `{ gameId, fen, status, move }` where `move` echoes the applied move.
- Errors: `400 Illegal move` when invalid.

## Data Model
- Collection: `games`
  - `fen` (string): current position in FEN.
  - `status` (string): `ongoing | checkmate | stalemate | draw`.
  - `moves` (array): chronological list of applied moves with `{ san, from, to, piece, color, promotion, timestamp }`.
  - `players` (object): `{ white: string|null, black: string|null }`.
  - `createdBy` (string|null): creator user id.
  - `createdAt`, `updatedAt` (Date).
- Indexes:
  - `{ createdAt: -1 }`
  - `{ 'players.white': 1 }`
  - `{ 'players.black': 1 }`

## Notes & Next Steps (from MVP)
- Redis caching for frequently accessed data (e.g., rankings) is planned but not yet implemented.
- Horizontal scaling and Kubernetes orchestration are future concerns and out of scope for this MVP iteration.
- Monitoring and performance tuning to be added alongside caching.

## Environment Variables
- `PORT` (default `8080`)
- `JWT_SECRET` (required for protected routes)
- `MONGODB_URI` (MongoDB connection string, e.g., `mongodb://localhost:27017/chess`)

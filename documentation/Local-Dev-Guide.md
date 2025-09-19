# Local Development Guide

This guide covers running the chess-backend locally with MongoDB via Docker, configuring environment variables, and common troubleshooting.

## Prerequisites
- Node.js 18+ and npm
- Docker Desktop/OrbStack (with Docker Compose v2)

## Environment
- File: `.env` at the repo root.
- Loaded automatically at startup via `src/loadEnv.js`.
- Defaults are provided; adjust as needed:

```
PORT=8080
JWT_SECRET=change-me-in-prod
MONGODB_URI=mongodb://127.0.0.1:27017/chess
```

Notes:
- Using `127.0.0.1` avoids IPv6 `::1` issues some macOS setups hit with `localhost`.
- Keep `JWT_SECRET` secret in real deployments.

## MongoDB With Docker
- Compose file: `docker/docker-compose.yml`.
- NPM scripts (run from project root):
  - `npm run db:up` — start MongoDB in the background
  - `npm run db:ps` — show container status (should be "healthy")
  - `npm run db:logs` — tail MongoDB logs
  - `npm run db:down` — stop and remove the container (data persists in a Docker volume)

Direct Docker equivalents:
- `docker compose -f docker/docker-compose.yml up -d mongo`
- `docker compose -f docker/docker-compose.yml logs -f mongo`

Data persistence:
- Data is stored in the `mongo_data` Docker volume and survives `down`/`up`.
- To wipe data: `docker compose -f docker/docker-compose.yml down -v` (irreversible).

## Run The API
- Start DB: `npm run db:up`
- Start server: `npm start`
- Health check: `curl http://localhost:8080/api/v1/health-check`

Expected response:
```
{
  "success": true,
  "message": "Service is healthy | Version <version>",
  "data": null,
  "statusCode": 200
}
```

## Auth For Protected Routes
- Protected endpoints require a JWT in `Authorization: Bearer <token>`.
- For local testing (not production), you can mint a quick token:

```
node -e "console.log(require('jsonwebtoken').sign({ sub: 'user-123' }, process.env.JWT_SECRET||'change-me-in-prod'))"
```

Example request:
```
curl -X POST http://localhost:8080/api/v1/games \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"players": {"black": "userB"}}'
```

## Troubleshooting
- "connect ECONNREFUSED 127.0.0.1:27017":
  - Ensure Docker is running and `npm run db:up` shows the container as healthy (`npm run db:ps`).
  - Confirm `.env` has `MONGODB_URI=mongodb://127.0.0.1:27017/chess`.
- Container is `unhealthy`:
  - Check logs: `npm run db:logs`.
  - Ping DB: `docker exec chess-mongo mongosh --eval "db.runCommand({ ping: 1 })"` (expect `{ ok: 1 }`).
- Port conflicts on 27017:
  - Stop other Mongo instances or change the published port in `docker/docker-compose.yml` and update `MONGODB_URI`.
- Server can’t bind to port 8080:
  - Change `PORT` in `.env` and restart, or free that port.

## Optional: MongoDB Atlas
- Use an Atlas URI (e.g., `mongodb+srv://...`) in `MONGODB_URI`.
- Allow your IP in Atlas Network Access.
- Verify with: `mongosh "<your-uri>" --eval "db.runCommand({ ping: 1 })"`.


require('./loadEnv');

const express = require('express');
const rateLimit = require('express-rate-limit');
const { version } = require('../package.json');
const { connectMongo } = require('./db');
const { authRequired } = require('./middleware/auth');
const gamesRouter = require('./routes/games');

const app = express();
app.use(express.json());
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

app.get('/api/v1/health-check', (req, res) => {
  res.status(200).json({
    success: true,
    message: `Service is healthy | Version ${version}`,
    data: null,
    statusCode: 200,
  });
});

// Auth-protected chess endpoints
app.use('/api/v1/games', authRequired, gamesRouter);

const PORT = process.env.PORT || 8080;
async function start() {
  try {
    // Connect to MongoDB before starting server
    await connectMongo();
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err.message);
    // Continue starting the server so health-check still works, but game routes will fail until DB is up
  }

  app.listen(PORT, () => {
    console.log(`Chess backend listening on port ${PORT}`);
  });
}

start();

const { MongoClient, ObjectId } = require('mongodb');

let client;
let db;

async function connectMongo(uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/chess') {
  if (db) return db;
  client = new MongoClient(uri, { ignoreUndefined: true });
  await client.connect();
  // Use the database from the URI (defaults to driver's default if unspecified)
  db = client.db();

  await ensureIndexes();
  return db;
}

async function ensureIndexes() {
  const games = getCollection('games');
  await Promise.all([
    games.createIndex({ createdAt: -1 }),
    games.createIndex({ 'players.white': 1 }),
    games.createIndex({ 'players.black': 1 }),
  ]);
}

function getDb() {
  if (!db) throw new Error('MongoDB not connected');
  return db;
}

function getCollection(name) {
  return getDb().collection(name);
}

function isConnected() {
  return !!db;
}

module.exports = {
  connectMongo,
  getDb,
  getCollection,
  isConnected,
  ObjectId,
};

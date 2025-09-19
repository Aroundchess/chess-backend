const fs = require('fs');
const path = require('path');

function parseLine(line) {
  const eqIndex = line.indexOf('=');
  if (eqIndex === -1) return null;

  let key = line.slice(0, eqIndex).trim();
  if (!key) return null;

  if (key.startsWith('export ')) {
    key = key.slice('export '.length).trim();
  }

  let value = line.slice(eqIndex + 1).trim();
  if (!value) return { key, value: '' };

  const firstChar = value[0];
  const lastChar = value[value.length - 1];
  if ((firstChar === '"' && lastChar === '"') || (firstChar === "'" && lastChar === "'")) {
    value = value.slice(1, -1);
  } else {
    const hashIndex = value.indexOf('#');
    if (hashIndex !== -1) {
      value = value.slice(0, hashIndex).trim();
    }
  }

  return { key, value };
}

function loadEnv(filename = '.env') {
  const envPath = path.resolve(__dirname, '..', filename);
  let content;
  try {
    content = fs.readFileSync(envPath, 'utf8');
  } catch (err) {
    if (err.code !== 'ENOENT') {
      console.warn(`Failed to load ${filename}: ${err.message}`);
    }
    return;
  }

  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const parsed = parseLine(trimmed);
    if (!parsed) continue;

    const { key, value } = parsed;
    if (typeof process.env[key] === 'undefined') {
      process.env[key] = value;
    }
  }
}

loadEnv();
loadEnv('.env.local');

module.exports = { loadEnv };

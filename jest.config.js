module.exports = {
  testEnvironment: 'node',
  collectCoverageFrom: [
    'utils/**/*.js',
    'services/**/*.js',
    'routes/**/*.js',
    '!**/*.test.js'
  ],
  testMatch: [
    '**/__tests__/**/*.js',
    '**/?(*.)+(spec|test).js'
  ],
  verbose: true
};
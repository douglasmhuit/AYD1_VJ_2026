module.exports = {
  testEnvironment: 'node',
  verbose: true,
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/app.js',
    '!src/config/database.js',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  testTimeout: 10000,
   projects: [
    {
      displayName: 'unit',
      testMatch: ['**/test/unit/**/*.test.js'],
      setupFilesAfterEnv: ['<rootDir>/test/setup.unit.js'],
      testEnvironment: 'node',
    },
    {
      displayName: 'integration',
      testMatch: ['**/test/integration/**/*.test.js'],
      setupFilesAfterEnv: ['<rootDir>/test/setup.integration.js'],
      testEnvironment: 'node',
    },
  ],
};
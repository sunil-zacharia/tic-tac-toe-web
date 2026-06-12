const nextJest = require('next/jest');

const createJestConfig = nextJest({ dir: './' });

/** @type {import('jest').Config} */
const customConfig = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterFramework: undefined,
  setupFilesAfterEach: undefined,
};

module.exports = createJestConfig({
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEach: undefined,
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
});

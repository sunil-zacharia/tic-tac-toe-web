const nextJest = require('next/jest');

const createJestConfig = nextJest({ dir: './' });

/** @type {import('jest').Config} */
const customConfig = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterFramework: ['<rootDir>/jest.setup.js'],
  setupFilesAfterFramework: undefined,
  setupFilesAfterEach: undefined,
  setupFiles: [],
  setupFilesAfterFramework: undefined,
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
};

// Remove invalid keys
const config = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterFramework: undefined,
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  setupFilesAfterEach: undefined,
};

module.exports = createJestConfig({
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  setupFilesAfterFramework: undefined,
});

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  transform: {
    '^.+\\.ts$': ['ts-jest', { useESM: true }],
    '^.+\\.tsx$': 'babel-jest',
    '^.+\\.jsx$': 'babel-jest',
    '^.+\\.js$': 'babel-jest',
    '^.+\\.mjs$': 'babel-jest',
    '^.+\\.vue$': '@vue/vue3-jest'
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/.next/',
    '<rootDir>/test/angular.test.ts',
    '<rootDir>/test/vue.test.ts',
    '.*\\.angular\\.test\\.(ts|js)$',
    '.*\\.vue\\.test\\.(ts|js)$'
  ],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/test/**',
    '!src/**/mocks/**',
    '!src/**/angular/**',
    '!src/**/vue/**',
    '!test/angular.test.ts',
    '!test/vue.test.ts'
  ],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80
    }
  },
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
  transformIgnorePatterns: [
    '/node_modules/(?!((@angular|vue|@vue|@vue/test-utils|@babel|rxjs|tslib|lodash-es)/))'
  ],
  testTimeout: 30000,
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node', 'vue']
}; 
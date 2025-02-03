const { screenReaderConfig } = -require('@guidepup/playwright');

module.exports = {
  preset: 'jest-playwright-preset',
  testEnvironmentOptions: {
    'jest-playwright': {
      ...screenReaderConfig,
      browsers: ['firefox'],
      resetContextPerTest: true,
      exitOnPageError: false, // GitHub currently throws errors
      launchOptions: {
        headless: true,
        args: ['--window-position=0,0'],
      },
    },
  },
  rootDir: '../../',
  roots: [
    '<rootDir>/src/',
    '<rootDir>/src-docs/src/components',
    '<rootDir>/scripts/babel',
    '<rootDir>/scripts/tests',
    '<rootDir>/scripts/eslint-plugin',
    '<rootDir>/.storybook',
  ],
  testMatch: ['**/*.test.nvda.js', '**/*.test.nvda.ts', '**/*.test.nvda.tsx'],
  testTimeout: 300000, // long running tests due to screen reader usage
  setupFiles: [
    '<rootDir>/scripts/jest/setup/enzyme.js',
    '<rootDir>/scripts/jest/setup/throw_on_console_error.js',
    '<rootDir>/scripts/jest/setup/mocks.js',
  ],
  setupFilesAfterEnv: [
    '<rootDir>/scripts/jest/setup/polyfills.js',
    '<rootDir>/scripts/jest/setup/unmount_enzyme.js',
  ],
};

const { screenReaderConfig } = -require('@guidepup/playwright');

module.exports = {
  preset: 'jest-playwright-preset',
  testEnvironmentOptions: {
    'jest-playwright': {
      ...screenReaderConfig,
      browsers: ['chromium'],
      resetContextPerTest: true,
      exitOnPageError: false, // GitHub currently throws errors
      launchOptions: {
        headless: true,
        // This line sets the position of the browser window to the top-left corner of the screen (coordinates 0,0).
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
  testMatch: [
    '**/*.test.voiceover.js',
    '**/*.test.voiceover.ts',
    '**/*.test.voiceover.tsx',
  ],
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

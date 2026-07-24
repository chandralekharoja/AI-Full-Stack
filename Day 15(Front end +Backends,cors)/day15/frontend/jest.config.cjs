module.exports = {
  testEnvironment: "jsdom",
  setupFiles: ["<rootDir>/jest.polyfills.js"],
  moduleNameMapper: {
    "\\.(css|less|scss)$": "<rootDir>/src/tests/styleMock.js",
  },
  setupFilesAfterEnv: ["@testing-library/jest-dom"],
};

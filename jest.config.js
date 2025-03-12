module.exports = {
  testTimeout: 10000,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov"],
  testEnvironment: "node",
  collectCoverageFrom: [
    "src/**/*.js",
    "!src/server.js",
    "!tests/**/*.js"
  ],
  transform: {
    "^.+\\.js$": "babel-jest"
  }
};
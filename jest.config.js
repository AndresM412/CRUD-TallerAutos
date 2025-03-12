module.exports = {
  testTimeout: 10000, // Aumenta el timeout global a 10000 ms (10 segundos)
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov"],
  testEnvironment: "node",
  collectCoverageFrom: [
    "src/**/*.js",
    "!src/server.js",  // Excluye el archivo server.js si no deseas medir su cobertura
    "!tests/**/*.js"   // Excluye los archivos de prueba
  ],
  transform: {
    "^.+\\.js$": "babel-jest" // Usa Babel para transformar archivos .js
  },
  transformIgnorePatterns: [
    "/node_modules/(?!bson).+\\.js$" // Ignora todos los archivos en node_modules, excepto los de bson
  ]
};
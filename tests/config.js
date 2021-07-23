/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/en/configuration.html
 */

export default {
  coverageProvider: "v8",
  testEnvironment: "node",
  transform: {
    "\\.m?jsx?$": "jest-esm-transformer"
  },
  clearMocks: true,
  setupFiles: ["dotenv/config"],
}

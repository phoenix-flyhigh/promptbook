// @ts-check
/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
const config = {
  _comment:
  "This config was generated using 'stryker init'. Please take a look at: https://stryker-mutator.io/docs/stryker-js/configuration/ for more information.",
  packageManager: "npm",
  reporters: ["html", "clear-text", "progress", "dashboard"],
  testRunner: "jest",
  testRunner_comment:
  "Take a look at (missing 'homepage' URL in package.json) for information about the jest plugin.",
  coverageAnalysis: "perTest",
  mutate:['app/**/page.tsx'],
  thresholds: {
    high: 90,
    low: 70,
    break: 50
  },
  concurrency: 6,
  timeoutFactor: 4,
  timeoutMS: 60000
};
export default config;

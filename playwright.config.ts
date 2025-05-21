import { PlaywrightTestConfig, test } from "@playwright/test";

const config: PlaywrightTestConfig = {
  testDir: "./src/features",
  timeout: 30000,
  expect: {
    timeout: 5000,
  },
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [["html"], ["allure-playwright"]],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    baseURL: "",
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
    video: "on-first-retry",
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "API",
      testMatch: /.*\.api\.spec\.ts/,
    },
    {
      name: "UI",
      testMatch: /.*\.spec\.ts/,
      testIgnore: /.*\.api\.spec\.ts/,
    },
  ],
};

interface Environment {
  neevadminBaseURL: string;
  compassBaseURL: string;
}

export function setBaseURL(app: string) {
  const env = process.env.ENV;
  switch (env) {
    case "uat":
      config.use.baseURL = uat[app];
      break;
    case "dev":
      config.use.baseURL = dev[app];
      break;
    case "test-automation-1":
      config.use.baseURL = testAutomation1[app];
      break;
    default:
      return new Error(`App ${app} in Environment ${env} not found`);
  }
  test.use({ baseURL: config.use.baseURL });
}

const uat: Environment = {
  neevadminBaseURL: "https://automationintesting.online",
  compassBaseURL: "https://automationintesting.online",
}

const dev: Environment = {
  neevadminBaseURL: "https://automationintesting.online",
  compassBaseURL: "https://automationintesting.online",
}

const testAutomation1: Environment = {
  neevadminBaseURL: "https://automationintesting.online",
  compassBaseURL: "https://automationintesting.online",
}

export default config;

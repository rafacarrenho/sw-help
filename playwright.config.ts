import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  use: {
    baseURL: 'http://127.0.0.1:4321',
    trace: 'retain-on-failure',
    launchOptions: { channel: 'chrome' },
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    {
      name: 'mobile',
      use: { ...devices['iPhone 13'], defaultBrowserType: 'chromium' },
    },
  ],
  webServer: {
    command:
      'WRANGLER_LOG_PATH=/tmp/sw-help-wrangler.log pnpm exec wrangler dev --config wrangler.jsonc --ip 127.0.0.1 --port 4321 --log-level error',
    url: 'http://127.0.0.1:4321',
    reuseExistingServer: !process.env.CI,
  },
});

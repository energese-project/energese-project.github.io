import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'dev',
      use: { ...devices['Desktop Chrome'] },
    },
    // The same suite against the built bundle. `vite preview` falls back to
    // index.html for any path that is not a file, which is what GitHub Pages
    // does via the 404.html copy — the two are byte-identical documents. That
    // is what makes the deep-link and 404 tests meaningful rather than a test
    // of Vite's dev-mode fallback.
    {
      name: 'production',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:4173',
      },
    },
  ],
  webServer: [
    {
      command: 'npx vite',
      url: 'http://localhost:5173',
      reuseExistingServer: !process.env.CI,
    },
    {
      command: 'npm run build && npm run preview',
      url: 'http://localhost:4173',
      reuseExistingServer: !process.env.CI,
    },
  ],
});

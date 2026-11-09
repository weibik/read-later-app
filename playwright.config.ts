import { defineConfig } from '@playwright/test';

const TEST_DATABASE_URL =
  'postgresql://user:password@localhost:5432/readlater_test';

if (!TEST_DATABASE_URL.includes('test')) {
  throw new Error('E2E DATABASE_URL must point at a test database.');
}

const API_PORT = 3100;
const CLIENT_PORT = 5273;
const FIXTURE_PORT = 4000;

const serverEnv = {
  PORT: String(API_PORT),
  REDIS_PORT: '6380',
  CORS_ORIGIN: `http://localhost:${CLIENT_PORT}`,
  DATABASE_URL: TEST_DATABASE_URL,
  SECRET: 'test-secret',
};

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  workers: 1,
  use: {
    baseURL: `http://localhost:${CLIENT_PORT}`,
    trace: 'on-first-retry',
  },
  projects: [{ name: 'firefox', use: { browserName: 'firefox' } }],
  webServer: [
    {
      command: 'node e2e/fixture-server.mjs',
      url: `http://localhost:${FIXTURE_PORT}/page.html`,
      reuseExistingServer: false,
    },
    {
      command:
        'pnpm --filter server dev & pnpm --filter server dev:worker & wait',
      url: `http://localhost:${API_PORT}/bookmarks`,
      env: serverEnv,
      reuseExistingServer: false,
    },
    {
      command: `pnpm --filter client exec vite --port ${CLIENT_PORT} --strictPort`,
      url: `http://localhost:${CLIENT_PORT}`,
      env: { VITE_API_URL: `http://localhost:${API_PORT}` },
      reuseExistingServer: false,
    },
  ],
});

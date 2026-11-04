import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    env: {
      DATABASE_URL: 'postgresql://user:password@localhost:5432/readlater_test',
      SECRET: 'test-secret',
    },
    fileParallelism: false,
    setupFiles: ['./src/test/setup.ts'],
  },
});

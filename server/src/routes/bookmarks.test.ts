import { describe, it, expect, vi } from 'vitest';
import app from '../app';

vi.mock('../queue/queue', () => ({
  default: { add: vi.fn() },
}));

vi.mock('../cache/helpers', () => ({
  getCachedBookmarks: vi.fn().mockResolvedValue(null),
  setCachedBookmarks: vi.fn(),
  delCachedBookmarks: vi.fn(),
}));

describe('GET /auth/healthcheck', () => {
  it('responds with 200', async () => {
    const response = await app.request('/auth/healthcheck');
    expect(response.status).toBe(200);
  });
});

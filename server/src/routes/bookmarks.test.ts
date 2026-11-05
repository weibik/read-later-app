import { describe, it, expect, vi, beforeEach } from 'vitest';
import app from '../app';
import {} from 'vitest';
import { createTestUser, makeToken } from '../test/helpers';
import bookmarksQueue from '../queue/queue';

vi.mock('../queue/queue', () => ({
  default: { add: vi.fn() },
}));

vi.mock('../cache/helpers', () => ({
  getCachedBookmarks: vi.fn().mockResolvedValue(null),
  setCachedBookmarks: vi.fn(),
  delCachedBookmarks: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe('POST /bookmarks', () => {
  it('rejects a request without a token with 401', async () => {
    const res = await app.request('/bookmarks', {
      method: 'POST',
      body: JSON.stringify({ url: 'https://example.com' }),
    });
    expect(res.status).toBe(401);
  });

  it('rejects invalid tags with 400 and does not enqueue a job', async () => {
    const userId = await createTestUser('test-user');
    const token = await makeToken(userId);
    const res = await app.request('/bookmarks', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: 'https://example.com', tags: 'react' }),
    });
    expect(res.status).toBe(400);
    expect(bookmarksQueue.add).not.toHaveBeenCalled();
  });
});

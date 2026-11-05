import { describe, it, expect, vi, beforeEach } from 'vitest';
import app from '../app';
import { createTestUser, makeToken } from '../test/helpers';
import bookmarksQueue from '../queue/queue';
import db from '../db/db';
import { bookmarks, tags } from '../db/schema';
import { delCachedBookmarks } from '../cache/helpers';

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
  it('creates a bookmark with tags, enqueues a job and clears the cache', async () => {
    const userId = await createTestUser('test-user');
    const token = await makeToken(userId);
    const res = await app.request('/bookmarks', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: 'https://example.com',
        tags: ['react', 'docs'],
      }),
    });
    const body = await res.json();

    expect(res.status).toBe(201);
    expect(body.status).toBe('pending');
    expect(body.url).toBe('https://example.com');
    expect(body.tags).toEqual(['react', 'docs']);

    const bookmarksRows = await db.select().from(bookmarks);
    expect(bookmarksRows).toHaveLength(1);

    const tagRows = await db.select().from(tags);
    expect(tagRows.map((t) => t.name).sort()).toEqual(['docs', 'react']);

    expect(bookmarksQueue.add).toHaveBeenCalledWith(
      'bookmarksQueue',
      { userId, url: 'https://example.com', id: body.id },
      expect.anything(),
    );

    expect(delCachedBookmarks).toHaveBeenCalledWith(userId);
  });

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

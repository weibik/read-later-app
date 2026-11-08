import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { eq } from 'drizzle-orm';
import db from '../db/db';
import { bookmarks } from '../db/schema';
import { createTestUser } from '../test/helpers';
import { delCachedBookmarks } from '../cache/helpers';
import {
  processBookmark,
  handleFailedJob,
  type BookmarkJob,
} from './processBookmark';

vi.mock('../cache/helpers', () => ({
  delCachedBookmarks: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

function makeJob(overrides: Partial<BookmarkJob> = {}): BookmarkJob {
  return {
    data: { id: 1, userId: 1, url: 'https://example.com' },
    attemptsMade: 1,
    opts: { attempts: 3 },
    ...overrides,
  };
}

async function seedBookmark() {
  const userId = await createTestUser();
  const [row] = await db
    .insert(bookmarks)
    .values({ url: 'https://example.com', userId })
    .returning();
  return { userId, bookmarkId: row.id };
}

function jobFor(userId: number | string, bookmarkId: number) {
  return makeJob({
    data: { id: bookmarkId, userId, url: 'https://example.com' },
  });
}

async function getRow(bookmarkId: number) {
  const [row] = await db
    .select()
    .from(bookmarks)
    .where(eq(bookmarks.id, bookmarkId));
  return row;
}

function stubFetch(html: string) {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({ ok: true, text: async () => html }),
  );
}

describe('processBookmark', () => {
  it('saves title, description and image and marks the bookmark complete', async () => {
    const { userId, bookmarkId } = await seedBookmark();
    stubFetch(`
      <html><head>
        <title>  My Page  </title>
        <meta name="description" content="A description">
        <meta property="og:image" content="https://example.com/img.png">
      </head></html>
    `);

    await processBookmark(jobFor(userId, bookmarkId));

    const row = await getRow(bookmarkId);
    expect(row.status).toBe('complete');
    expect(row.title).toBe('My Page');
    expect(row.description).toBe('A description');
    expect(row.image).toBe('https://example.com/img.png');
  });

  it('stores null for description and image when the page has no such tags', async () => {
    const { userId, bookmarkId } = await seedBookmark();
    stubFetch('<html><head><title>Only a title</title></head></html>');

    await processBookmark(jobFor(userId, bookmarkId));

    const row = await getRow(bookmarkId);
    expect(row.status).toBe('complete');
    expect(row.title).toBe('Only a title');
    expect(row.description).toBeNull();
    expect(row.image).toBeNull();
  });

  it('falls back to og:description when there is no meta description', async () => {
    const { userId, bookmarkId } = await seedBookmark();
    stubFetch(`
      <html><head>
        <title>Page</title>
        <meta property="og:description" content="From Open Graph">
      </head></html>
    `);

    await processBookmark(jobFor(userId, bookmarkId));

    const row = await getRow(bookmarkId);
    expect(row.description).toBe('From Open Graph');
  });

  it('falls back to twitter:image when there is no og:image', async () => {
    const { userId, bookmarkId } = await seedBookmark();
    stubFetch(`
      <html><head>
        <title>Page</title>
        <meta name="twitter:image" content="https://example.com/tw.png">
      </head></html>
    `);

    await processBookmark(jobFor(userId, bookmarkId));

    const row = await getRow(bookmarkId);
    expect(row.image).toBe('https://example.com/tw.png');
  });

  it('clears the cache with a numeric user id even when the job data has a string', async () => {
    const { userId, bookmarkId } = await seedBookmark();
    stubFetch('<html><head><title>Page</title></head></html>');

    await processBookmark(jobFor(String(userId), bookmarkId));

    expect(delCachedBookmarks).toHaveBeenCalledTimes(1);
    expect(delCachedBookmarks).toHaveBeenCalledWith(userId);
  });

  it('throws when fetch rejects, leaves the row pending and does not clear the cache', async () => {
    const { userId, bookmarkId } = await seedBookmark();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(new Error('network down')),
    );

    await expect(processBookmark(jobFor(userId, bookmarkId))).rejects.toThrow(
      'network down',
    );

    const row = await getRow(bookmarkId);
    expect(row.status).toBe('pending');
    expect(delCachedBookmarks).not.toHaveBeenCalled();
  });

  it('throws with the status code when the response is not ok', async () => {
    const { userId, bookmarkId } = await seedBookmark();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: false, status: 404 }),
    );

    await expect(processBookmark(jobFor(userId, bookmarkId))).rejects.toThrow(
      '404',
    );

    const row = await getRow(bookmarkId);
    expect(row.status).toBe('pending');
  });
});

describe('handleFailedJob', () => {
  it('marks the bookmark failed and clears the cache on the final attempt', async () => {
    const { userId, bookmarkId } = await seedBookmark();

    await handleFailedJob({ ...jobFor(userId, bookmarkId), attemptsMade: 3 });

    const row = await getRow(bookmarkId);
    expect(row.status).toBe('failed');
    expect(delCachedBookmarks).toHaveBeenCalledWith(userId);
  });

  it('leaves the bookmark pending and keeps the cache when retries remain', async () => {
    const { userId, bookmarkId } = await seedBookmark();

    await handleFailedJob({ ...jobFor(userId, bookmarkId), attemptsMade: 2 });

    const row = await getRow(bookmarkId);
    expect(row.status).toBe('pending');
    expect(delCachedBookmarks).not.toHaveBeenCalled();
  });

  it('treats a job without opts.attempts as a single attempt', async () => {
    const { userId, bookmarkId } = await seedBookmark();

    await handleFailedJob({
      ...jobFor(userId, bookmarkId),
      attemptsMade: 1,
      opts: {},
    });

    const row = await getRow(bookmarkId);
    expect(row.status).toBe('failed');
  });

  it('does nothing when there is no job', async () => {
    await handleFailedJob(undefined);

    expect(delCachedBookmarks).not.toHaveBeenCalled();
  });

  it('handles string ids as they come back from Redis', async () => {
    const { userId, bookmarkId } = await seedBookmark();

    await handleFailedJob(
      makeJob({
        data: {
          id: String(bookmarkId),
          userId: String(userId),
          url: 'https://example.com',
        },
        attemptsMade: 3,
      }),
    );

    const row = await getRow(bookmarkId);
    expect(row.status).toBe('failed');
    expect(delCachedBookmarks).toHaveBeenCalledWith(userId);
  });

  it('only marks the targeted bookmark as failed', async () => {
    const { userId, bookmarkId } = await seedBookmark();
    const [other] = await db
      .insert(bookmarks)
      .values({ url: 'https://other.com', userId })
      .returning();

    await handleFailedJob({ ...jobFor(userId, bookmarkId), attemptsMade: 3 });

    expect((await getRow(bookmarkId)).status).toBe('failed');
    expect((await getRow(other.id)).status).toBe('pending');
  });
});

import { Hono } from 'hono';
import db from '../db/db';
import { bookmarks, tags, bookmark_tags } from '../db/schema';
import { eq, and, desc, inArray, asc } from 'drizzle-orm';
import bookmarksQueue from '../queue/queue';
import {
  getCachedBookmarks,
  setCachedBookmarks,
  delCachedBookmarks,
} from '../cache/helpers';
import type { appVariables } from '../types';
import { parseBody } from '../utils/parseBody';
import { parseTags } from '../utils/parseTags';
import { isValidUrl } from '../utils/isValidUrl';

const STALE_MS = 10 * 60 * 1000;

const bookmarks_app = new Hono<{ Variables: appVariables }>();

async function failStaleBookmarks<
  T extends { id: number; status: string; pendingSince: Date | string },
>(userId: number, list: T[]): Promise<T[]> {
  const staleIds = list
    .filter(
      (b) =>
        b.status === 'pending' &&
        Date.now() - new Date(b.pendingSince).getTime() > STALE_MS,
    )
    .map((b) => b.id);
  if (staleIds.length === 0) return list;
  await db
    .update(bookmarks)
    .set({ status: 'failed' })
    .where(
      and(inArray(bookmarks.id, staleIds), eq(bookmarks.status, 'pending')),
    );
  await delCachedBookmarks(userId);
  return list.map((b) =>
    staleIds.includes(b.id) ? { ...b, status: 'failed' } : b,
  );
}

bookmarks_app.post('/', async (c) => {
  const body = await parseBody(c);
  if (!body || typeof body.url !== 'string') {
    return c.json({ message: 'Invalid request body.' }, 400);
  }
  const tagNames = parseTags(body.tags);
  if (tagNames === null) return c.json({ message: 'Invalid tags.' }, 400);
  const url = body.url;
  const userId = c.get('userId');
  if (!isValidUrl(url)) {
    return c.json({ message: 'Invalid URL' }, 400);
  }

  const bookmark = await db.transaction(async (tx) => {
    const [row] = await tx
      .insert(bookmarks)
      .values({ url, status: 'pending', userId })
      .returning();

    if (tagNames.length > 0) {
      await tx
        .insert(tags)
        .values(tagNames.map((name) => ({ name })))
        .onConflictDoNothing();

      const tagRows = await tx
        .select()
        .from(tags)
        .where(inArray(tags.name, tagNames));

      await tx
        .insert(bookmark_tags)
        .values(
          tagRows.map((tag) => ({ bookmark_id: row.id, tag_id: tag.id })),
        );
    }

    return row;
  });

  await bookmarksQueue.add(
    'bookmarksQueue',
    { userId, url, id: bookmark.id },
    {
      attempts: 3,
      backoff: { type: 'exponential', delay: 2000 },
    },
  );
  await delCachedBookmarks(userId);
  return c.json({ ...bookmark, tags: tagNames }, 201);
});

bookmarks_app.get('/', async (c) => {
  const userId = c.get('userId');
  const cache = await getCachedBookmarks(userId);
  if (cache) {
    return c.json(await failStaleBookmarks(userId, cache), 200);
  }
  const rows = await db
    .select({
      id: bookmarks.id,
      url: bookmarks.url,
      status: bookmarks.status,
      title: bookmarks.title,
      description: bookmarks.description,
      image: bookmarks.image,
      createdAt: bookmarks.createdAt,
      pendingSince: bookmarks.pendingSince,
      userId: bookmarks.userId,
      tagName: tags.name,
    })
    .from(bookmarks)
    .leftJoin(bookmark_tags, eq(bookmark_tags.bookmark_id, bookmarks.id))
    .leftJoin(tags, eq(tags.id, bookmark_tags.tag_id))
    .where(eq(bookmarks.userId, userId))
    .orderBy(desc(bookmarks.createdAt), asc(tags.name));

  type BookmarkWithTags = Omit<(typeof rows)[number], 'tagName'> & {
    tags: string[];
  };
  const grouped = new Map<number, BookmarkWithTags>();
  for (const row of rows) {
    const { tagName, ...bookmark } = row;
    if (!grouped.has(bookmark.id)) {
      grouped.set(bookmark.id, { ...bookmark, tags: [] });
    }
    let entry = grouped.get(bookmark.id);
    if (!entry) {
      entry = { ...bookmark, tags: [] };
      grouped.set(bookmark.id, entry);
    }
    if (tagName) {
      entry.tags.push(tagName);
    }
  }
  const result = Array.from(grouped.values());

  const checked = await failStaleBookmarks(userId, result);
  await setCachedBookmarks(userId, checked);
  return c.json(checked, 200);
});

bookmarks_app.delete('/:id', async (c) => {
  const userId = c.get('userId');
  const id = parseInt(c.req.param('id'));
  const [deleted] = await db
    .delete(bookmarks)
    .where(and(eq(bookmarks.id, id), eq(bookmarks.userId, userId)))
    .returning();
  if (!deleted) {
    return c.json({ message: 'Bookmark not found' }, 404);
  }
  await delCachedBookmarks(userId);
  return c.json(deleted, 200);
});

bookmarks_app.post('/:id/retry', async (c) => {
  const userId = c.get('userId');
  const id = parseInt(c.req.param('id'));
  const [bookmark] = await db
    .update(bookmarks)
    .set({ status: 'pending', pendingSince: new Date() })
    .where(
      and(
        eq(bookmarks.id, id),
        eq(bookmarks.userId, userId),
        eq(bookmarks.status, 'failed'),
      ),
    )
    .returning();
  if (!bookmark) {
    return c.json({ message: 'Bookmark not found' }, 404);
  }
  await bookmarksQueue.add(
    'bookmarksQueue',
    { userId, url: bookmark.url, id: bookmark.id },
    {
      attempts: 3,
      backoff: { type: 'exponential', delay: 2000 },
    },
  );
  await delCachedBookmarks(userId);
  return c.json({ ...bookmark, tags: [] });
});

export default bookmarks_app;

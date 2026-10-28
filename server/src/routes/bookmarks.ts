import { Hono } from 'hono';
import db from '../db/db';
import { bookmarks, tags, bookmark_tags } from '../db/schema';
import { eq, and, desc } from 'drizzle-orm';
import bookmarksQueue from '../queue/queue';
import {
  getCachedBookmarks,
  setCachedBookmarks,
  delCachedBookmarks,
} from '../cache/helpers';
import { appVariables } from '../types';

const bookmarks_app = new Hono<{ Variables: appVariables }>();

function isValidUrl(value: string) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

bookmarks_app.post('/', async (c) => {
  const userId = c.get('userId');
  const { url } = await c.req.json();
  if (!url) {
    return c.json({ message: 'Webpage not found' }, 400);
  }
  if (!isValidUrl(url)) {
    return c.json({ message: 'Invalid URL' }, 400);
  }

  const [bookmark] = await db
    .insert(bookmarks)
    .values({
      url: url,
      status: 'pending',
      userId: userId,
    })
    .returning();
  await bookmarksQueue.add(
    'bookmarksQueue',
    { userId, url, id: bookmark.id },
    {
      attempts: 3,
      backoff: { type: 'exponential', delay: 2000 },
    },
  );
  await delCachedBookmarks(userId);
  return c.json({ ...bookmark, tags: [] }, 201);
});

bookmarks_app.get('/', async (c) => {
  const userId = c.get('userId');
  const cache = await getCachedBookmarks(userId);
  if (cache) {
    return c.json(cache, 200);
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
      userId: bookmarks.userId,
      tagName: tags.name,
    })
    .from(bookmarks)
    .leftJoin(bookmark_tags, eq(bookmark_tags.bookmark_id, bookmarks.id))
    .leftJoin(tags, eq(tags.id, bookmark_tags.tag_id))
    .where(eq(bookmarks.userId, userId))
    .orderBy(desc(bookmarks.createdAt));

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

  await setCachedBookmarks(userId, result);
  return c.json(result, 200);
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
    .set({ status: 'pending' })
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
